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
    var output = new paper.Point(
        eval(ax + operator + bx),
        eval(ay + operator + by)
    );

    return output;
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
            if (tween.item[tween.prop] != null) {
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
            tween.item.scale(trueScaling);
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
            tween.item.rotate(trueRotate);
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
    segmentGrow: {
        get: function(tween) {
            if (!(tween.item instanceof paper.Path)) {
                throw new Error("Only a Path object can be used with : segmentGrow");
            }


            var output = tween.item.lastSegment.point;
            return output;
        },
        set: function(tween) {

            tween.item.add(tween.now);
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
                }
            }


            var endX = Number(tween.end.x || 0);
            var endY = Number(tween.end.y || 0);
            
            if(!!tween.end.x) var rX = (""+tween.end.x).match(dirRegexp);
            if(!!tween.end.y) var rY = (""+tween.end.y).match(dirRegexp);
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
                    tween.now.x = ((endY - tween.start.x) * eased) - tween._easePositionCache.x;
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
    }

};