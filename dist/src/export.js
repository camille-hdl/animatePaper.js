"use strict";
exports.__esModule = true;
var animation_1 = require("./animation");
var effects = require("./effects");
var easing_1 = require("./easing");
var _frameManager = require("./frameManager");
var prophooks_1 = require("./prophooks");
var paper = require("./getPaper");
exports.animate = function (item, animation) {
    var animations = [];
    var output;
    if (animation instanceof Array) {
        animations = animation;
    }
    else {
        animations.push(animation);
    }
    var index = 0;
    new animation_1.Animation(item, animations[index].properties, animations[index].settings, function _continue() {
        index++;
        if (typeof animations[index] !== "undefined") {
            new animation_1.Animation(item, animations[index].properties, animations[index].settings, _continue);
        }
    });
    return item;
};
exports.stop = function (item, goToEnd, forceEnd) {
    if (!!item.data._animatePaperAnims) {
        for (var i = 0, l = item.data._animatePaperAnims.length; i < l; i++) {
            if (!!item.data._animatePaperAnims[i]) {
                item.data._animatePaperAnims[i].stop(goToEnd, forceEnd);
            }
        }
    }
    return item;
};
exports.extendEasing = easing_1.easing.extendEasing;
exports.frameManager = _frameManager;
exports.fx = effects;
if (!paper.Item.prototype.animate) {
    paper.Item.prototype.animate = function (animation) {
        return exports.animate(this, animation);
    };
}
if (!paper.Item.prototype.stop) {
    paper.Item.prototype.stop = function (goToEnd, forceEnd) {
        return exports.stop(this, goToEnd, forceEnd);
    };
}
if (typeof module !== "undefined") {
    module.exports = {
        animate: exports.animate,
        stop: exports.stop,
        frameManager: exports.frameManager,
        fx: exports.fx,
        extendEasing: exports.extendEasing,
        extendPropHooks: prophooks_1.extendPropHooks
    };
}

//# sourceMappingURL=export.js.map
