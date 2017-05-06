import { AnimationSettings } from "./animation";
import * as effects from "./effects";
import * as _frameManager from "./frameManager";
export interface AnimationArguments {
    settings: AnimationSettings;
    properties: {};
}
export declare const animate: (item: any, animation: AnimationArguments | AnimationArguments[]) => any;
export declare const stop: (item: any, goToEnd?: boolean, forceEnd?: boolean) => any;
export declare const extendEasing: any;
export declare const frameManager: typeof _frameManager;
export declare const fx: typeof effects;
