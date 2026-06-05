// Regression: the merge pulled react-resizable-panels@4 (Group/Separator), but
// the app's net-ui resizable.tsx uses the v3 API (PanelGroup/PanelResizeHandle).
// v4 made those undefined → "Element type is invalid" crashed the chat view.
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as RRP from 'react-resizable-panels';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@hanzo_network/hanzo-ui/components/resizable';

describe('react-resizable-panels — v3 API present (not v4)', () => {
  it('exposes PanelGroup / Panel / PanelResizeHandle', () => {
    expect(RRP.PanelGroup).toBeDefined();
    expect(RRP.Panel).toBeDefined();
    expect(RRP.PanelResizeHandle).toBeDefined();
  });
});

describe('net-ui resizable components', () => {
  it('are all defined (undefined → "Element type is invalid")', () => {
    expect(ResizablePanelGroup).toBeDefined();
    expect(ResizablePanel).toBeDefined();
    expect(ResizableHandle).toBeDefined();
  });

  it('render a panel group without throwing', () => {
    expect(() =>
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50}>left</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>right</ResizablePanel>
        </ResizablePanelGroup>,
      ),
    ).not.toThrow();
  });
});
