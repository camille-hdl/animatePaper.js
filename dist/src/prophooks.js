'use strict';
var dirRegexp = /^([+\-])(.+)/;
function _pointDiff(a, b, operator) {
    if (['+', '-'].indexOf(operator) === -1)
        return;
    if (typeof a === "undefined" || typeof b === "undefined")
        return;
    var ax, bx, ay, by;
    ax = a.x || 0;
    bx = b.x || 0;
    ay = a.y || 0;
    by = b.y || 0;
    if (operator === '+') {
        return a.add(b);
    }
    if (operator === '-') {
        return a.subtract(b);
    }
    throw new Error('Unknown operator');
}
function _getColorType(color_obj) {
    var color_type;
    if (color_obj.type) {
        color_type = color_obj.type;
    }
    else if (typeof (color_obj.red !== "undefined")) {
        color_type = "rgb";
    }
    else if (typeof (color_obj.lightness !== "undefined")) {
        color_type = "hsl";
    }
    else if (typeof (color_obj.brightness !== "undefined")) {
        color_type = "hsb";
    }
    else if (typeof (color_obj.gray !== "undefined")) {
        color_type = "gray";
    }
    return color_type;
}
function _getColorComponentNames(color_obj) {
    var color_component_names;
    if (color_obj._properties) {
        color_component_names = color_obj._properties;
    }
    else {
        var color_type = _getColorType(color_obj);
        switch (color_type) {
            case "gray":
                {
                    color_component_names = ["gray"];
                }
                break;
            case "rgb":
                {
                    color_component_names = ["red", "green", "blue"];
                }
                break;
            case "hsl":
                {
                    color_component_names = ["hue", "saturation", "lightness"];
                }
                break;
            case "hsb":
                {
                    color_component_names = ["hue", "brightness", "saturation"];
                }
                break;
            default:
        }
    }
    return color_component_names;
}
var _tweenPropHooks = {
    _default: {
        get: function (tween) {
            var output;
            if (tween.item[tween.prop] !== null) {
                output = tween.item[tween.prop];
            }
            return output;
        },
        set: function (tween) {
            var toSet = {};
            toSet[tween.prop] = tween.now;
            tween.item.set(toSet);
        }
    },
    scale: {
        get: function (tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.scale === "undefined") {
                tween.item.data._animatePaperVals.scale = 1;
            }
            var output = tween.item.data._animatePaperVals.scale;
            return output;
        },
        set: function (tween) {
            var curScaling = tween.item.data._animatePaperVals.scale;
            var trueScaling = tween.now / curScaling;
            tween.item.data._animatePaperVals.scale = tween.now;
            var center = false;
            if (typeof tween.A.settings.center !== "undefined") {
                center = tween.A.settings.center;
            }
            if (typeof tween.A.settings.scaleCenter !== "undefined") {
                center = tween.A.settings.scaleCenter;
            }
            if (center !== false) {
                tween.item.scale(trueScaling, center);
            }
            else {
                tween.item.scale(trueScaling);
            }
        }
    },
    rotate: {
        get: function (tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.rotate === "undefined") {
                tween.item.data._animatePaperVals.rotate = -0;
            }
            var output = tween.item.data._animatePaperVals.rotate;
            return output;
        },
        set: function (tween) {
            var curRotate = tween.item.data._animatePaperVals.rotate;
            var trueRotate = tween.now - curRotate;
            tween.item.data._animatePaperVals.rotate = tween.now;
            var center = false;
            if (typeof tween.A.settings.center !== "undefined") {
                center = tween.A.settings.center;
            }
            if (typeof tween.A.settings.rotateCenter !== "undefined") {
                center = tween.A.settings.rotateCenter;
            }
            if (center !== false) {
                tween.item.rotate(trueRotate, center);
            }
            else {
                tween.item.rotate(trueRotate);
            }
        }
    },
    translate: {
        get: function (tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.translate === "undefined") {
                tween.item.data._animatePaperVals.translate = new paper.Point(0, 0);
            }
            var output = tween.item.data._animatePaperVals.translate;
            return output;
        },
        set: function (tween) {
            var cur = tween.item.data._animatePaperVals.translate;
            var actual = _pointDiff(tween.now, cur, "-");
            tween.item.data._animatePaperVals.translate = tween.now;
            tween.item.translate(actual);
        },
        ease: function (tween, eased) {
            var temp = _pointDiff(tween.end, tween.start, "-");
            temp.x = temp.x * eased;
            temp.y = temp.y * eased;
            tween.now = _pointDiff(temp, tween.start, "+");
            return tween.now;
        }
    },
    position: {
        get: function (tween) {
            return {
                x: tween.item.position.x,
                y: tween.item.position.y
            };
        },
        set: function (tween) {
            tween.item.position.x += tween.now.x;
            tween.item.position.y += tween.now.y;
        },
        ease: function (tween, eased) {
            var dirX = "";
            var dirY = "";
            var rX = null;
            var rY = null;
            if (typeof tween._easePositionCache === "undefined") {
                tween._easePositionCache = {
                    x: 0,
                    y: 0
                };
            }
            var endX = Number(tween.end.x || 0);
            var endY = Number(tween.end.y || 0);
            if (!!tween.end.x) {
                rX = ("" + tween.end.x).match(dirRegexp);
            }
            if (!!tween.end.y) {
                rY = ("" + tween.end.y).match(dirRegexp);
            }
            if (!!rX) {
                dirX = rX[1];
                endX = Number(rX[2]);
            }
            if (!!rY) {
                dirY = rY[1];
                endY = Number(rY[2]);
            }
            var _ease = function (val) {
                return ((val || 0) * eased);
            };
            if (typeof tween.end.x !== "undefined") {
                if (dirX === "+") {
                    tween.now.x = (_ease(endX) - tween._easePositionCache.x);
                    tween._easePositionCache.x += tween.now.x;
                }
                else if (dirX === "-") {
                    tween.now.x = _ease(endX) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                    tween.now.x = -tween.now.x;
                }
                else {
                    tween.now.x = ((endX - tween.start.x) * eased) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                }
            }
            else {
                tween.now.x = 0;
            }
            if (typeof tween.end.y !== "undefined") {
                if (dirY === "+") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
                else if (dirY === "-") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                    tween.now.y = -tween.now.y;
                }
                else {
                    tween.now.y = ((endY - tween.start.y) * eased) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
            }
            else {
                tween.now.y = 0;
            }
            return tween.now;
        }
    },
    pointPosition: {
        get: function (tween) {
            return {
                x: tween.item.x,
                y: tween.item.y
            };
        },
        set: function (tween) {
            tween.item.x += tween.now.x;
            tween.item.y += tween.now.y;
        },
        ease: function (tween, eased) {
            var dirX = "";
            var dirY = "";
            var rX = null;
            var rY = null;
            if (typeof tween._easePositionCache === "undefined") {
                tween._easePositionCache = {
                    x: 0,
                    y: 0
                };
            }
            var endX = Number(tween.end.x || 0);
            var endY = Number(tween.end.y || 0);
            if (!!tween.end.x) {
                rX = ("" + tween.end.x).match(dirRegexp);
            }
            if (!!tween.end.y) {
                rY = ("" + tween.end.y).match(dirRegexp);
            }
            if (!!rX) {
                dirX = rX[1];
                endX = Number(rX[2]);
            }
            if (!!rY) {
                dirY = rY[1];
                endY = Number(rY[2]);
            }
            var _ease = function (val) {
                return ((val || 0) * eased);
            };
            if (typeof tween.end.x !== "undefined") {
                if (dirX === "+") {
                    tween.now.x = (_ease(endX) - tween._easePositionCache.x);
                    tween._easePositionCache.x += tween.now.x;
                }
                else if (dirX === "-") {
                    tween.now.x = _ease(endX) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                    tween.now.x = -tween.now.x;
                }
                else {
                    tween.now.x = ((endX - tween.start.x) * eased) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                }
            }
            else {
                tween.now.x = 0;
            }
            if (typeof tween.end.y !== "undefined") {
                if (dirY === "+") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
                else if (dirY === "-") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                    tween.now.y = -tween.now.y;
                }
                else {
                    tween.now.y = ((endY - tween.start.y) * eased) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
            }
            else {
                tween.now.y = 0;
            }
            return tween.now;
        }
    },
    Color: {
        get: function (tween) {
            var current_color = tween.item[tween.prop];
            var component_names = _getColorComponentNames(current_color);
            var result = {};
            for (var _i = 0, component_names_1 = component_names; _i < component_names_1.length; _i++) {
                var component_name = component_names_1[_i];
                result[component_name] = current_color[component_name];
            }
            return result;
        },
        set: function (tween) {
            var component_names = _getColorComponentNames(tween.item[tween.prop]);
            var current_color = tween.item[tween.prop];
            var color_new = {};
            for (var _i = 0, component_names_2 = component_names; _i < component_names_2.length; _i++) {
                var component_name = component_names_2[_i];
                color_new[component_name] = (current_color[component_name] +
                    tween.now[component_name]);
            }
            tween.item[tween.prop] = color_new;
        },
        ease: function (tween, eased) {
            var component_names = _getColorComponentNames(tween.item[tween.prop]);
            var _ease = function (val) {
                return (val || 0) * eased;
            };
            for (var _i = 0, component_names_3 = component_names; _i < component_names_3.length; _i++) {
                var component_name = component_names_3[_i];
                var curProp = component_name;
                var dir = "";
                var r = "";
                if (typeof tween._easeColorCache === "undefined") {
                    tween._easeColorCache = {};
                }
                if (typeof tween._easeColorCache[curProp] === "undefined") {
                    tween._easeColorCache[curProp] = 0;
                }
                var end = Number(tween.end[curProp] || 0);
                if (!!tween.end[curProp]) {
                    r = ("" + tween.end[curProp]).match(dirRegexp);
                }
                if (!!r) {
                    dir = r[1];
                    end = Number(r[2]);
                }
                if (typeof tween.end[curProp] !== "undefined") {
                    if (dir === "+") {
                        tween.now[curProp] = _ease(end) - tween._easeColorCache[curProp];
                        tween._easeColorCache[curProp] += tween.now[curProp];
                    }
                    else if (dir === "-") {
                        tween.now[curProp] = _ease(end) - tween._easeColorCache[curProp];
                        tween._easeColorCache[curProp] += tween.now[curProp];
                        tween.now[curProp] = -tween.now[curProp];
                    }
                    else {
                        tween.now[curProp] = (end - tween.start[curProp]) * eased - tween._easeColorCache[curProp];
                        tween._easeColorCache[curProp] += tween.now[curProp];
                    }
                }
                else {
                    tween.now[curProp] = 0;
                }
            }
            return tween.now;
        }
    }
};
var _colorProperties = ["fill", "stroke"];
for (var i = 0, l = _colorProperties.length; i < l; i++) {
    _tweenPropHooks[_colorProperties[i] + "Color"] = _tweenPropHooks.Color;
}
module.exports = {
    _tweenPropHooks: _tweenPropHooks,
    _pointDiff: _pointDiff,
    extendPropHooks: function (customHooks) {
        for (var i in customHooks) {
            if (customHooks.hasOwnProperty(i)) {
                _tweenPropHooks[i] = customHooks[i];
            }
        }
    }
};

//# sourceMappingURL=prophooks.js.map
