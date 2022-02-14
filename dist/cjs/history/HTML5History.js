"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var HistoryApi_1 = require("../interfaces/HistoryApi");
var UrlHelper_1 = require("../helpers/UrlHelper");
var BaseHistory_1 = require("./BaseHistory");
var HTML5History = (function (_super) {
    tslib_1.__extends(HTML5History, _super);
    function HTML5History() {
        var _this = _super.call(this) || this;
        _this.onLocationChange = function (e) {
            _this.events[HistoryApi_1.HistoryEvents.POPSTATE].forEach(function (cb) { return cb({ path: UrlHelper_1.default.getPath() }); });
        };
        window.addEventListener('popstate', _this.onLocationChange);
        return _this;
    }
    HTML5History.prototype.pushState = function (path, replace) {
        try {
            if (replace) {
                window.history.replaceState({}, '', path);
            }
            else {
                window.history.pushState({}, '', path);
            }
        }
        catch (e) {
            window.location[replace ? 'replace' : 'assign'](path);
        }
    };
    HTML5History.prototype.back = function () {
        window.history.back();
    };
    HTML5History.prototype.forward = function () {
        window.history.forward();
    };
    HTML5History.prototype.go = function (n) {
        window.history.go(n);
    };
    HTML5History.prototype.push = function (path) {
        this.pushState(path);
    };
    HTML5History.prototype.replace = function (path) {
        this.pushState(path, true);
    };
    return HTML5History;
}(BaseHistory_1.default));
exports.default = HTML5History;
;
