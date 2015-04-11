/**
 * Effects : A facade for easy to use animations.
 * 
 * @class fx
 * @static
 */
animatePaper.fx = {
    /**
     * Grow a path
     *
     * @method grow
     * @param {Object} path a paper.js `Path` object
     * @param {Object} settings
     * @param {Object} settings.to an object with `x` and `y` properties
     * @param {String} settings.easing defaults to `swing`
     * @param {Function} settings.complete complete callback
     */
    grow: function(path, settings) {
        animatePaper.animate(path, {
            properties: {
                segmentGrow: settings.to
            },
            settings: {
                easing: settings.easing,
                complete: settings.complete
            }
        });
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
    shake: function(item, settings) {
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
            animatePaper.animate(item, animations);
        },
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
    fadeIn: function(item, settings) {
        var duration = 500;
        var complete = undefined;
        var easing = "swing";
        if(typeof settings !== "undefined") {
            if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
            if(typeof settings.complete === "function") complete = settings.complete;
            if(typeof settings.easing !== "undefined") easing = settings.easing;
        }
        animatePaper.animate(item,{
            properties: {
                opacity: 1
            },
            settings: {
                duration: duration,
                easing: easing,
                complete: complete
            }
        });
    },
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
    fadeOut: function(item, settings) {
        var duration = 500;
        var complete = undefined;
        var easing = "swing";
        if(typeof settings !== "undefined") {
            if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
            if(typeof settings.complete === "function") complete = settings.complete;
            if(typeof settings.easing !== "undefined") easing = settings.easing;
        }
        animatePaper.animate(item,{
            properties: {
                opacity: 0
            },
            settings: {
                duration: duration,
                easing: easing,
                complete: complete
            }
        });
    },
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
    slideUp: function(item, settings) {
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
        animatePaper.animate(item,{
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
    },
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
    slideDown: function(item, settings) {
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
        animatePaper.animate(item,{
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
    },
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
    splash: function(item, settings) {
        var duration = 500;
        var complete = undefined;
        var easing = "swing";
        if(typeof settings !== "undefined") {
            if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
            if(typeof settings.complete === "function") complete = settings.complete;
            if(typeof settings.easing !== "undefined") easing = settings.easing;
        }
        animatePaper.animate(item,{
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
    },
};