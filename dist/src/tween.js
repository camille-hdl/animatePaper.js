var _tweenPropHooks = require("./prophooks")._tweenPropHooks;
var easing = require("./easing");
function Tween(property, value, animation) {
    var self = this;
    self.A = animation;
    self.item = animation.item;
    self.prop = property;
    self.end = value;
    self.start = self.cur();
    if (typeof self.end === "string" && self.end.charAt(0) === "+") {
        self.end = self.start + parseFloat(self.end);
    }
    else if (typeof self.end === "string" && self.end.charAt(0) === "-") {
        self.end = self.start + parseFloat(self.end);
    }
    self.now = self.cur();
    self.direction = self.end > self.start ? "+" : "-";
}
Tween.prototype.cur = function () {
    var self = this;
    var hooks = _tweenPropHooks[self.prop];
    return hooks && hooks.get ? hooks.get(self) : _tweenPropHooks._default.get(self);
};
Tween.prototype.run = function (percent) {
    var self = this;
    var eased;
    var hooks = _tweenPropHooks[self.prop];
    var settings = self.A.settings;
    if (settings.duration) {
        self.pos = eased = easing[settings.easing](percent, settings.duration * percent, 0, 1, self.duration);
    }
    else {
        self.pos = eased = percent;
    }
    if (hooks && hooks.ease) {
        hooks.ease(self, eased);
    }
    else {
        self.now = (self.end - self.start) * eased + self.start;
    }
    if (hooks && hooks.set) {
        hooks.set(self);
    }
    else {
        _tweenPropHooks._default.set(self);
    }
    return self;
};
module.exports = Tween;

//# sourceMappingURL=tween.js.map
