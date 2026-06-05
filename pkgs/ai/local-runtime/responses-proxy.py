#!/usr/bin/env python3
"""Adapter: hanzo-node's OpenAI provider POSTs /v1/engine/responses, but
hanzo-engine serves the OpenAI Responses API at /v1/responses. Rewrite the path
and force enable_thinking=false (Qwen-family thinking streams reasoning + hangs
the node). Pure streaming passthrough otherwise. Run: python3 responses-proxy.py
"""
import json, urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
UP = "http://127.0.0.1:36902"   # hanzo-engine (zen-coder). 127.0.0.1 — NOT localhost (IPv6 ::1 fails).
class H(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    def log_message(self, *a): pass
    def _fwd(self, method):
        n = int(self.headers.get("Content-Length", 0) or 0)
        body = self.rfile.read(n) if n else b""
        path = self.path.replace("/v1/engine/", "/v1/")
        if body and ("responses" in path or "chat/completions" in path):
            try:
                o = json.loads(body); o.setdefault("enable_thinking", False); o["model"] = "default"
                body = json.dumps(o).encode()
            except Exception: pass
        try:
            req = urllib.request.Request(UP + path, data=body if body else None, method=method)
            for k, v in self.headers.items():
                if k.lower() not in ("host","content-length","connection","accept-encoding"): req.add_header(k, v)
            r = urllib.request.urlopen(req, timeout=180)
            self.send_response(r.status)
            for k, v in r.headers.items():
                if k.lower() not in ("connection","transfer-encoding","content-length"): self.send_header(k, v)
            self.end_headers()
            while True:
                c = r.read(4096)
                if not c: break
                self.wfile.write(c); self.wfile.flush()
        except Exception:
            try: self.send_response(502); self.end_headers()
            except Exception: pass
    def do_GET(self): self._fwd("GET")
    def do_POST(self): self._fwd("POST")
ThreadingHTTPServer(("127.0.0.1", 36906), H).serve_forever()
