#!/usr/bin/env node
// TCP proxy: the web app derives its WS URL as ws://<host>:<httpPort+1>/ws
// (shinkai convention). Behind the vite proxy that's :1501, which has no
// service — forward it to the node's WS port. Raw TCP relays the WS upgrade.
// (ESM: the @hanzo/ai package is "type":"module", so use import, not require.)
import net from 'node:net';
const LISTEN = Number(process.env.WS_PROXY_PORT || 1501);
const [TH, TP] = (process.env.NODE_WS || '127.0.0.1:3701').split(':');
net
  .createServer((c) => {
    const up = net.connect(Number(TP), TH);
    c.on('error', () => up.destroy());
    up.on('error', () => c.destroy());
    c.pipe(up);
    up.pipe(c);
  })
  .listen(LISTEN, '0.0.0.0', () => console.log(`ws-proxy :${LISTEN} -> ${TH}:${TP}`));
