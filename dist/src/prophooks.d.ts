import { Tween } from "./tween";
export declare const _parseAbsoluteOrRelative: (value: string | number) => {
    value: number;
    direction: string;
};
export declare const __pointDiff: (a: {
    x: number;
    y: number;
    add: Function;
    subtract: Function;
}, b: {
    x: number;
    y: number;
}, operator: "+" | "-") => any;
export declare const _getColorType: (color_obj: any) => any;
export declare const _getColorComponentNames: (color_obj: any) => any;
export declare const _tweenPropHooks: {
    _default: {
        get: (tween: Tween) => any;
        set: (tween: Tween, percent: number) => void;
    };
    scale: {
        get: (tween: Tween) => any;
        set: (tween: Tween, percent: number) => void;
    };
    rotate: {
        get: (tween: Tween) => any;
        set: (tween: Tween) => void;
    };
    translate: {
        get: (tween: Tween) => any;
        set: (tween: Tween) => void;
        ease: (tween: Tween, eased: number) => any;
    };
    position: {
        get: (tween: Tween) => {
            x: any;
            y: any;
        };
        set: (tween: Tween, percent: number) => void;
        ease: (tween: Tween, eased: number) => any;
    };
    pointPosition: {
        get: (tween: Tween) => {
            x: any;
            y: any;
        };
        set: (tween: Tween, percent: number) => void;
        ease: (tween: Tween, eased: number) => any;
    };
    Color: {
        get: (tween: Tween) => {};
        set: (tween: Tween, percent: number) => void;
        ease: (tween: Tween, eased: number) => any;
    };
};
export declare const _pointDiff: (a: {
    x: number;
    y: number;
    add: Function;
    subtract: Function;
}, b: {
    x: number;
    y: number;
}, operator: "+" | "-") => any;
export declare const extendPropHooks: (customHooks: any) => void;
