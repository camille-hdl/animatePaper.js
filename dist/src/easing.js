var easing = {
    linear: function (p) {
        return p;
    },
    swing: function (p) {
        return 0.5 - Math.cos(p * Math.PI) / 2;
    },
    Sine: function (p) {
        return 1 - Math.cos(p * Math.PI / 2);
    },
    Circ: function (p) {
        return 1 - Math.sqrt(1 - p * p);
    },
    Elastic: function (p) {
        return p === 0 || p === 1 ? p :
            -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
    },
    Back: function (p) {
        return p * p * (3 * p - 2);
    },
    Bounce: function (p) {
        var pow2, bounce = 4;
        while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) { }
        return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
    }
};
var __tempEasing = ["Quad", "Cubic", "Quart", "Quint", "Expo"];
for (var i = 0, l = __tempEasing.length; i < l; i++) {
    easing[__tempEasing[i]] = function (p) {
        return Math.pow(p, i + 2);
    };
}
__tempEasing = null;
for (var name in easing) {
    if (easing.hasOwnProperty(name)) {
        var easeIn = easing[name];
        easing["easeIn" + name] = easeIn;
        easing["easeOut" + name] = function (p) {
            return 1 - easeIn(1 - p);
        };
        easing["easeInOut" + name] = function (p) {
            return p < 0.5 ?
                easeIn(p * 2) / 2 :
                1 - easeIn(p * -2 + 2) / 2;
        };
    }
}
module.exports = easing;
module.exports.extendEasing = function (customEasings) {
    for (var i in customEasings) {
        if (customEasings.hasOwnProperty(i)) {
            easing[i] = customEasings[i];
        }
    }
};

//# sourceMappingURL=easing.js.map
