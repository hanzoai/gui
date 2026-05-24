/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import * as React from 'react';
import type { ImageProps } from '../Image/index';
import type { ViewProps } from '../View/index';
/**
 * Very simple drop-in replacement for <Image> which supports nesting views.
 */
declare const ImageBackground: React.ForwardRefExoticComponent<{
    blurRadius?: number;
    defaultSource?: import("../Image/types").Source;
    draggable?: boolean;
    onError?: (e: any) => void;
    onLayout?: (e: any) => void;
    onLoad?: (e: any) => void;
    onLoadEnd?: (e: any) => void;
    onLoadStart?: (e: any) => void;
    onProgress?: (e: any) => void;
    resizeMode?: import("../Image/types").ResizeMode;
    source?: import("../Image/types").Source;
    style?: import("../types").GenericStyleProp<import("../Image/types").ImageStyle>;
} & {
    children?: any | null;
    dir?: "ltr" | "rtl";
    focusable?: boolean | null;
    lang?: string;
    nativeID?: string | null;
    onBlur?: (e: any) => void;
    onClick?: (e: any) => void;
    onClickCapture?: (e: any) => void;
    onContextMenu?: (e: any) => void;
    onFocus?: (e: any) => void;
    onKeyDown?: (e: any) => void;
    onKeyUp?: (e: any) => void;
    onLayout?: (e: import("../types").LayoutEvent) => void;
    onMoveShouldSetResponder?: (e: any) => boolean;
    onMoveShouldSetResponderCapture?: (e: any) => boolean;
    onResponderEnd?: (e: any) => void;
    onResponderGrant?: (e: any) => void | boolean;
    onResponderMove?: (e: any) => void;
    onResponderReject?: (e: any) => void;
    onResponderRelease?: (e: any) => void;
    onResponderStart?: (e: any) => void;
    onResponderTerminate?: (e: any) => void;
    onResponderTerminationRequest?: (e: any) => boolean;
    onScrollShouldSetResponder?: (e: any) => boolean;
    onScrollShouldSetResponderCapture?: (e: any) => boolean;
    onSelectionChangeShouldSetResponder?: (e: any) => boolean;
    onSelectionChangeShouldSetResponderCapture?: (e: any) => boolean;
    onStartShouldSetResponder?: (e: any) => boolean;
    onStartShouldSetResponderCapture?: (e: any) => boolean;
    pointerEvents?: "box-none" | "none" | "box-only" | "auto";
    style?: import("../types").GenericStyleProp<import("../View/types").ViewStyle>;
    testID?: string | null;
    dataSet?: object | null;
    onMouseDown?: (e: any) => void;
    onMouseEnter?: (e: any) => void;
    onMouseLeave?: (e: any) => void;
    onMouseMove?: (e: any) => void;
    onMouseOver?: (e: any) => void;
    onMouseOut?: (e: any) => void;
    onMouseUp?: (e: any) => void;
    onScroll?: (e: any) => void;
    onTouchCancel?: (e: any) => void;
    onTouchCancelCapture?: (e: any) => void;
    onTouchEnd?: (e: any) => void;
    onTouchEndCapture?: (e: any) => void;
    onTouchMove?: (e: any) => void;
    onTouchMoveCapture?: (e: any) => void;
    onTouchStart?: (e: any) => void;
    onTouchStartCapture?: (e: any) => void;
    onWheel?: (e: any) => void;
    href?: string | null;
    hrefAttrs?: {
        download?: boolean | null;
        rel?: string | null;
        target?: string | null;
    } | null;
} & import("../View/types").AccessibilityProps & {
    imageRef?: any;
    imageStyle?: ImageProps["style"];
    style?: ViewProps["style"];
} & React.RefAttributes<HTMLElement & import("../types").PlatformMethods>>;
export { ImageBackground };
export default ImageBackground;
