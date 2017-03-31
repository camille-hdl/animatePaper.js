"use strict";


var paper = require("./getPaper");
var Tween = require("./tween");
var frameManager = require("./frameManager");
var easing = require("./easing");


/**
 *  Animation class. Default settings are :
 *
 *  ````
 *      var defaults = {
 *           duration: 400,
 *           easing: "linear",
 *           complete: undefined,
 *           step: undefined
 *      };
 *  ````
 *  @class Animation
 *  @constructor
 *  @param {Object} item a paper.js Item instance, which will be animated.
 *  @param {Object} properties properties to animate
 *  @param {Object} settings
 *  @param {Number} settings.duration Duration of the animation, in ms
 *  @param {String} settings.easing
 *  @param {Function} settings.complete Called when the animation is over, in `.end()`. The item is passed as argument
 *  @param {Function} settings.step Called on each `.tick()`
 */
function Animation(item, properties, settings, _continue) {
        var self = this;

        /**
         *  True if the animation is stopped
         *  @property {Bool} stopped
         */
        self.stopped = false;
        /**
         *  Time when the Animation is created
         *  @property {Timestamp} startTime
         *  @readonly
         */
        self.startTime = new Date().getTime();
        /**
         *  Settings, after being normalized in {{#crossLink "_initializeSettings"}}{{/crossLink}}
         *  @property {Object} settings
         */
        self.settings = _initializeSettings(settings);
        /**
         *  The animated `paper.Item`
         *  @property {Object} item
         *  @readonly
         */
        self.item = item;
        /**
         *  If provided, use parentItem to use .data and .onFrame. If not, use self.item;
         *  @property {Object} itemForAnimations
         *  @readonly
         */
        self.itemForAnimations = self.settings.parentItem || self.item;

        /**
         * Repeat parameter.
         * If `true`, the animation is repeated until `.end(true)` is called.
         * If `repeat` is an integer, the animation is repeated until `repeat` is <= 0.
         * Default `0`
         * @property {Mixed} repeat
         */
        self.repeat = self.settings.repeat || 0;
        if (self.repeat === true || self.repeat > 0) {
            self.repeatCallback = function(newRepeat) {
                settings.repeat = newRepeat;
                // used for the repeat feature
                return new Animation(item, properties, settings, _continue);
            };
        }

        /**
         *  {{#crossLink "Tween"}}{{/crossLink}}s used by the Animation.
         *  @property {Array} tweens
         */
        self.tweens = [];
        /**
         *  If the Animation is in `onFrame` mode :
         *  Identifier of the {{#crossLink "frameMamanger"}}{{/crossLink}} callback called on every tick.
         *  @property {String} ticker
         *  @readonly
         */
        self.ticker = null;
        /**
         *  Callback used when queueing animations.
         *  @property {Function} _continue
         *  @readonly
         *  @private
         */
        self._continue = _continue;

        // store the reference to the animation in the item's data
        if (typeof self.itemForAnimations.data === "undefined") {
            self.itemForAnimations.data = {};
        }
        if (typeof self.itemForAnimations.data._animatePaperAnims === "undefined") {
            self.itemForAnimations.data._animatePaperAnims = [];
        }
        /**
         *  Index of the animation in the item's queue.
         *  @property {Number} _dataIndex
         *  @readonly
         *  @private
         */
        self._dataIndex = self.itemForAnimations.data._animatePaperAnims.length;
        self.itemForAnimations.data._animatePaperAnims[self._dataIndex] = self;

        for (var i in properties) {
            if (properties.hasOwnProperty(i)) {
                self.tweens.push(new Tween(i, properties[i], self));
            }
        }

        if (self.settings.mode === "onFrame") {
            self.ticker = frameManager.add(self.itemForAnimations, "_animate" + self.startTime + (Math.floor(Math.random() * (1000 - 1)) + 1), function() {
                self.tick();
            });
        }
    }
    /**
     *  Called on each step of the animation.
     *
     *  @method tick
     */
