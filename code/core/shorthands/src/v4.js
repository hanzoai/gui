"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shorthands = void 0;
exports.shorthands = createShorthands({
    // text
    text: 'textAlign',
    // view
    b: 'bottom',
    bg: 'backgroundColor',
    content: 'alignContent',
    grow: 'flexGrow',
    items: 'alignItems',
    justify: 'justifyContent',
    l: 'left',
    m: 'margin',
    maxH: 'maxHeight',
    maxW: 'maxWidth',
    mb: 'marginBottom',
    minH: 'minHeight',
    minW: 'minWidth',
    ml: 'marginLeft',
    mr: 'marginRight',
    mt: 'marginTop',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    p: 'padding',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    pt: 'paddingTop',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    r: 'right',
    rounded: 'borderRadius',
    select: 'userSelect',
    self: 'alignSelf',
    shrink: 'flexShrink',
    t: 'top',
    z: 'zIndex',
});
// type helper
function createShorthands(a) {
    return a;
}
