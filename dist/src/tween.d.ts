/// <reference types="paper" />
import { Animation } from "./animation";
export declare class Tween {
    A: Animation;
    item: paper.Item;
    prop: string;
    end: any;
    start: any;
    now: any;
    direction: "+" | "-";
    duration: number;
    pos: number;
    _easePositionCache: any;
    _easeColorCache: any;
    constructor(property: string, value: any, animation: Animation);
    cur(): any;
    run(percent: number): this;
}
