"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PathHelper = (function () {
    function PathHelper() {
    }
    PathHelper.removeTrailingSlash = function (path) {
        return path && path.replace(/\/?$/, '') || '';
    };
    PathHelper.cleanPath = function (path) {
        return path && path.replace(/\/\//, '/') || '';
    };
    PathHelper.join = function (lstr, rstr) {
        return PathHelper.cleanPath(PathHelper.removeTrailingSlash(lstr) + "/" + rstr);
    };
    return PathHelper;
}());
exports.default = PathHelper;
;
