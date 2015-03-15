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
    }
};