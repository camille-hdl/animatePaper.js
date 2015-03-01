/**
 *  An animation library for paper.js
 *  camille.hodoul@gmail.com
 *
 *  @module animatePaper
 *  @main
 */
(function(global,paper) {
    var animatePaper = {};
    var debug = true;
    var _log = function() {
        if(!!debug) {
            console.debug.call(console,arguments.splice(0));
        }
    };
    /**
	 *  This is the only function called in a objects `onFrame` handler.
     *  If the objects has callbacks in it's `data._customHandlers` property,
     *  each of these is called.
	 *
	 *  @private
	 *  @method frameManagerHandler
     *  @param {Object} ev The event object
     *  @for frameManager
	 */
	function frameManagerHandler(ev) {
		var item = this;
		if(typeof item.data._customHandlers !== "undefined" &&
			item.data._customHandlersCount > 0
			) {
			// parcourir les handlers et les declencher
			for(var i in item.data._customHandlers) {
				if(item.data._customHandlers.hasOwnProperty(i)) {
					if(typeof item.data._customHandlers[i] === "function") {
						item.data._customHandlers[i].call(item,ev);
					}
				}
			}
		}
	}
	/**
	 *  The `frameManager` is used to bind and unbind multiple callbacks to an object's
     *  `onFrame`. If an object has at least one handler, it's `onFrame` handler will be
     *  {{#crossLink "frameManager/frameManagerHandler:method"}}{{/crossLink}}.
	 *
	 *  @class frameManager
	 *  @static
	 */
	animatePaper.frameManager = {
		/**
		 * Add a callback to a paper.js Item's `onFrame` event.
		 * The Item itself will be the `thisValue` and the event object `ev` will be the first argument
		 * 
		 * @param {Object} item paper.js Item
		 * @param {String} name An identifier for this callback
		 * @param {Function} callback
         * @example
         *      animatePaper.frameManager.add(circle,"goUp",function(ev) {
         *          // Animation logic
         *      });
		 * @method add
		 */
		add: function(item,name,callback) {
			if(typeof item.data._customHandlers === "undefined") {
				item.data._customHandlers = {};
				item.data._customHandlersCount = 0;
			}
			item.data._customHandlers[name] = callback;
			item.data._customHandlersCount += 1;
			if(item.data._customHandlersCount>0) {
				item.onFrame = frameManagerHandler;
			}
            return name;
		},
		/**
		 * Remove a callback from an item's `onFrame` handler.
		 * 
		 * @param {Object} item paper.js Item object
		 * @param {String} name The identifier of the callback you want to remove
		 * @method remove
		 */
		remove: function(item,name) {
			if(typeof item.data._customHandlers !== "undefined") {
				item.data._customHandlers[name] = null;
				item.data._customHandlersCount -= 1;
				if(item.data._customHandlersCount <= 0) {
					item.data._customHandlersCount = 0;
					item.onFrame = null;
				}
			}
		}
	};

    /**
	 *  The main animation interface.
     *  It can take a single option object or an array of option objects
	 *  if you want to chain animations without falling into Callback Hell.
     *
	 *  @method animate
	 *  @for animatePaper
	 */
    animatePaper.animate = function(item,animation) {
        var animations = [];
        var output;
        
        if(animation instanceof Array) {
            animations = animation;
        }
        else {
            animations.push(animation);
        }
        return new Animation(item,animation.properties,animation.settings);
    };

    /**
     *  Easings
     *  
     *  @class easing
     *  @static
     */
    var easing = {
        linear: function(p) {
            return p;
        },
        swing: function(p) {
            return 0.5 - Math.cos(p * Math.PI) /2;
        }
    };


    
    /**
     *  Animation class.
     *  
     *  @class Animation
     *  @constructor
     *  @param {Object} item a paper.js Item instance, which will be animated.
     *  @param {Object} properties properties to animate
     *  @param {Object} settings
     */
    function Animation(item,properties,settings) {
        var self = this;
        self.stopped = false;
        self.index = 0;
        self.startTime = new Date().getTime();
        self.settings = _initializeSettings(settings);
        self.item = item;
        self.tweens = [];
        self.ticker;

        for(var i in properties) {
            if(properties.hasOwnProperty(i)) {
                self.tweens.push(new Tween(i,properties[i],self));
            }
        }

        if(self.settings.mode === "onFrame") {
            self.ticker = animatePaper.frameManager.add(self.item,"_animate"+startTime,function() {
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
        var currentTime = new Date().getTime();
        var remaining = Math.max(0,self.startTime + self.settings.duration - currentTime);
        var temp = remaining / self.settings.duration || 0;
        var percent = 1 - temp;
        for(var i = 0,l = self.tweens.length; i < l; i++) {
            self.tweens[i].run(percent);
        }

        if(typeof self.settings.step !== "undefined") {
            self.settings.step.call(self.item,{percent:percent,remaining:remaining});
        }

        // if the Animation is in timeout mode, we must force a View update
        if(self.settings.mode === "timeout") {
            //
        }
        if(percent < 1 && length) {
            return remaining;
        }
        else {
            self.end();
            return false;
        }
    };
    /**
     *  Interrupts the animation. If `goToEnd` is true, all the properties are set to their final value.
     *  @method stop
     *  @param {Bool} goToEnd
     */
    Animation.prototype.stop = function(goToEnd) {
        var self = this;
        var i = 0;
        var l = goToEnd ? self.tweens.length : 0;
        if(!!self.stopped) return self;
        self.stopped = true;
        for( ; i<l; i++) {
            self.tweens[i].run(1);
        }
        if(!!goToEnd) {
            self.end();
        }
    };
    /**
     *  Called when the animations ends, naturally or using `.stop(true)`.
     *  @method end
     */
    Animation.prototype.end = function() {
        var self = this;
        if(self.settings.mode === "onFrame") {
            animatePaper.frameManager.remove(self.item,self.ticker);
        }
        if(typeof self.settings.complete !== "undefined") {
            self.settings.complete.call(self.item);
        }
        // if the Animation is in timeout mode, we must force a View update
        if(self.settings.mode === "timeout") {
            //
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
            easing: "linear",
            complete: undefined,
            step: undefined,
            mode: "onFrame"
        };
        typeof settings === "undefined" ? settings = {};

        // .duration must exist, and be a positive Number
        if(typeof settings.duration === "undefined") {
            settings.duration = defaults.duration;
        }
        else {
            settings.duration = Number(settings.duration);
            if(settings.duration < 1) {
                settings.duration = defaults.duration;
            }
        }

        // .easing must be defined in `easing`
        if(typeof settings.easing === "undefined") {
            settings.easing = defaults.easing;
        }
        else {
           if(typeof(easing[settings.easing]) !== "undefined" && easing.hasOwnProperty(settings.easing)) {
               settings.easingFunction = easing[settings.easing];
           }
           else {
               settings.easing = defaults.easing;
               settings.easingFunction = easing[defaults.easing];
           }
        }

        // callbacks must be functions
        if(typeof settings.complete !== "function") {
            settings.complete = undefined;
        }
        if(typeof settings.step !== "function") {
            settings.step = undefined;
        }

        // .mode must be either "onFrame" or "timeout"
        if(["onFrame","timeout"].indexOf(settings.mode) === -1) {
            settings.mode = defaults.mode;
        }

        return settings;
    }

    // inspired by https://github.com/jquery/jquery/blob/10399ddcf8a239acc27bdec9231b996b178224d3/src/effects/Tween.js
    var _tweenPropHooks = {
        _default: {
            get: function(tween) {
                var output;
                if(tween.item[tween.prop] != null) {
                    output = tween.item[tween.prop];
                }

                return output;
            },
            set: function(tween) {
                tween.item[tween.prop] = tween.now;
            }
         
        }
    };
    /**
     *  Tween class.
     *  
     *  @class Tween
     *  @constructor
     *  @param {String} Property name
     *  @param {mixed} Final value
     *  @param {Object} animation
     */
    function Tween(property,value,animation) {
        var self = this;
        self.A = animation;
        self.item = animation.item;
        self.prop = property;
        self.end = value;
        self.start = self.now = self.cur();
        
    }
    Tween.prototype.cur = function() {
        var self = this;
        // should we use a special way to get the current value ? if not just use item[prop]
        var hooks = _tweenPropHooks[self.prop];
        return hooks && hooks.get ? hooks.get(this) : _tweenPropHooks._default.get(this);
    };
    Tween.prototype.run = function(percent) {
        var self = this;
        var eased;
        var hooks = _tweenPropHooks[self.prop];
        var settings = self.animation.settings;
        if(settings.duration) {
            self.pos = eased = easing[settings.easing](percent,settings.duration * percent, 0, 1, self.duration);
        }
        else {
            self.pos = eased = percent;
        }
        // refresh current value
        self.now = (self.end - self.start) * eased + self.start;
        if(hooks && hooks.set) {
            hooks.set(this);
        }
        else {
            _tweenPropHooks._default.set(this);
        }
        return this;
    };

    
    global.animatePaper = animatePaper;
})(window,paper);