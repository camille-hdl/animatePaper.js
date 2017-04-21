'use strict';

var dirRegexp = /^([+\-])(.+)/;
/**
 *  Performs an operation on two paper.Point() objects.
 *  Returns the result of : ` a operator b`.
 *  @private
 *  @method _pointDiff
 *  @param {Object} a a `paper.Point` object
 *  @param {Object} b a `paper.Point` object
 *  @param {String} operator either `+` or `-`
 *  @return {Object} `{x: (a.x operator b.x), y: (a.y operator b.y)}`
 *  @for Tween
 */
function _pointDiff(a, b, operator) {
    if (['+', '-'].indexOf(operator) === -1) return;
    if (typeof a === "undefined" || typeof b === "undefined") return;


    var ax, bx, ay, by;
    ax = a.x || 0;
    bx = b.x || 0;
    ay = a.y || 0;
    by = b.y || 0;
    if( operator === '+' ){
        return a.add(b);
    }
    if( operator === '-' ){
        return a.subtract(b);
    }
    throw new Error('Unknown operator');
}

/**
 *  find color type of an 'color_obj'.
 *  Returns string 'hsl'|'hsb'|'rgb'|'gray'.
 *  @private
 *  @method _getColorType
 *  @param {Object} color_obj color_obj `paper.Color` object or compatible raw object
 *  @return {String} `color type as string`
 *  @for _tweenPropHooks.Color
 */
function _getColorType(color_obj) {
    let color_type;
    // if the color_obj is created with paper.Color it has an 'type' propertie.
    if (color_obj.type) {
        color_type = color_obj.type;
    // if color_obj is a 'raw' object we search for an propertie name
    } else if (typeof (color_obj.red !== "undefined")) {
        color_type = "rgb";
    } else if (typeof (color_obj.lightness !== "undefined")) {
        color_type = "hsl";
    } else if (typeof (color_obj.brightness !== "undefined")) {
        color_type = "hsb";
    } else if (typeof (color_obj.gray !== "undefined")) {
            color_type = "gray";
    }
    return color_type;
}

/**
 *  find color type of an 'color_obj'.
 *  Returns string 'hsl'|'hsb'|'rgb'|'gray'.
 *  @private
 *  @method _getColorComponentNames
 *  @param {Object} color_obj color_obj `paper.Color` object or compatible raw object
 *  @return {Array} `color component labels`
 *  @for _tweenPropHooks.Color
 */
function _getColorComponentNames(color_obj) {
    let color_component_names;
    if (color_obj._properties) {
        color_component_names = color_obj._properties;
    } else {
        const color_type = _getColorType(color_obj);
        switch (color_type) {
            case "gray": {
                color_component_names = [ "gray"];
            } break;
            case "rgb": {
                color_component_names = [ "red", "green", "blue" ];
            } break;
            case "hsl": {
                color_component_names = [ "hue", "saturation", "lightness" ];
            } break;
            case "hsb": {
                color_component_names = [ "hue", "brightness", "saturation" ];
            } break;
            default:
            // console.error("Color Type not supported.");
        }
    }
    // TODO alpha handling
    return color_component_names;
}


// inspired by https://github.com/jquery/jquery/blob/10399ddcf8a239acc27bdec9231b996b178224d3/src/effects/Tween.js
/**
 *  Helpers to get, set and ease properties that behave differently from "normal" properties. e.g. `scale`.
 *  @class _tweenPropHooks
 *  @private
 *  @static
 */
