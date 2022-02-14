"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UrlHelper = (function () {
    function UrlHelper() {
    }
    UrlHelper.getPath = function () {
        var path = decodeURI(window.location.pathname);
        return (path || '/') + window.location.search + window.location.hash;
    };
    UrlHelper.parsePath = function (path) {
        var hash = '';
        var query = '';
        var hashIndex = path.indexOf('#');
        if (~hashIndex) {
            hash = path.slice(hashIndex);
            path = path.slice(0, hashIndex);
        }
        var queryIndex = path.indexOf('?');
        if (~queryIndex) {
            query = path.slice(queryIndex + 1);
            path = path.slice(0, queryIndex);
        }
        return { path: path, query: query, hash: hash };
    };
    return UrlHelper;
}());
exports.default = UrlHelper;
;
