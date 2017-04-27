import { _tweenPropHooks}  from "./prophooks";
import { easing } from "./easing";
import { Animation } from "./animation";
/**
 *  Tween class. TODO : figure out a way to add support for extra arguments to pass to the Tweens (like for rotate() )
 *  
 *  @class Tween
 *  @constructor
 *  @param {String} Property name
 *  @param {mixed} Final value
 *  @param {Object} animation
 */
export class Tween {
    A: Animation;
    item: paper.Item;
    prop: string;
    end: any;
    start: any;
    now: any;
    direction: "+" | "-";
    duration: number;
    pos: number;
    _easePositionCache: any;
    _easeColorCache: any;
    constructor(property: string, value: any, animation: Animation) {
        var self = this;
        
        /**
         *  Reference to the {{#crossLink "Animation"}}{{/crossLink}}
         *  @property {Object} A
         *  @readonly
         */
        self.A = animation;
        /**
         *  Animated `paper.Item` object
         *  @property {Object} item
         *  @readonly
         */
        self.item = animation.item;
        /**
         *  Name of the animated property
         *  @property {String} prop
         *  @readonly
         */
        self.prop = property;
        /**
         *  The value the property will have when the animation is over.
         *  @property {mixed} end
         *  @readonly
         */
        self.end = value;
        /**
         *  Value of the property when the animation starts. Set using {{#crossLink "Tween/cur:method"}}{{/crossLink}}
         *  @property {mixed} start
         *  @readonly
         */
        self.start = self.cur();
        if (typeof self.end === "string" && self.end.charAt(0) === "+") {
            self.end = self.start + parseFloat(self.end);
        } else if (typeof self.end === "string" && self.end.charAt(0) === "-") {
            self.end = self.start + parseFloat(self.end);
        }
        /**
         *  Current value of the property. Set using {{#crossLink "Tween/cur:method"}}{{/crossLink}}
         *  @property {mixed} now
         */
        self.now = self.cur();
        /**
         *  If the value of the property increases, `direction` will be `'+'`, if it decreases : `'-'`.
         *  @property {String} direction
         *  @readonly
         */
        self.direction = self.end > self.start ? "+" : "-";  
        

    }
    /**
     *  Get the current value of the animated property. Uses {{#crossLink "_tweenPropHooks"}}{{/crossLink}} if
     *  available.
     *  @method cur
     *  @return {mixed} Current value
     */
    cur() {
        var self = this;
        
        // should we use a special way to get the current value ? if not just use item[prop]
        var hooks = _tweenPropHooks[self.prop];

        return hooks && hooks.get ? hooks.get(self) : _tweenPropHooks._default.get(self);
    }
    /**
     *  Called on each {{#crossLink "Animation/tick:method"}}{{/crossLink}}. Set the value of the property
     *  to the eased value. Uses {{#crossLink "_tweenPropHooks"}}{{/crossLink}} if available.
     *  It takes the percentage of the animation duration as argument.
     *  @method run
     *  @param {Number} percent 
     *  @return {Object} self
     *  @chainable
     */
    run(percent: number) {
        var self = this;
        var eased;
        var hooks = _tweenPropHooks[self.prop];

        var settings = self.A.settings;
        if (settings.duration) {
            self.pos = eased = easing[settings.easing](percent, settings.duration * percent, 0, 1, self.duration);
        } else {
            self.pos = eased = percent;
        }
        // refresh current value
        if (hooks && hooks.ease) {
            hooks.ease(self, eased);
        } else {
            self.now = (self.end - self.start) * eased + self.start;
        }

        if (hooks && hooks.set) {
            hooks.set(self);
        } else {
            _tweenPropHooks._default.set(self);
        }

        return self;
    }
};