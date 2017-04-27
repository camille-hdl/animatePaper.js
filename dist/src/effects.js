"use strict";
exports.__esModule = true;
var animation_1 = require("./animation");
var _animate = function (item, animation) {
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
exports.grow = function (path, settings) {
    console.log("segmentGrow was buggy and has been removed, sorry :/");
    return path;
};
exports.shake = function (item, settings) {
    var nbOfShakes = Math.floor(settings ? settings.nb || 2 : 2) * 2;
    var length = Math.floor(settings ? settings.movement || 40 : 40);
    var animations = [];
    for (var first = true; nbOfShakes > 0; nbOfShakes--) {
        var direction = nbOfShakes % 2 ? "+" : "-";
        var movement = length;
        var callback = null;
        if (nbOfShakes === 1 && !!settings && typeof settings.complete !== "undefined") {
            callback = settings.complete;
        }
        if (first || nbOfShakes === 1) {
            movement = movement / 2;
            first = false;
        }
        animations.push({
            properties: {
                position: {
                    x: direction + movement
                }
            },
            settings: {
                duration: 100,
                easing: "swing",
                complete: callback
            }
        });
    }
    _animate(item, animations);
};
exports.fadeIn = function (item, settings) {
    var duration = 500;
    var complete = undefined;
    var easing = "swing";
    if (typeof settings !== "undefined") {
        if (typeof settings.duration !== "undefined")
            duration = Number(settings.duration);
        if (typeof settings.complete === "function")
            complete = settings.complete;
        if (typeof settings.easing !== "undefined")
            easing = settings.easing;
    }
    _animate(item, {
        properties: {
            opacity: 1
        },
        settings: {
            duration: duration,
            easing: easing,
            complete: complete
        }
    });
};
exports.fadeOut = function (item, settings) {
    var duration = 500;
    var complete = undefined;
    var easing = "swing";
    if (typeof settings !== "undefined") {
        if (typeof settings.duration !== "undefined")
            duration = Number(settings.duration);
        if (typeof settings.complete === "function")
            complete = settings.complete;
        if (typeof settings.easing !== "undefined")
            easing = settings.easing;
    }
    _animate(item, {
        properties: {
            opacity: 0
        },
        settings: {
            duration: duration,
            easing: easing,
            complete: complete
        }
    });
};
exports.slideUp = function (item, settings) {
    var duration = 500;
    var complete = undefined;
    var distance = 50;
    var easing = "swing";
    if (typeof settings !== "undefined") {
        if (typeof settings.duration !== "undefined")
            duration = Number(settings.duration);
        if (typeof settings.complete === "function")
            complete = settings.complete;
        if (typeof settings.easing !== "undefined")
            easing = settings.easing;
        if (typeof settings.distance !== "undefined")
            distance = settings.distance;
    }
    _animate(item, {
        properties: {
            opacity: 1,
            position: {
                y: "-" + distance
            }
        },
        settings: {
            duration: duration,
            easing: easing,
            complete: complete
        }
    });
};
exports.slideDown = function (item, settings) {
    var duration = 500;
    var complete = undefined;
    var distance = 50;
    var easing = "swing";
    if (typeof settings !== "undefined") {
        if (typeof settings.duration !== "undefined")
            duration = Number(settings.duration);
        if (typeof settings.complete === "function")
            complete = settings.complete;
        if (typeof settings.easing !== "undefined")
            easing = settings.easing;
        if (typeof settings.distance !== "undefined")
            distance = settings.distance;
    }
    _animate(item, {
        properties: {
            opacity: 0,
            position: {
                y: "+" + distance
            }
        },
        settings: {
            duration: duration,
            easing: easing,
            complete: complete
        }
    });
};
exports.splash = function (item, settings) {
    var duration = 500;
    var complete = undefined;
    var easing = "swing";
    if (typeof settings !== "undefined") {
        if (typeof settings.duration !== "undefined")
            duration = Number(settings.duration);
        if (typeof settings.complete === "function")
            complete = settings.complete;
        if (typeof settings.easing !== "undefined")
            easing = settings.easing;
    }
    _animate(item, {
        properties: {
            opacity: 1,
            scale: 3,
            rotate: 360
        },
        settings: {
            duration: duration,
            easing: easing,
            complete: complete
        }
    });
};
if (typeof module !== "undefined") {
    module.exports = {
        grow: function (path, settings) {
            console.log("segmentGrow was buggy and has been removed, sorry :/");
            return path;
        },
        shake: exports.shake,
        fadeIn: exports.fadeIn,
        fadeOut: exports.fadeOut,
        slideUp: exports.slideUp,
        slideDown: exports.slideDown,
        splash: exports.splash
    };
}

//# sourceMappingURL=effects.js.map