Animation.prototype.tick = function() {
    var self = this;
    if (!!self.stopped) return false;
    var currentTime = new Date().getTime();
    if( self.startTime + self.settings.delay > currentTime ){
        return false;
    }
    var remaining = Math.max(0, self.startTime + self.settings.delay + self.settings.duration - currentTime);
    var temp = remaining / self.settings.duration || 0;
    var percent = 1 - temp;

    for (var i = 0, l = self.tweens.length; i < l; i++) {
        self.tweens[i].run(percent);
    }
    if (typeof self.settings.step !== "undefined") {
        self.settings.step.call(self.item, {
            percent: percent,
            remaining: remaining
        });
    }
    if (typeof self.settings.parentItem !== "undefined") {
        self.settings.parentItem.project.view.draw();
    } else {
        self.item.project.view.draw();
    }

    // if the Animation is in timeout mode, we must force a View update
    if (self.settings.mode === "timeout") {
        //
    }
    if (percent < 1 && l) {
        return remaining;
    } else {
        self.end();
        return false;
    }
};
/**
 *  Interrupts the animation. If `goToEnd` is true, all the properties are set to their final value.
 *  @method stop
 *  @param {Bool} goToEnd
 *  @param {Bool} forceEnd to prevent loops
 */
Animation.prototype.stop = function(goToEnd, forceEnd) {
    var self = this;
    var i = 0;
    var l = goToEnd ? self.tweens.length : 0;
    if (!!self.stopped) return self;
    self.stopped = true;
    for (; i < l; i++) {
        self.tweens[i].run(1);
    }
    if (!!goToEnd) {
        // stop further animation
        if (!!self._continue) self._continue = null;
        self.end(forceEnd);
    }
};
/**
 *  Called when the animations ends, naturally or using `.stop(true)`.
 *  @method end
 */
Animation.prototype.end = function(forceEnd) {
    var self = this;
    if (self.settings.mode === "onFrame") {
        frameManager.remove(self.itemForAnimations, self.ticker);
    }
    if (typeof self.settings.complete !== "undefined") {
        self.settings.complete.call(self.item);
    }

    // if the Animation is in timeout mode, we must force a View update
    if (self.settings.mode === "timeout") {
        //
    }
    if (typeof self._continue === "function") {
        self._continue.call(self.item);
    }
    // remove all references to the animation
    self.itemForAnimations.data._animatePaperAnims[self._dataIndex] = null;
    if (!!forceEnd || typeof self.repeatCallback !== "function") {
        self = null;
    } else {
        // repeat
        var newRepeat = self.repeat;
        if (self.repeat !== true) {
            newRepeat = self.repeat - 1;
        }
        return self.repeatCallback(newRepeat);
    }
};

/**
 *  Normalizes existing values from an Animation settings argument
 *  and provides default values if needed.
 *
 *  @method _initializeSettings
 *  @param {mixed} settings a `settings` object or undefined
 *  @private
 */
function _initializeSettings(settings) {
    var defaults = {
        duration: 400,
        delay: 0,
        repeat: 0,
        easing: "linear",
        complete: undefined,
        step: undefined,
        mode: "onFrame"
    };
    if (typeof settings === "undefined") {
        settings = {};
    }

    // .duration must exist, and be a positive Number
    if (typeof settings.duration === "undefined") {
        settings.duration = defaults.duration;
    } else {
        settings.duration = Number(settings.duration);
        if (settings.duration < 1) {
            settings.duration = defaults.duration;
        }
    }
    // .delay must exist, and be a positive Number
    if (typeof settings.delay === "undefined") {
        settings.delay = defaults.delay;
    } else {
        settings.delay = Number(settings.delay);
        if (settings.delay < 1) {
            settings.delay = defaults.delay;
        }
    }

    // .repeat must exist, and be a positive Number or true
    if (typeof settings.repeat === "undefined") {
        settings.repeat = defaults.repeat;
    } else {
        if (settings.repeat !== true) {
            settings.repeat = Number(settings.repeat);
            if (settings.repeat < 0) {
                settings.repeat = defaults.repeat;
            }
        }
    }

    // .easing must be defined in `easing`
    if (typeof settings.easing === "undefined") {
        settings.easing = defaults.easing;
    }
    if (typeof easing[settings.easing] !== "undefined" && easing.hasOwnProperty(settings.easing)) {
        settings.easingFunction = easing[settings.easing];
    } else {
        settings.easing = defaults.easing;
        settings.easingFunction = easing[defaults.easing];
    }


    // callbacks must be functions
    if (typeof settings.complete !== "function") {
        settings.complete = undefined;
    }
    if (typeof settings.step !== "function") {
        settings.step = undefined;
    }

    // .mode must be either "onFrame" or "timeout"
    if (["onFrame", "timeout"].indexOf(settings.mode) === -1) {
        settings.mode = defaults.mode;
    }

    return settings;
}

module.exports = Animation;
