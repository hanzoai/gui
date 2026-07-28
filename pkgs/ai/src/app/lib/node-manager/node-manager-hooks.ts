import { type Event, type EventCallback, listen } from '@tauri-apps/api/event';
import { warn } from '@tauri-apps/plugin-log';
import { useEffect, useState } from 'react';

import {
  NodeManagerEvent,
  type NodeManagerEventMap,
} from './node-manager-client-types';
import {
  // pullingModelDoneToast,
  pullingModelErrorToast,
  nodeStartedToast,
  // pullingModelProgressToast,
  // pullingModelStartToast,
  // nodeStartedToast,
  nodeStartErrorToast,
  nodeStopErrorToast,
  nodeStoppedToast,
  // startingHanzoNodeToast,
  stoppingNodeToast,
} from './node-manager-toasts-utils';

/**
 * Custom React hook to subscribe to Tauri events.
 * @param eventName The name of the event to subscribe to.
 * @param callback The callback function to execute when the event is received.
 */
const useTauriEvent = <T>(eventName: string, callback: EventCallback<T>) => {
  useEffect(() => {
    // Subscribe to the Tauri event
    const unsubscribe = listen(eventName, (event: Event<T>) => {
      callback(event);
    });

    // Cleanup subscription on component unmount
    return () => {
      void unsubscribe.then((unsub) => unsub());
    };
  }, [eventName, callback]);
};

export const useNodeStateChange = (
  callback: EventCallback<NodeManagerEventMap>,
) => {
  return useTauriEvent<NodeManagerEventMap>(
    'hanzo-node-state-change',
    callback,
  );
};

export const mapEvent = (
  event: object | string,
): NodeManagerEventMap => {
  if (typeof event === 'object') {
    return {
      type: Object.keys(event)[0] as NodeManagerEvent,
      payload: Object.values(event)[0],
    } as any;
  } else {
    return { type: event as NodeManagerEvent } as any;
  }
};

export const useNodeEventsToast = () => {
  const [nodeEventState, setNodeEventState] = useState({
    type: '' as NodeManagerEvent,
    payload: {} as any,
  });
  useNodeStateChange((event) => {
    const nodeEvent = mapEvent(event.payload);
    setNodeEventState(nodeEvent);
    switch (nodeEvent.type) {
      // case HanzoNodeManagerEvent.StartingHanzoNode:
      //   startingHanzoNodeToast();
      //   break;
      case NodeManagerEvent.NodeStarted:
        nodeStartedToast();
        break;
      case NodeManagerEvent.NodeStartError:
        nodeStartErrorToast();
        break;

      case NodeManagerEvent.StoppingNode:
        stoppingNodeToast();
        break;
      case NodeManagerEvent.NodeStopped:
        nodeStoppedToast();
        break;
      case NodeManagerEvent.NodeStopError:
        nodeStopErrorToast();
        break;

      // case HanzoNodeManagerEvent.PullingModelStart:
      //   pullingModelStartToast(nodeEvent.payload.model);
      //   break;
      // case HanzoNodeManagerEvent.PullingModelProgress:
      //   pullingModelProgressToast(
      //     nodeEvent.payload.model,
      //     nodeEvent.payload.progress,
      //   );
      //   break;
      // case HanzoNodeManagerEvent.PullingModelDone:
      //   pullingModelDoneToast(nodeEvent.payload.model);
      //   break;
      case NodeManagerEvent.PullingModelError:
        pullingModelErrorToast(nodeEvent.payload.model);
        break;
      default:
        void warn(
          `unhandled hanzo node state change:${nodeEvent.type}`,
        );
    }
  });
  return nodeEventState;
};
