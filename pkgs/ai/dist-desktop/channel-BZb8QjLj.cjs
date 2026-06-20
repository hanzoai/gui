'use strict';

const index = require('./index-D40WJAeY.cjs');

/* IMPORT */
/* MAIN */
const channel = (color, channel) => {
    return index.Utils.lang.round(index.Color.parse(color)[channel]);
};

exports.channel = channel;
