var dirRegexp = /^([+\-])(.+)/;
import { Tween } from "./tween";
/**
 *  check if value is relative or absolute
 *  by : https://github.com/s-light/
 *  https://github.com/Eartz/animatePaper.js/pull/15
 *  @private
 *  @method _parseAbsoluteOrRelative
 *  @param {Number} | {String} value to check
 *  @return {Object} `{value: Number, dir: String}`
 *  @for Tween
 */
export const _parseAbsoluteOrRelative = (value: string | number): { value: number, direction: string } => {
    let valueNumber = null;
    let valueDirection = "";

    // handle absolute values
    valueNumber = Number(value);

    // check for relative values
    if (typeof value === "string") {
        const valueMatch = value.match(dirRegexp);
        valueDirection = valueMatch[1];
        valueNumber = Number(valueMatch[2]);
    }

    return { value: valueNumber, direction: valueDirection };
}

/**
 *  Performs an operation on two paper.Point() objects.
 *  Returns the result of : ` a operator b`.
 *  @private
 *  @method __pointDiff
 *  @param {Object} a a `paper.Point` object
 *  @param {Object} b a `paper.Point` object
 *  @param {String} operator either `+` or `-`
 *  @return {Object} `{x: (a.x operator b.x), y: (a.y operator b.y)}`
 *  @for Tween
 */
