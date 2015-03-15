/* animatePaper.js - an animation library for paper.js. https://github.com/Eartz/animatePaper.js */
(function(exports, global) {
    global["animatePaper"] = exports;
    var paper = global.paper;
    function Animation(item, properties, settings, _continue) {
        var self = this;
        self.stopped = false;
        self.startTime = new Date().getTime();
        self.settings = _initializeSettings(settings);
        self.item = item;
        self.tweens = [];
        self.ticker = null;
        self._continue = _continue;
        if (typeof item.data._animatePaperAnims === "undefined") {
            self.item.data._animatePaperAnims = [];
        }
        self._dataIndex = self.item.data._animatePaperAnims.length;
        self.item.data._animatePaperAnims[self._dataIndex] = self;
        for (var i in properties) {
            if (properties.hasOwnProperty(i)) {
                self.tweens.push(new Tween(i, properties[i], self));
            }
        }
        if (self.settings.mode === "onFrame") {
            self.ticker = animatePaper.frameManager.add(self.item, "_animate" + self.startTime, function() {
                self.tick();
            });
        }
    }
    Animation.prototype.tick = function() {
        var self = this;
        if (!!self.stopped) return false;
        var currentTime = new Date().getTime();
        var remaining = Math.max(0, self.startTime + self.settings.duration - currentTime);
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
        self.item.project.view.draw();
        if (self.settings.mode === "timeout") {}
        if (percent < 1 && l) {
            return remaining;
        } else {
            self.end();
            return false;
        }
    };
    Animation.prototype.stop = function(goToEnd) {
        var self = this;
        var i = 0;
        var l = goToEnd ? self.tweens.length : 0;
        if (!!self.stopped) return self;
        self.stopped = true;
        for (;i < l; i++) {
            self.tweens[i].run(1);
        }
        if (!!goToEnd) {
            if (!!self._continue) self._continue = null;
            self.end();
        }
    };
    Animation.prototype.end = function() {
        var self = this;
        if (self.settings.mode === "onFrame") {
            animatePaper.frameManager.remove(self.item, self.ticker);
        }
        if (typeof self.settings.complete !== "undefined") {
            self.settings.complete.call(self.item);
        }
        if (self.settings.mode === "timeout") {}
        if (typeof self._continue === "function") {
            self._continue.call(self.item);
        }
        self.item.data._animatePaperAnims[self._dataIndex] = null;
        self = null;
    };
    function _initializeSettings(settings) {
        var defaults = {
            duration: 400,
            easing: "linear",
            complete: undefined,
            step: undefined,
            mode: "onFrame"
        };
        if (typeof settings === "undefined") {
            settings = {};
        }
        if (typeof settings.duration === "undefined") {
            settings.duration = defaults.duration;
        } else {
            settings.duration = Number(settings.duration);
            if (settings.duration < 1) {
                settings.duration = defaults.duration;
            }
        }
        if (typeof settings.easing === "undefined") {
            settings.easing = defaults.easing;
        }
        if (typeof easing[settings.easing] !== "undefined" && easing.hasOwnProperty(settings.easing)) {
            settings.easingFunction = easing[settings.easing];
        } else {
            settings.easing = defaults.easing;
            settings.easingFunction = easing[defaults.easing];
        }
        if (typeof settings.complete !== "function") {
            settings.complete = undefined;
        }
        if (typeof settings.step !== "function") {
            settings.step = undefined;
        }
        if ([ "onFrame", "timeout" ].indexOf(settings.mode) === -1) {
            settings.mode = defaults.mode;
        }
        return settings;
    }
    function Tween(property, value, animation) {
        var self = this;
        self.A = animation;
        self.item = animation.item;
        self.prop = property;
        self.end = value;
        self.start = self.cur();
        self.now = self.cur();
        self.direction = self.end > self.start ? "+" : "-";
    }
    Tween.prototype.cur = function() {
        var self = this;
        var hooks = _tweenPropHooks[self.prop];
        return hooks && hooks.get ? hooks.get(self) : _tweenPropHooks._default.get(self);
    };
    Tween.prototype.run = function(percent) {
        var self = this;
        var eased;
        var hooks = _tweenPropHooks[self.prop];
        var settings = self.A.settings;
        if (settings.duration) {
            self.pos = eased = easing[settings.easing](percent, settings.duration * percent, 0, 1, self.duration);
        } else {
            self.pos = eased = percent;
        }
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
    };
    function frameManagerHandler(ev) {
        var item = this;
        if (typeof item.data._customHandlers !== "undefined" && item.data._customHandlersCount > 0) {
            for (var i in item.data._customHandlers) {
                if (item.data._customHandlers.hasOwnProperty(i)) {
                    if (typeof item.data._customHandlers[i] === "function") {
                        item.data._customHandlers[i].call(item, ev);
                    }
                }
            }
        }
    }
    animatePaper.frameManager = {
        add: function(item, name, callback) {
            if (typeof item.data._customHandlers === "undefined") {
                item.data._customHandlers = {};
                item.data._customHandlersCount = 0;
            }
            item.data._customHandlers[name] = callback;
            item.data._customHandlersCount += 1;
            if (item.data._customHandlersCount > 0) {
                item.onFrame = frameManagerHandler;
            }
            return name;
        },
        remove: function(item, name) {
            if (typeof item.data._customHandlers !== "undefined") {
                item.data._customHandlers[name] = null;
                item.data._customHandlersCount -= 1;
                if (item.data._customHandlersCount <= 0) {
                    item.data._customHandlersCount = 0;
                }
            }
        }
    };
    var easing = {
        linear: function(p) {
            return p;
        },
        swing: function(p) {
            return .5 - Math.cos(p * Math.PI) / 2;
        },
        Sine: function(p) {
            return 1 - Math.cos(p * Math.PI / 2);
        },
        Circ: function(p) {
            return 1 - Math.sqrt(1 - p * p);
        },
        Elastic: function(p) {
            return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
        },
        Back: function(p) {
            return p * p * (3 * p - 2);
        },
        Bounce: function(p) {
            var pow2, bounce = 4;
            while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
            return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
        }
    };
    var __tempEasing = [ "Quad", "Cubic", "Quart", "Quint", "Expo" ];
    for (var i = 0, l = __tempEasing.length; i < l; i++) {
        easing[__tempEasing[i]] = function(p) {
            return Math.pow(p, i + 2);
        };
    }
    __tempEasing = null;
    for (var name in easing) {
        if (easing.hasOwnProperty(name)) {
            var easeIn = easing[name];
            easing["easeIn" + name] = easeIn;
            easing["easeOut" + name] = function(p) {
                return 1 - easeIn(1 - p);
            };
            easing["easeInOut" + name] = function(p) {
                return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn(p * -2 + 2) / 2;
            };
        }
    }
    function _pointDiff(a, b, operator) {
        if ([ "+", "-" ].indexOf(operator) === -1) return;
        if (typeof a === "undefined" || typeof b === "undefined") return;
        var ax, bx, ay, by;
        ax = a.x || 0;
        bx = b.x || 0;
        ay = a.y || 0;
        by = b.y || 0;
        var output = new paper.Point(eval(ax + operator + bx), eval(ay + operator + by));
        return output;
    }
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
        }
    };
    animatePaper.fx = {
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
    exports.animate = function(item, animation) {
        var animations = [];
        var output;
        if (animation instanceof Array) {
            animations = animation;
        } else {
            animations.push(animation);
        }
        var index = 0;
        new Animation(item, animations[index].properties, animations[index].settings, function _continue() {
            index++;
            if (typeof animations[index] !== "undefined") {
                new Animation(item, animations[index].properties, animations[index].settings, _continue);
            }
        });
        return item;
    };
    exports.stop = function(item, goToEnd) {
        if (!!item.data._animatePaperAnims) {
            for (var i = 0, l = item.data._animatePaperAnims.length; i < l; i++) {
                if (!!item.data._animatePaperAnims[i]) {
                    item.data._animatePaperAnims[i].stop(goToEnd);
                }
            }
        }
        return item;
    };
    exports.extendEasing = function(customEasings) {
        for (var i in customEasings) {
            if (customEasings.hasOwnProperty(i)) {
                easing[i] = customEasings[i];
            }
        }
    };
    exports.extendPropHooks = function(customHooks) {
        for (var i in customHooks) {
            if (customHooks.hasOwnProperty(i)) {
                _tweenPropHooks[i] = customHooks[i];
            }
        }
    };
    if (!paper.Item.prototype.animate) {
        paper.Item.prototype.animate = function(animation) {
            return animatePaper.animate(this, animation);
        };
    }
    if (!paper.Item.prototype.stop) {
        paper.Item.prototype.stop = function(goToEnd) {
            return animatePaper.stop(this, goToEnd);
        };
    }
})({}, function() {
    return this;
}());
//# sourceMappingURL=/Users/camille/github/animatePaper.js/build/../dist/animatePaper.map