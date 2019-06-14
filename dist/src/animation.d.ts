/// <reference types="paper" />
import { Tween } from "./tween";
export interface AnimationSettings {
    parentItem?: paper.Item;
    step?: Function;
    complete?: () => any;
    mode: "onFrame" | "timeout";
    delay?: number;
    duration?: number;
    repeat?: Function;
    easing: string | Function;
    center?: {
        x: number;
        y: number;
    };
    rotateCenter?: {
        x: number;
        y: number;
    };
    scaleCenter?: {
        x: number;
        y: number;
    };
}
export declare class Animation {
    stopped: boolean;
    startTime: number;
    settings: AnimationSettings;
    item: paper.Item;
    itemForAnimations: paper.Item;
    repeat?: Function | 0;
    repeatCallback?: Function;
    ticker: any;
    _continue?: () => any;
    tweens: Array<Tween>;
    _dataIndex: number;
    constructor(item: paper.Item, properties: {}, settings: AnimationSettings, _continue: () => any);
    tick(): number | false;
    stop(goToEnd?: boolean, forceEnd?: boolean): this;
    end(forceEnd?: boolean): any;
}
