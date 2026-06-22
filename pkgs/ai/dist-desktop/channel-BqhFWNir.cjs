'use strict';

const index = require('./index-BTVYz8LN.cjs');

/* IMPORT */
/* MAIN */
const channel = (color, channel) => {
    return index.Utils.lang.round(index.Color.parse(color)[channel]);
};

exports.channel = channel;