export const __pointDiff = (a: {x: number, y: number, add: Function, subtract: Function}, b: {x: number, y: number}, operator: "+" | "-") => {
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
 *  @for __tweenPropHooks.Color
 */
export const _getColorType = (color_obj) => {
    let color_type;
    // if the color_obj is created with paper.Color it has an 'type' propertie.
    if (color_obj.type) {
        color_type = color_obj.type;
    // if color_obj is a 'raw' object we search for an propertie name
    } else if (typeof color_obj.red !== "undefined") {
        color_type = "rgb";
    } else if (typeof color_obj.lightness !== "undefined") {
        color_type = "hsl";
    } else if (typeof color_obj.brightness !== "undefined") {
        color_type = "hsb";
    } else if (typeof color_obj.gray !== "undefined") {
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
 *  @for __tweenPropHooks.Color
 */
export const _getColorComponentNames = (color_obj) => {
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
 *  @class __tweenPropHooks
 *  @private
 *  @static
 */
var __tweenPropHooks = {
    _default: {
        get: (tween: Tween) => {
            var output;
            if (tween.item[tween.prop] !== null) {
                output = tween.item[tween.prop];
            }

            return output;
        },
        set: (tween: Tween, percent: number) => {
            var toSet = {};
            if (percent === 1) {
                toSet[tween.prop] = tween.end;
            } else {
                toSet[tween.prop] = tween.now;
            }
            tween.item.set(toSet)
        }
    },
    scale: {
        get: function(tween: Tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.scale === "undefined") {
                tween.item.data._animatePaperVals.scale = 1;
            }
            var output = tween.item.data._animatePaperVals.scale;
            return output;
        },
        set: function(tween: Tween, percent: number) {

            var curScaling = tween.item.data._animatePaperVals.scale;
            var trueScaling = tween.now / curScaling;

            tween.item.data._animatePaperVals.scale = tween.now;
            var center: any = false;
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
        get: function(tween: Tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.rotate === "undefined") {
                tween.item.data._animatePaperVals.rotate = -0;
            }
            var output = tween.item.data._animatePaperVals.rotate;
            return output;
        },
        set: function(tween: Tween) {
            var curRotate = tween.item.data._animatePaperVals.rotate;
            var trueRotate = tween.now - curRotate;

            tween.item.data._animatePaperVals.rotate = tween.now;

            var center: any = false;
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
        get: function(tween: Tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.translate === "undefined") {
                tween.item.data._animatePaperVals.translate = new paper.Point(0, 0);
            }
            var output = tween.item.data._animatePaperVals.translate;

            return output;
        },
        set: function(tween: Tween) {
            var cur = tween.item.data._animatePaperVals.translate;
            var actual = __pointDiff(tween.now, cur, "-");


            tween.item.data._animatePaperVals.translate = tween.now;

            tween.item.translate(actual);
        },
        ease: function(tween: Tween, eased: number) {

            var temp = __pointDiff(tween.end, tween.start, "-");
            temp.x = temp.x * eased;
            temp.y = temp.y * eased;

            tween.now = __pointDiff(temp, tween.start, "+");

            return tween.now;
        }
    },
    // used to move Item() objects
    position: {
        get: function(tween: Tween) {
            return {
                x: tween.item.position.x,
                y: tween.item.position.y
            };
        },
        set: function(tween: Tween, percent: number) {
            if (percent === 1) {
                // ensure final value is accurate
                const { value: endX, direction: dirX} = _parseAbsoluteOrRelative(tween.end.x || 0);
                const { value: endY, direction: dirY} = _parseAbsoluteOrRelative(tween.end.y || 0);
                if (typeof tween.end.x !== "undefined") {
                    if (dirX === "+") {
                        tween.item.position.x = tween.start.x + endX;
                    } else if (dirX === "-") {
                        tween.item.position.x = tween.start.x - endX;
                    }
                    else {
                        tween.item.position.x = tween.end.x;
                    }
                }
                if (typeof tween.end.y !== "undefined") {
                    if (dirY === "+") {
                        tween.item.position.y = tween.start.y + endY;
                    } else if (dirY === "-") {
                        tween.item.position.y = tween.start.y - endY;
                    }
                    else {
                        tween.item.position.y = tween.end.y;
                    }
                }
            } else {
                tween.item.position.x += tween.now.x;
                tween.item.position.y += tween.now.y;
            }
        },
        ease: function(tween: Tween, eased: number) {
            // used to store value progess
            if(typeof tween._easePositionCache === "undefined") {
                tween._easePositionCache = {
                    x: 0,
                    y: 0
                };
            }
 
            const { value: endX, direction: dirX} = _parseAbsoluteOrRelative(tween.end.x || 0);
            const { value: endY, direction: dirY} = _parseAbsoluteOrRelative(tween.end.y || 0);

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
    // used to move Point() objects
    pointPosition: {
        get: function(tween: Tween) {
            return {
                x: tween.item.x,
                y: tween.item.y
            };
        },
        set: function(tween: Tween, percent: number) {
            if (percent === 1) {
                // ensure final value is accurate
                const { value: endX, direction: dirX} = _parseAbsoluteOrRelative(tween.end.x || 0);
                const { value: endY, direction: dirY} = _parseAbsoluteOrRelative(tween.end.y || 0);
                if (typeof tween.end.x !== "undefined") {
                    if (dirX === "+") {
                        tween.item.x = tween.start.x + endX;
                    } else if (dirX === "-") {
                        tween.item.x = tween.start.x - endX;
                    }
                    else {
                        tween.item.x = tween.end.x;
                    }
                }
                if (typeof tween.end.y !== "undefined") {
                    if (dirY === "+") {
                        tween.item.y = tween.start.y + endY;
                    } else if (dirY === "-") {
                        tween.item.y = tween.start.y - endY;
                    }
                    else {
                        tween.item.y = tween.end.y;
                    }
                }
            } else {
                tween.item.x += tween.now.x;
                tween.item.y += tween.now.y;
            }
        },
        ease: function(tween: Tween, eased: number) {
            // used to store value progess
            if(typeof tween._easePositionCache === "undefined") {
                tween._easePositionCache = {
                    x: 0,
                    y: 0
                };
            }
            const { value: endX, direction: dirX} = _parseAbsoluteOrRelative(tween.end.x || 0);
            const { value: endY, direction: dirY} = _parseAbsoluteOrRelative(tween.end.y || 0);

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
            get: function(tween: Tween) {
                // 'should' work but does not:
                // return tween.item[tween.prop];
                // this creates a unlinked copy of only the color component values.
                // this seems to be nessesecary to avoid a bug/problem in
                // paper.js Color class in combinaiton with Groups
                const current_color = tween.item[tween.prop];
                const component_names = _getColorComponentNames(current_color);
                const result = {};
                for (const component_name of component_names) {
                    result[component_name] = current_color[component_name];
                }
                return result;
            },
            set: function(tween: Tween, percent: number) {
                // this creates a unlinked copy of only the color component values first.
                // this seems to be nessesecary to avoid a bug in
                // paper.js Color class in combinaiton with Groups and setting single properties
                const component_names = _getColorComponentNames(tween.item[tween.prop]);
                const current_color = tween.item[tween.prop];
                const color_new = {};
                
                    
                for (const component_name of component_names) {
                    if (percent === 1) {
                        // make sure the final value is accurate :
                        // use directly the end value, bypassing intermediary computations
                        const {value: end, direction: dir} = _parseAbsoluteOrRelative(tween.end[component_name] || 0);
                        if (typeof tween.end[component_name] !== "undefined") {
                            if (dir === "+") {
                                tween.now[component_name] = tween.start[component_name] + end;
                                tween._easeColorCache[component_name] = tween.start[component_name] + end;
                            } else if (dir === "-") {
                                tween.now[component_name] = tween.start[component_name] - end;
                                tween._easeColorCache[component_name] = tween.start[component_name] - end;
                            } else {
                                tween.now[component_name] = tween.end[component_name];
                                tween._easeColorCache[component_name] = tween.end[component_name];
                            }
                        } else {
                            tween.now[component_name] = tween.start[component_name];
                        }
                        color_new[component_name] = tween.now[component_name];
                    } else {
                        color_new[component_name] = current_color[component_name] + tween.now[component_name];
                    }
                }
                // console.log(percent, color_new);
                tween.item[tween.prop] = color_new;
            },
            ease: function(tween: Tween, eased: number) {
                const component_names = _getColorComponentNames(tween.item[tween.prop]);

                var _ease = function(val) {
                    return (val || 0) * eased;
                };
                for (const component_name of component_names) {
                    var curProp = component_name;
                    if (typeof tween._easeColorCache === "undefined") {
                        tween._easeColorCache = {};
                    }
                    if (typeof tween._easeColorCache[curProp] === "undefined") {
                        tween._easeColorCache[curProp] = 0;
                    }

                    // If the values are strings and start with + or -,
                    // the values are relative to the current pos
                    const {value: end, direction: dir} = _parseAbsoluteOrRelative(tween.end[curProp] || 0);

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
    __tweenPropHooks[_colorProperties[i] + "Color"] = __tweenPropHooks.Color;
}

export const _tweenPropHooks = __tweenPropHooks;
export const _pointDiff = __pointDiff;
export const extendPropHooks = (customHooks) => {
    for (var i in customHooks) {
        if (customHooks.hasOwnProperty(i)) {
            __tweenPropHooks[i] = customHooks[i];
        }
    }
};
if (typeof module !== "undefined") {
    module.exports = {
        _tweenPropHooks: __tweenPropHooks,
        __pointDiff: __pointDiff,
        extendPropHooks: extendPropHooks,
        _parseAbsoluteOrRelative: _parseAbsoluteOrRelative,
        _getColorType: _getColorType,
        _getColorComponentNames: _getColorComponentNames
    };
}
