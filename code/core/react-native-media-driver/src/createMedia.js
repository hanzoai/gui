"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedia = createMedia;
var web_1 = require("@hanzogui/web");
var matchMedia_1 = require("./matchMedia");
/**
 * @deprecated you no longer need to call createMedia or import @hanzogui/react-native-media-driver at all.
 * Hanzogui now automatically handles setting this up, you can just pass a plain object to createHanzogui.
 */
function createMedia(media) {
    // this should ideally return a diff object that is then passed to createHanzogui
    // but works for now we dont really support swapping out media drivers
    (0, web_1.setupMatchMedia)(matchMedia_1.matchMedia);
    return media;
}
