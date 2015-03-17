/**
 * Effects : A collection of shorthands for animations.
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
     * @method grow
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
        }
};