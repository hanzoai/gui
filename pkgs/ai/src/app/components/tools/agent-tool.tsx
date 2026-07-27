import { type AgentTool } from '@hanzo_network/hanzo-message-ts/api/tools/types';

import ToolDetailsCard from './components/tool-details-card';

export default function AgentTool({
  tool,
  isEnabled,
  isPlaygroundTool,
  toolRouterKey,
}: {
  tool: AgentTool;
  isEnabled: boolean;
  isPlaygroundTool?: boolean;
  toolRouterKey: string;
}) {
  return (
    <ToolDetailsCard
      isEnabled={isEnabled}
      isPlaygroundTool={isPlaygroundTool}
      tool={tool}
      toolKey={toolRouterKey}
      toolType="Agent"
    />
  );
}
