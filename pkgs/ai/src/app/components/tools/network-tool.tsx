import { type NetworkTool } from '@hanzo_network/hanzo-message-ts/api/tools/types';

import ToolDetailsCard from './components/tool-details-card';

export default function NetworkTool({
  tool,
  isEnabled,
  toolRouterKey,
}: {
  tool: NetworkTool;
  isEnabled: boolean;
  toolRouterKey: string;
}) {
  return (
    <ToolDetailsCard
      isEnabled={isEnabled}
      tool={tool}
      toolKey={toolRouterKey}
      toolType="Network"
    />
  );
}
