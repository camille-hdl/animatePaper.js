"use strict";
var paper = require("./getPaper");
var Tween = require("./tween");
var frameManager = require("./frameManager");
var easing = require("./easing");
function Animation(item, properties, settings, _continue) {
    var self = this;
    self.stopped = false;
    self.startTime = new Date().getTime();
    self.settings = _initializeSettings(settings);
    self.item = item;
    self.itemForAnimations = self.settings.parentItem || self.item;
    self.repeat = self.settings.repeat || 0;
    if (typeof self.settings.repeat === "function") {
        var _repeatCallback = self.settings.repeat;
        self.repeatCallback = function () {
            if (!!_repeatCallback(item, self)) {
                return new Animation(item, properties, settings, _continue);
            }
            return null;
        };
    }
    else {
        if (self.repeat === true || self.repeat > 0) {
            self.repeatCallback = function (newRepeat) {
                settings.repeat = newRepeat;
                return new Animation(item, properties, settings, _continue);
            };
        }
    }
    self.tweens = [];
    self.ticker = null;
    self._continue = _continue;
    if (typeof self.itemForAnimations.data === "undefined") {
        self.itemForAnimations.data = {};
    }
    if (typeof self.itemForAnimations.data._animatePaperAnims === "undefined") {
        self.itemForAnimations.data._animatePaperAnims = [];
    }
    self._dataIndex = self.itemForAnimations.data._animatePaperAnims.length;
    self.itemForAnimations.data._animatePaperAnims[self._dataIndex] = self;
    for (var i in properties) {
        if (properties.hasOwnProperty(i)) {
            self.tweens.push(new Tween(i, properties[i], self));
        }
    }
    if (self.settings.mode === "onFrame") {
        self.ticker = frameManager.add(self.itemForAnimations, "_animate" + self.startTime + (Math.floor(Math.random() * (1000 - 1)) + 1), function () {
            self.tick();
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
        if (settings.duration < 1) {
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
    if (typeof easing[settings.easing] !== "undefined" && easing.hasOwnProperty(settings.easing)) {
        settings.easingFunction = easing[settings.easing];
    }
    else {
        settings.easing = defaults.easing;
        settings.easingFunction = easing[defaults.easing];
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
module.exports = Animation;

//# sourceMappingURL=animation.js.map
