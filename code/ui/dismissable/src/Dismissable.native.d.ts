import React from 'react';
export declare function dispatchDiscreteCustomEvent<E extends CustomEvent>(_target: E['target'], _event: E): void;
export declare function getDismissableLayerCount(): number;
export declare function useHasDismissableLayers(): boolean;
export declare function useIsInsideDismissable(_ref: React.RefObject<HTMLElement | null>): boolean;
export declare function useDismissableLayersAbove(_ref: React.RefObject<HTMLElement | null>): number;
export declare const Dismissable: any;
export declare const DismissableBranch: any;
