import { Animation, AnimationSettings } from "./animation";
import * as effects from "./effects";
import { easing } from "./easing";
import * as _frameManager from "./frameManager";
import { extendPropHooks } from "./prophooks";
var paper = require("./getPaper");

export interface AnimationArguments {
    settings: AnimationSettings;
    properties: {}
}
/**
 *  The main animation interface.
 *  It can take a single option object or an array of option objects
 *  if you want to chain animations without falling into Callback Hell.
 *
 *  @method animate
 *  @chainable
 *  @for animatePaper
 */
export const animate = (item: paper.Item, animation: AnimationArguments | Array<AnimationArguments>) => {
    var animations = [];
    var output;

    if (animation instanceof Array) {
        animations = animation;
    } else {
        animations.push(animation);
    }
    var index = 0; // current index in the animations
    new Animation(item, animations[index].properties, animations[index].settings, function _continue() {
        index++;
        if (typeof animations[index] !== "undefined") {
            new Animation(item, animations[index].properties, animations[index].settings, _continue);
        }
    });
    return item;
};
/**
 *  Stops all animations on the item. If `goToEnd` is `true`,
 *  the animated properties will be set to their final values.
 *  
 *  @method stop
 *  @chainable
 *  @for animatePaper
 */
export const stop = (item: paper.Item, goToEnd?: boolean, forceEnd?: boolean) => {
    if (!!item.data._animatePaperAnims) {
        for (var i = 0, l = item.data._animatePaperAnims.length; i < l; i++) {
            if (!!item.data._animatePaperAnims[i]) {
                item.data._animatePaperAnims[i].stop(goToEnd, forceEnd);
            }
        }
    }
    return item;
};
/**
 *  Use this method to extend the private {{#crossLink "easing"}}{{/crossLink}} collection.
 *
 *  The `customEasings` object should like this :
 *  ````
 *      {
 *          "easingName": function(p) { easing algorithm }
 *      }
 *  ````
 *  When used, easing functions are passed the following arguments :
 *   * `percent`
 *   * `percent * duration`
 *
 *  Easing functions are obviously expected to return the eased percent.
 *
 *  @method extendEasing
 *  @for animatePaper
 *  @param {Object} customEasings A collection of easing functions
 */
export const extendEasing = easing.extendEasing;
/**
 *  Use this method to extend {{#crossLink "_tweenPropHooks"}}{{/crossLink}}.
 *
 *  The `customHooks` object should like this :
 *  ````
 *      {
 *          "propertyName": {
 *              set: function() {},
 *              get: function() {},
 *              ease: function() {}
 *          }
 *      }
 *  ````
 *  Each hook can contain a `get`, `set` and `ease` functions. When these functions are used, they are passed only
 *  one argument : the {{#crossLink "Tween"}}{{/crossLink}} object, exept for the `ease()` function which gets the eased percent
 *  as second parameter.
 *
 *   * The `get()` function must return the current value of the `Tween.item`'s property.
 *   * The `set()` function must set the value of the `Tween.item`'s property with `Tween.now` (which will
 *   most likely be the result of `get()` or `ease()`)
 *   * The `ease()` function must return the eased value. The second parameter is the eased percent.
 *
 *
 *  @method extendPropHooks
 *  @for animatePaper
 *  @param {Object} customHooks A collection of objects
 */
// exports.extendPropHooks = require("./prophooks").extendPropHooks;

export const frameManager = _frameManager;
export const fx = effects;

// Extends paper.Item prototype
if (!paper.Item.prototype.animate) {
    paper.Item.prototype.animate = function(animation) {
        return animate(this, animation);
    };
}
if (!paper.Item.prototype.stop) {
    paper.Item.prototype.stop = function(goToEnd, forceEnd) {
        return stop(this, goToEnd, forceEnd);
    };
}
if (typeof module !== "undefined") {
    module.exports = {
        animate: animate,
        stop: stop,
        frameManager: frameManager,
        fx: fx,
        extendEasing: extendEasing,
        extendPropHooks: extendPropHooks
    };
}
