"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HistoryApi_1 = require("../interfaces/HistoryApi");
var BaseHistory = (function () {
    function BaseHistory() {
        var _a;
        this.events = (_a = {}, _a[HistoryApi_1.HistoryEvents.POPSTATE] = [], _a);
    }
    BaseHistory.prototype.go = function (n) { };
    BaseHistory.prototype.push = function (path) { };
    BaseHistory.prototype.replace = function (path) { };
    BaseHistory.prototype.back = function () { };
    BaseHistory.prototype.forward = function () { };
    BaseHistory.prototype.on = function (name, callback) {
        this.events[name].push(callback);
    };
    BaseHistory.prototype.off = function (name, callback) {
        var index = this.events[name].indexOf(callback);
        if (~index) {
            this.events[name].splice(index, 1);
        }
    };
    return BaseHistory;
}());
exports.default = BaseHistory;
;
