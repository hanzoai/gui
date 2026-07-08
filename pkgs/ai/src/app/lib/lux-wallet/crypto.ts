/**
 * The wallet's ONE crypto engine: luxfi/crypto compiled to WASM.
 *
 * This is the literal luxfi/crypto Go code (bit-identical to the on-chain Lux
 * precompiles) exposing REAL ML-DSA-65 (FIPS-204 PQ), secp256k1, keccak256/
 * sha3/shake, X-Wing KEM, and BIP-44 / service-identity key derivation. There
 * is no second crypto library in this wallet — key derivation, EVM tx signing,
 * and EIP-191 sign-in all go through this module.
 *
 * The WASM binary is gzip+base64-embedded (crypto-wasm.b64.ts) and decoded at
 * runtime. Embedding (rather than a `?url` asset) is deliberate: @hanzo/ai is a
 * LIBRARY that gets re-bundled by each host app (desktop/web), and an embedded
 * blob survives that nesting with no external asset URL to resolve or serve.
 */
import init, { type LuxCrypto } from '@luxfi/crypto';

import { CRYPTO_WASM_GZ_B64 } from './crypto-wasm.b64';

let instance: Promise<LuxCrypto> | null = null;

/** base64 → bytes. */
function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

/** Decode + gunzip the embedded WASM to its raw bytes. */
async function loadWasmBytes(): Promise<Uint8Array> {
  const gz = b64ToBytes(CRYPTO_WASM_GZ_B64);
  const stream = new Blob([gz])
    .stream()
    .pipeThrough(new DecompressionStream('gzip'));
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

/** Load (once) and return the luxfi/crypto WASM instance. */
export function getLuxCrypto(): Promise<LuxCrypto> {
  if (!instance) {
    instance = loadWasmBytes().then((bytes) => init(bytes));
  }
  return instance;
}

/** Resolve once the WASM core has finished loading. */
export async function ensureCryptoReady(): Promise<LuxCrypto> {
  return getLuxCrypto();
}

/** Lowercase 0x-hex of a byte array. */
export function toHex(bytes: Uint8Array): string {
  let s = '0x';
  for (let i = 0; i < bytes.length; i += 1) {
    s += bytes[i].toString(16).padStart(2, '0');
  }
  return s;
}

/** Parse 0x-hex (or bare hex) into bytes. */
export function fromHex(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}
