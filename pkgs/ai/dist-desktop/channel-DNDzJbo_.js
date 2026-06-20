import { U as Utils, F as Color } from './index-Dq1IGnzx.js';

/* IMPORT */
/* MAIN */
const channel = (color, channel) => {
    return Utils.lang.round(Color.parse(color)[channel]);
};

export { channel as c };
