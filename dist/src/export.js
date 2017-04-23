var Animation = require("./animation");
var effects = require("./effects");
var frameManager = require("./frameManager");
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
    new Animation(item, animations[index].properties, animations[index].settings, function _continue() {
        index++;
        if (typeof animations[index] !== "undefined") {
            new Animation(item, animations[index].properties, animations[index].settings, _continue);
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
exports.extendEasing = require("./easing").extendEasing;
exports.extendPropHooks = require("./prophooks").extendPropHooks;
exports.frameManager = frameManager;
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
module.exports = exports;

//# sourceMappingURL=export.js.map
