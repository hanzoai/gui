/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import * as React from 'react';
import type { PlatformMethods } from '../types';
declare const TextInput: React.ForwardRefExoticComponent<{
    showSoftInputOnFocus?: boolean;
    caretHidden?: boolean;
    autoCapitalize?: "characters" | "none" | "sentences" | "words";
    autoComplete?: string | null;
    autoCompleteType?: string | null;
    autoCorrect?: boolean | null;
    autoFocus?: boolean | null;
    blurOnSubmit?: boolean | null;
    clearTextOnFocus?: boolean | null;
    defaultValue?: string | null;
    rows?: number | null;
    readOnly?: boolean | null;
    dir?: "auto" | "ltr" | "rtl" | null;
    disabled?: boolean | null;
    editable?: boolean | null;
    enterKeyHint?: "done" | "enter" | "next" | "search" | "send";
    inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
    inputAccessoryViewID?: string | null;
    keyboardType?: "default" | "email-address" | "number-pad" | "decimal-pad" | "numbers-and-punctuation" | "numeric" | "phone-pad" | "search" | "url" | "web-search";
    maxLength?: number | null;
    multiline?: boolean | null;
    numberOfLines?: number | null;
    onChange?: (e: any) => void;
    onChangeText?: (e: string) => void;
    onContentSizeChange?: (e: any) => void;
    onEndEditing?: (e: any) => void;
    onKeyPress?: (e: any) => void;
    onSelectionChange?: (e: any) => void;
    onScroll?: (e: any) => void;
    onSubmitEditing?: (e: any) => void;
    placeholder?: string | null;
    placeholderTextColor?: import("../types").ColorValue | null;
    returnKeyType?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send";
    secureTextEntry?: boolean | null;
    selectTextOnFocus?: boolean | null;
    selection?: {
        start: number;
        end?: number;
    };
    selectionColor?: import("../types").ColorValue | null;
    spellCheck?: boolean | null;
    style?: import("../types").GenericStyleProp<import("./types").TextInputStyle> | null;
    value?: string | null;
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
} & import("../View/types").AccessibilityProps & React.RefAttributes<HTMLElement & PlatformMethods>>;
export { TextInput };
export default TextInput;
