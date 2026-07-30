import { U as Utils, F as Color } from './index-C83snUsR.js';

/* IMPORT */
/* MAIN */
const channel = (color, channel) => {
    return Utils.lang.round(Color.parse(color)[channel]);
};

export { channel as c };
//# sourceMappingURL=channel-IaKyBCzM.js.map
