// Babel plugins must export a function (or { default: fn } when esm-interop). The
// generated permanent/cjs/commonjs.js wraps the real plugin under `default` via
// __toCommonJS — Object.assign would expose the wrapper as the plugin and Babel
// rejects it with "Plugin/Preset files are not allowed to export objects".
const m = require('./permanent/cjs/commonjs.js')
module.exports = m.default || m

