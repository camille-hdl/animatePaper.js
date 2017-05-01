"use strict";
exports.__esModule = true;
var paper = require("./getPaper");
var tween_1 = require("./tween");
var frameManager = require("./frameManager");
var easing_1 = require("./easing");
var Animation = (function () {
    function Animation(item, properties, settings, _continue) {
        var _this = this;
        this.stopped = false;
        this.startTime = new Date().getTime();
        this.settings = _initializeSettings(settings);
        this.item = item;
        this.itemForAnimations = this.settings.parentItem || this.item;
        this.repeat = this.settings.repeat || 0;
        if (typeof this.settings.repeat === "function") {
            var _repeatCallback = this.settings.repeat;
            this.repeatCallback = function () {
                if (!!_repeatCallback(item, _this)) {
                    return new Animation(item, properties, settings, _continue);
                }
                return null;
            };
        }
        else {
            if (this.repeat === true || this.repeat > 0) {
                this.repeatCallback = function (newRepeat) {
                    settings.repeat = newRepeat;
                    return new Animation(item, properties, settings, _continue);
                };
            }
        }
        this.tweens = [];
        this.ticker = null;
        this._continue = _continue;
        if (typeof this.itemForAnimations.data === "undefined") {
            this.itemForAnimations.data = {};
        }
        if (typeof this.itemForAnimations.data._animatePaperAnims === "undefined") {
            this.itemForAnimations.data._animatePaperAnims = [];
        }
        this._dataIndex = this.itemForAnimations.data._animatePaperAnims.length;
        this.itemForAnimations.data._animatePaperAnims[this._dataIndex] = this;
        for (var i in properties) {
            if (properties.hasOwnProperty(i)) {
                this.tweens.push(new tween_1.Tween(i, properties[i], this));
            }
        }
        if (this.settings.mode === "onFrame") {
            this.ticker = frameManager.add(this.itemForAnimations, "_animate" + this.startTime + (Math.floor(Math.random() * (1000 - 1)) + 1), function () {
                _this.tick();
            });
        }
    }
    Animation.prototype.tick = function () {
        var self = this;
        if (!!self.stopped)
            return false;
        var currentTime = new Date().getTime();
        if (self.startTime + self.settings.delay > currentTime) {
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
        }
        else {
            self.item.project.view.draw();
        }
        if (self.settings.mode === "timeout") {
        }
        if (percent < 1 && l) {
            return remaining;
        }
        else {
            self.end();
            return false;
        }
    };
    Animation.prototype.stop = function (goToEnd, forceEnd) {
        if (goToEnd === void 0) { goToEnd = false; }
        if (forceEnd === void 0) { forceEnd = false; }
        var self = this;
        var i = 0;
        var l = goToEnd ? self.tweens.length : 0;
        if (!!self.stopped)
            return self;
        self.stopped = true;
        for (; i < l; i++) {
            self.tweens[i].run(1);
        }
        if (!!goToEnd) {
            if (!!self._continue)
                self._continue = null;
            self.end(forceEnd);
        }
    };
    Animation.prototype.end = function (forceEnd) {
        if (forceEnd === void 0) { forceEnd = false; }
        var self = this;
        if (self.settings.mode === "onFrame") {
            frameManager.remove(self.itemForAnimations, self.ticker);
        }
        if (typeof self.settings.complete !== "undefined") {
            self.settings.complete.call(self.item, this);
        }
        if (self.settings.mode === "timeout") {
        }
        if (typeof self._continue === "function") {
            self._continue.call(self.item);
        }
        self.itemForAnimations.data._animatePaperAnims[self._dataIndex] = null;
        if (!!forceEnd || typeof self.repeatCallback !== "function") {
            self = null;
        }
        else {
            var newRepeat = self.repeat;
            if (self.repeat !== true) {
                newRepeat = self.repeat - 1;
            }
            return self.repeatCallback(newRepeat);
        }
    };
    return Animation;
}());
exports.Animation = Animation;
;
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
    if (typeof settings.duration === "undefined") {
        settings.duration = defaults.duration;
    }
    else {
        settings.duration = Number(settings.duration);
        if (settings.duration < 0) {
            settings.duration = defaults.duration;
        }
    }
    if (typeof settings.delay === "undefined") {
        settings.delay = defaults.delay;
    }
    else {
        settings.delay = Number(settings.delay);
        if (settings.delay < 1) {
            settings.delay = defaults.delay;
        }
    }
    if (typeof settings.repeat === "undefined") {
        settings.repeat = defaults.repeat;
    }
    else if (typeof settings.repeat === "function") {
    }
    else {
        if (settings.repeat !== true) {
            settings.repeat = Number(settings.repeat);
            if (settings.repeat < 0) {
                settings.repeat = defaults.repeat;
            }
        }
    }
    if (typeof settings.easing === "undefined") {
        settings.easing = defaults.easing;
    }
    if (typeof easing_1.easing[settings.easing] !== "undefined" && easing_1.easing.hasOwnProperty(settings.easing)) {
        settings.easingFunction = easing_1.easing[settings.easing];
    }
    else {
        settings.easing = defaults.easing;
        settings.easingFunction = easing_1.easing[defaults.easing];
    }
    if (typeof settings.complete !== "function") {
        settings.complete = undefined;
    }
    if (typeof settings.step !== "function") {
        settings.step = undefined;
    }
    if (["onFrame", "timeout"].indexOf(settings.mode) === -1) {
        settings.mode = defaults.mode;
    }
    return settings;
}

//# sourceMappingURL=animation.js.map
