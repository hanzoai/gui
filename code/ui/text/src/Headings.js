"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.H6 = exports.H5 = exports.H4 = exports.H3 = exports.H2 = exports.H1 = exports.Heading = void 0;
var web_1 = require("@hanzogui/web");
var Paragraph_1 = require("./Paragraph");
exports.Heading = (0, web_1.styled)(Paragraph_1.Paragraph, {
    render: 'span',
    name: 'Heading',
    role: 'heading',
    fontFamily: '$heading',
    size: '$8',
    margin: 0,
});
exports.H1 = (0, web_1.styled)(exports.Heading, {
    name: 'H1',
    render: 'h1',
    variants: {
        unstyled: {
            false: {
                size: '$10',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1' ? true : false,
    },
});
exports.H2 = (0, web_1.styled)(exports.Heading, {
    name: 'H2',
    render: 'h2',
    variants: {
        unstyled: {
            false: {
                size: '$9',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1' ? true : false,
    },
});
exports.H3 = (0, web_1.styled)(exports.Heading, {
    name: 'H3',
    render: 'h3',
    variants: {
        unstyled: {
            false: {
                size: '$8',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1' ? true : false,
    },
});
exports.H4 = (0, web_1.styled)(exports.Heading, {
    name: 'H4',
    render: 'h4',
    variants: {
        unstyled: {
            false: {
                size: '$7',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1' ? true : false,
    },
});
exports.H5 = (0, web_1.styled)(exports.Heading, {
    name: 'H5',
    render: 'h5',
    variants: {
        unstyled: {
            false: {
                size: '$6',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1' ? true : false,
    },
});
exports.H6 = (0, web_1.styled)(exports.Heading, {
    name: 'H6',
    render: 'h6',
    variants: {
        unstyled: {
            false: {
                size: '$5',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1' ? true : false,
    },
});
