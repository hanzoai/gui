import { U as Utils, F as Color } from './index-Bi_L5H1C.js';

/* IMPORT */
/* MAIN */
const channel = (color, channel) => {
    return Utils.lang.round(Color.parse(color)[channel]);
};

export { channel as c };
