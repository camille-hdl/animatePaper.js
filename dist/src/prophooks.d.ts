declare var dirRegexp: RegExp;
declare function _pointDiff(a: any, b: any, operator: any): any;
declare function _getColorType(color_obj: any): any;
declare function _getColorComponentNames(color_obj: any): any;
declare var _tweenPropHooks: {
    _default: {
        get: (tween: any) => any;
        set: (tween: any) => void;
    };
    scale: {
        get: (tween: any) => any;
        set: (tween: any) => void;
    };
    rotate: {
        get: (tween: any) => any;
        set: (tween: any) => void;
    };
    translate: {
        get: (tween: any) => any;
        set: (tween: any) => void;
        ease: (tween: any, eased: any) => any;
    };
    position: {
        get: (tween: any) => {
            x: any;
            y: any;
        };
        set: (tween: any) => void;
        ease: (tween: any, eased: any) => any;
    };
    pointPosition: {
        get: (tween: any) => {
            x: any;
            y: any;
        };
        set: (tween: any) => void;
        ease: (tween: any, eased: any) => any;
    };
    Color: {
        get: (tween: any) => {};
        set: (tween: any) => void;
        ease: (tween: any, eased: any) => any;
    };
};
declare var _colorProperties: string[];
