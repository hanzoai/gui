const { createGui } = require('@hanzogui/core')

const conf = require('@hanzogui/config/v3').config

// Add an invalid identifier color token (with hyphen) to test the fix for #3737
conf.tokens.color['invalid-identifier'] = conf.tokens.color.white0

module.exports = createGui(conf)
