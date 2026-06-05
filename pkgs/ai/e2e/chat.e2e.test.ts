// End-to-end: the web app chats with zen-coder through a real hanzo-node, fully
// in the browser. Requires the local runtime up (see pkgs/ai/CHAT.md +
// local-runtime/): web :1500, node :3700, responses-proxy :36906, engine :36902.
// Skips (not fails) when the runtime isn't reachable, so it's safe in CI.
//
// Run:  bun run --cwd pkgs/ai test:e2e
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { chromium, type Browser } from 'playwright';

const WEB = process.env.E2E_WEB ?? 'http://localhost:1500';
const NODE_ADDR = process.env.E2E_NODE_ADDR ?? 'http://localhost:1500'; // same-origin vite proxy → node
const CHROMIUM = process.env.CHROMIUM_BIN ?? '/snap/bin/chromium';

async function reachable(url: string): Promise<boolean> {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(3000) });
    return r.status < 500;
  } catch {
    return false;
  }
}

let browser: Browser | null = null;
let runtimeUp = false;

beforeAll(async () => {
  runtimeUp = (await reachable(WEB)) && (await reachable(`${WEB}/v1/node/health_check`));
  if (runtimeUp) {
    browser = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox', '--disable-gpu'] });
  }
});
afterAll(async () => { await browser?.close(); });

describe('@hanzo/ai web e2e', () => {
  it('renders the onboarding screen (smoke)', async (ctx) => {
    if (!runtimeUp) return ctx.skip();
    const page = await browser!.newPage({ viewport: { width: 1280, height: 820 } });
    await page.goto(WEB, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
    const text = await page.innerText('body');
    expect(text).toContain('Welcome to Hanzo');
    expect(text).toContain('Quick Connect');
    await page.close();
  }, 60000);

  it('connects to the node, sends a message, and gets zen-coder’s reply', async (ctx) => {
    if (!runtimeUp) return ctx.skip();
    const page = await browser!.newPage({ viewport: { width: 1280, height: 820 } });
    const pageErrors: string[] = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));

    await page.goto(WEB, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    // agree to terms, then Quick Connect
    for (const sel of ['button[role=switch]', 'input[type=checkbox]']) {
      try { const el = await page.$(sel); if (el) { await el.click({ timeout: 1500 }); break; } } catch { /* */ }
    }
    await page.waitForTimeout(400);
    try { await page.click('a[href="/quick-connection"]', { timeout: 4000 }); }
    catch { await page.getByText('Quick Connect').click({ timeout: 4000 }); }
    await page.waitForTimeout(2000);

    // connect to the node (same-origin proxy address)
    await page.fill('input[name=node_address]', NODE_ADDR);
    await page.click('button:has-text("Connect")');
    await page.waitForTimeout(8000);
    expect(page.url()).toContain('/home');

    // send a deterministic prompt
    const input = (await page.$('[placeholder*="Send a message"]')) ?? (await page.$('textarea'));
    expect(input, 'chat input should be present on /home').toBeTruthy();
    await input!.click();
    await page.keyboard.type('Reply with exactly the three words: E2E CHAT OK');
    await page.keyboard.press('Enter');

    // poll for the model reply (user echo + assistant reply = ≥2 occurrences)
    let replied = false;
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(2000);
      const body = await page.innerText('body');
      if ((body.match(/E2E CHAT OK/g) ?? []).length >= 2) { replied = true; break; }
    }
    await page.screenshot({ path: '/tmp/e2e-chat.png' }).catch(() => {});
    expect(replied, 'zen-coder should reply with the prompted text').toBe(true);
    // the chat screens must render (regression for the Box/resizable crashes)
    expect(pageErrors.join('\n')).not.toMatch(/is not defined|Element type is invalid/);
    await page.close();
  }, 120000);
});
