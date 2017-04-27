"use strict";
exports.__esModule = true;
function frameManagerHandler(ev) {
    var item = this;
    if (typeof item.data === "undefined") {
        item.data = {};
    }
    if (typeof item.data._customHandlers !== "undefined" &&
        item.data._customHandlersCount > 0) {
        for (var i in item.data._customHandlers) {
            if (item.data._customHandlers.hasOwnProperty(i)) {
                if (typeof item.data._customHandlers[i] === "function") {
                    item.data._customHandlers[i].call(item, ev);
                }
            }
        }
    }
}
exports.add = function (item, name, callback, parentItem) {
    if (typeof item.data._customHandlers === "undefined") {
        item.data._customHandlers = {};
        item.data._customHandlersCount = 0;
    }
    item.data._customHandlers[name] = callback;
    item.data._customHandlersCount += 1;
    if (item.data._customHandlersCount > 0) {
        if (typeof parentItem !== "undefined") {
            parentItem.onFrame = frameManagerHandler;
        }
        else {
            item.onFrame = frameManagerHandler;
        }
    }
    return name;
};
exports.remove = function (item, name) {
    if (typeof item.data._customHandlers !== "undefined") {
        item.data._customHandlers[name] = null;
        item.data._customHandlersCount -= 1;
        if (item.data._customHandlersCount <= 0) {
            item.data._customHandlersCount = 0;
        }
    }
};

//# sourceMappingURL=frameManager.js.map