var _tweenPropHooks = {
    _default: {
        get: function(tween) {
            var output;
            if (tween.item[tween.prop] !== null) {
                output = tween.item[tween.prop];
            }

            return output;
        },
        set: function(tween) {

            var toSet = {};
            toSet[tween.prop] = tween.now;
            tween.item.set(toSet);
        }
    },
    scale: {
        get: function(tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.scale === "undefined") {
                tween.item.data._animatePaperVals.scale = 1;
            }
            var output = tween.item.data._animatePaperVals.scale;
            return output;
        },
        set: function(tween) {

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
            } else {
                tween.item.scale(trueScaling);
            }
        }
    },
    rotate: {
        get: function(tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.rotate === "undefined") {
                tween.item.data._animatePaperVals.rotate = -0;
            }
            var output = tween.item.data._animatePaperVals.rotate;
            return output;
        },
        set: function(tween) {
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
            } else {
                tween.item.rotate(trueRotate);
            }
        }
    },
    translate: {
        get: function(tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.translate === "undefined") {
                tween.item.data._animatePaperVals.translate = new paper.Point(0, 0);
            }
            var output = tween.item.data._animatePaperVals.translate;

            return output;
        },
        set: function(tween) {
            var cur = tween.item.data._animatePaperVals.translate;
            var actual = _pointDiff(tween.now, cur, "-");


            tween.item.data._animatePaperVals.translate = tween.now;

            tween.item.translate(actual);
        },
        ease: function(tween, eased) {

            var temp = _pointDiff(tween.end, tween.start, "-");
            temp.x = temp.x * eased;
            temp.y = temp.y * eased;

            tween.now = _pointDiff(temp, tween.start, "+");

            return tween.now;
        }
    },
    position: {
        get: function(tween) {
            return {
                x: tween.item.position.x,
                y: tween.item.position.y
            };
        },
        set: function(tween) {

            tween.item.position.x += tween.now.x;
            tween.item.position.y += tween.now.y;

        },
        ease: function(tween, eased) {
            // If the values start with + or -,
            // the values are relative to the current pos
            var dirX = "";
            var dirY = "";
            var rX = null;
            var rY = null;

            // used to store value progess
            if(typeof tween._easePositionCache === "undefined") {
                tween._easePositionCache = {
                    x: 0,
                    y: 0
                };
            }


            var endX = Number(tween.end.x || 0);
            var endY = Number(tween.end.y || 0);

            if(!!tween.end.x) {
                rX = (""+tween.end.x).match(dirRegexp);
            }
            if(!!tween.end.y) {
                rY = (""+tween.end.y).match(dirRegexp);
            }
            if(!!rX) {
                dirX = rX[1];
                endX = Number(rX[2]);
            }
            if(!!rY) {
                dirY = rY[1];
                endY = Number(rY[2]);
            }

            var _ease = function(val) {
                return ((val || 0) * eased);
            };

            if(typeof tween.end.x !== "undefined") {
                if(dirX==="+") {
                    tween.now.x = (_ease(endX) - tween._easePositionCache.x);
                    tween._easePositionCache.x += tween.now.x;
                }
                else if(dirX==="-") {
                    tween.now.x = _ease(endX) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                    tween.now.x = - tween.now.x;
                }
                else {
                    // absolute, not relative
                    tween.now.x = ((endX - tween.start.x) * eased) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                }
            }
            else {
                tween.now.x = 0;
            }
            if(typeof tween.end.y !== "undefined") {
                if(dirY==="+") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
                else if(dirY==="-") {

                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                    tween.now.y = - tween.now.y;
                }
                else {
                    // absolute, not relative
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
        get: function(tween) {
            return {
                x: tween.item.x,
                y: tween.item.y
            };
        },
        set: function(tween) {
            tween.item.x += tween.now.x;
            tween.item.y += tween.now.y;
        },
        ease: function(tween, eased) {
            // If the values start with + or -,
            // the values are relative to the current pos
            var dirX = "";
            var dirY = "";
            var rX = null;
            var rY = null;

            // used to store value progess
            if(typeof tween._easePositionCache === "undefined") {
                tween._easePositionCache = {
                    x: 0,
                    y: 0
                };
            }

            var endX = Number(tween.end.x || 0);
            var endY = Number(tween.end.y || 0);

            if(!!tween.end.x) {
                rX = (""+tween.end.x).match(dirRegexp);
            }
            if(!!tween.end.y) {
                rY = (""+tween.end.y).match(dirRegexp);
            }
            if(!!rX) {
                dirX = rX[1];
                endX = Number(rX[2]);
            }
            if(!!rY) {
                dirY = rY[1];
                endY = Number(rY[2]);
            }

            var _ease = function(val) {
                return ((val || 0) * eased);
            };

            if(typeof tween.end.x !== "undefined") {
                if(dirX==="+") {
                    tween.now.x = (_ease(endX) - tween._easePositionCache.x);
                    tween._easePositionCache.x += tween.now.x;
                }
                else if(dirX==="-") {
                    tween.now.x = _ease(endX) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                    tween.now.x = - tween.now.x;
                }
                else {
                    // absolute, not relative
                    tween.now.x = ((endX - tween.start.x) * eased) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                }
            }
            else {
                tween.now.x = 0;
            }
            if(typeof tween.end.y !== "undefined") {
                if(dirY==="+") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
                else if(dirY==="-") {

                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                    tween.now.y = - tween.now.y;
                }
                else {
                    // absolute, not relative
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
            get: function(tween) {
                const current_color = tween.item[tween.prop];
                const component_names = _getColorComponentNames(current_color);
                const result = {};
                for (const component_name of component_names) {
                    result[component_name] = current_color[component_name];
                }
                console.log("result", result);
                return result;
            },
            set: function(tween) {
                const component_names = _getColorComponentNames(tween.item[tween.prop]);

                const current_color = tween.item[tween.prop];
                const color_new = {};

                console.log("tween.now", tween.now);
                for (const component_name of component_names) {
                    color_new[component_name] = (
                        current_color[component_name] +
                        tween.now[component_name]
                    );
                }
                console.log("color_new", color_new);
                tween.item[tween.prop] = color_new;
                console.log("set done.");
            },
            ease: function(tween, eased) {
                // const color_type = _getColorType(tween.End);
                const component_names = _getColorComponentNames(tween.item[tween.prop]);
                // const props = _getColorComponentNames(tween.item[tween.prop]);

                var _ease = function(val) {
                    return (val || 0) * eased;
                };
                for (const component_name of component_names) {
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
                        } else if (dir === "-") {
                            tween.now[curProp] = _ease(end) - tween._easeColorCache[curProp];
                            tween._easeColorCache[curProp] += tween.now[curProp];
                            tween.now[curProp] = -tween.now[curProp];
                        } else {
                            tween.now[curProp] = (end - tween.start[curProp]) * eased - tween._easeColorCache[curProp];
                            tween._easeColorCache[curProp] += tween.now[curProp];
                        }
                    } else {
                        tween.now[curProp] = 0;
                    }
                }
                return tween.now;
            }
        }
};
var _colorProperties = [ "fill", "stroke" ];
for (var i = 0, l = _colorProperties.length; i < l; i++) {
    _tweenPropHooks[_colorProperties[i] + "Color"] = _tweenPropHooks.Color;
}
module.exports = {
    _tweenPropHooks: _tweenPropHooks,
    _pointDiff: _pointDiff,
    extendPropHooks: function(customHooks) {
        for (var i in customHooks) {
            if (customHooks.hasOwnProperty(i)) {
                _tweenPropHooks[i] = customHooks[i];
            }
        }
    }
};
