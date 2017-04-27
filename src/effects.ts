import { Animation } from "./animation";

var _animate = function(item, animation) {
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
export const grow = (path, settings) => {
    console.log("segmentGrow was buggy and has been removed, sorry :/");
    return path;
};
export const shake = (item: paper.Item, settings: { nb?: number, movement?: number, complete?: Function }) => {
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
export const fadeIn = (item: paper.Item, settings: { duration?: number, easing?: string, complete?: Function}) => {
    var duration = 500;
    var complete = undefined;
    var easing = "swing";
    if(typeof settings !== "undefined") {
        if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
        if(typeof settings.complete === "function") complete = settings.complete;
        if(typeof settings.easing !== "undefined") easing = settings.easing;
    }
    _animate(item,{
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
export const fadeOut = (item: paper.Item, settings: { duration?: number, easing?: string, complete?: Function }) => {
    var duration = 500;
    var complete = undefined;
    var easing = "swing";
    if(typeof settings !== "undefined") {
        if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
        if(typeof settings.complete === "function") complete = settings.complete;
        if(typeof settings.easing !== "undefined") easing = settings.easing;
    }
    _animate(item,{
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
export const slideUp = (item: paper.Item, settings: { duration?: number, easing?: string, distance?: number, complete?: Function}) => {
    var duration = 500;
    var complete = undefined;
    var distance = 50;
    var easing = "swing";
    if(typeof settings !== "undefined") {
        if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
        if(typeof settings.complete === "function") complete = settings.complete;
        if(typeof settings.easing !== "undefined") easing = settings.easing;
        if(typeof settings.distance !== "undefined") distance = settings.distance;
    }
    _animate(item,{
        properties: {
            opacity: 1,
            position: {
                y: "-"+distance
            }
        },
        settings: {
            duration: duration,
            easing: easing,
            complete: complete
        }
    });
};
export const slideDown = (item: paper.Item, settings: { duration?: number, distance?: number, easing?: string, complete?: Function }) => {
    var duration = 500;
    var complete = undefined;
    var distance = 50;
    var easing = "swing";
    if(typeof settings !== "undefined") {
        if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
        if(typeof settings.complete === "function") complete = settings.complete;
        if(typeof settings.easing !== "undefined") easing = settings.easing;
        if(typeof settings.distance !== "undefined") distance = settings.distance;
    }
    _animate(item,{
        properties: {
            opacity: 0,
            position: {
                y: "+"+distance
            }
        },
        settings: {
            duration: duration,
            easing: easing,
            complete: complete
        }
    });
};
export const splash = (item: paper.Item, settings: { duration?: number, complete?: Function, easing?: string }) => {
    var duration = 500;
    var complete = undefined;
    var easing = "swing";
    if(typeof settings !== "undefined") {
        if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
        if(typeof settings.complete === "function") complete = settings.complete;
        if(typeof settings.easing !== "undefined") easing = settings.easing;
    }
    _animate(item,{
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
    /**
     * Effects : A facade for easy to use animations.
     * 
     * @class fx
     * @static
     */
    module.exports = {
        /**
         * Grow a path
         *
         * @method grow
         * @deprecated
         * @param {Object} path a paper.js `Path` object
         */
        grow: function(path, settings) {
            console.log("segmentGrow was buggy and has been removed, sorry :/");
            return path;
        },
        /**
         * Shake an item
         *
         * @method shake
         * @param {Object} item a paper.js `Item` object
         * @param {Object} settings
         * @param {Number} settings.nb Number of shakes. Default : 2
         * @param {Number} settings.movement Length of each shake? Default : 40
         * @param {Function} settings.complete complete callback
         */
        shake: shake,
        /**
         * Increase the opacity to 1
         *
         * @method fadeIn
         * @param {Object} item a paper.js `Item` object
         * @param {Object} settings
         * @param {Number} settings.duration Duration of the animation. Default : 500
         * @param {String} settings.easing Name of the easing function. Default : swing
         * @param {Function} settings.complete complete callback
         */
        fadeIn: fadeIn,
        /**
         * Decrease the opacity to 0
         *
         * @method fadeOut
         * @param {Object} item a paper.js `Item` object
         * @param {Object} settings
         * @param {Number} settings.duration Duration of the animation. Default : 500
         * @param {String} settings.easing Name of the easing function. Default : swing
         * @param {Function} settings.complete complete callback
         */
        fadeOut: fadeOut,
        /**
         * Increase the opacity to 1 and go upward
         *
         * @method slideUp
         * @param {Object} item a paper.js `Item` object
         * @param {Object} settings
         * @param {Number} settings.duration Duration of the animation. Default : 500
         * @param {String} settings.easing Name of the easing function. Default : swing
         * @param {Number} setting.distance Distance to move upward. Default : 50
         * @param {Function} settings.complete complete callback
         */
        slideUp: slideUp,
        /**
         * Decrease the opacity to 0 and go downward
         *
         * @method slideDown
         * @param {Object} item a paper.js `Item` object
         * @param {Object} settings
         * @param {Number} settings.duration Duration of the animation. Default : 500
         * @param {String} settings.easing Name of the easing function. Default : swing
         * @param {Number} setting.distance Distance to move downward. Default : 50
         * @param {Function} settings.complete complete callback
         */
        slideDown: slideDown,
        /**
         * Increase the opacity to 1, rotates 360deg and scales by 3.
         *
         * @method splash
         * @param {Object} item a paper.js `Item` object
         * @param {Object} settings
         * @param {Number} settings.duration Duration of the animation. Default : 500
         * @param {String} settings.easing Name of the easing function. Default : swing
         * @param {Function} settings.complete complete callback
         */
        splash: splash
    };
}