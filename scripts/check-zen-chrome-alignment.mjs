import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

test('Native TitleBar aligns with Zen Dark chrome & accessibility contract (Issue #22)', () => {
  const titleBarPath = resolve(process.cwd(), 'pkgs/tauri/src/TitleBar.tsx');
  const content = readFileSync(titleBarPath, 'utf8');

  // Verify neutral near-black tokens
  assert.ok(content.includes('backgroundColor="$background"'), 'Uses $background token');
  assert.ok(content.includes('borderBottomColor="$borderColor"'), 'Uses $borderColor token');

  // Verify integrated header / no duplicate title
  assert.ok(content.includes('integratedHeader?: boolean'), 'Supports integratedHeader prop');
  assert.ok(content.includes('hideTitle?: boolean'), 'Supports hideTitle prop');
  assert.ok(content.includes('showTitle = !hideTitle && !integratedHeader'), 'Conditional title suppresses header duplication');

  // Verify WCAG accessibility roles and keyboard navigation
  assert.ok(content.includes('role="banner"'), 'Includes banner landmark role');
  assert.ok(content.includes('role="toolbar"'), 'Includes toolbar role for controls');
  assert.ok(content.includes('role="button"'), 'Controls annotated with button role');
  assert.ok(content.includes('tabIndex={0}'), 'Controls are keyboard focusable');
  assert.ok(content.includes('onKeyDown'), 'Controls handle keyboard Enter/Space activation');
  assert.ok(content.includes('aria-label="Minimize Window"'), 'Includes accessible minimize label');
  assert.ok(content.includes('aria-label="Toggle Maximize Window"'), 'Includes accessible maximize label');
  assert.ok(content.includes('aria-label="Close Window"'), 'Includes accessible close label');
});
