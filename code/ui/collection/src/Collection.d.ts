import type { HanzoguiElement } from '@hanzogui/core';
import { Slot } from '@hanzogui/core';
import React from 'react';
type SlotProps = React.ComponentPropsWithoutRef<typeof Slot>;
interface CollectionProps extends SlotProps {
}
declare function createCollection<ItemElement extends HanzoguiElement, ItemData = {}>(name: string): readonly [{
    readonly Provider: React.FC<{
        children?: React.ReactNode;
    } & {
        scope?: any;
    }>;
    readonly Slot: any;
    readonly ItemSlot: any;
}, (scope: string) => any];
export { createCollection };
export type { CollectionProps };
