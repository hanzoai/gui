"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizableText = void 0;
var get_font_sized_1 = require("@hanzogui/get-font-sized");
var web_1 = require("@hanzogui/web");
exports.SizableText = (0, web_1.styled)(web_1.Text, {
    name: 'SizableText',
    fontFamily: '$body',
    variants: {
        unstyled: {
            false: {
                size: '$true',
                color: '$color',
            },
        },
        size: get_font_sized_1.getFontSized,
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
// we are doing weird stuff to avoid bad types
// TODO make this just work
exports.SizableText.staticConfig.variants.fontFamily = {
    '...': function (val, extras) {
        // pass through inherit directly without font variant expansion
        if (val === 'inherit') {
            return { fontFamily: 'inherit' };
        }
        var sizeProp = extras.props['size'];
        var fontSizeProp = extras.props['fontSize'];
        var size = sizeProp === '$true' && fontSizeProp
            ? fontSizeProp
            : extras.props['size'] || '$true';
        return (0, get_font_sized_1.getFontSized)(size, extras);
    },
};
