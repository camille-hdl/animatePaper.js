// Type definitions for animatePaper.js 1.2.1

/*~ If you want the name of this library to be a valid type name,
 *~ you can do so here.
 *~
 *~ For example, this allows us to write 'var x: myLib';
 *~ Be sure this actually makes sense! If it doesn't, just
 *~ delete this declaration and add types inside the namespace below.
 */

/*~ If your library has properties exposed on a global variable,
 *~ place them here.
 *~ You should also place types (interfaces and type alias) here.
 */
declare namespace animatePaper {
    function animate(item: paperItem, animation: animationSettings | Array<animationSettings>) : paperItem;
    function stop(item: paperItem, goToEnd?: boolean, forceEnd?: boolean) : paperItem;
    function extendEasing(easings: { [key: string]: (p: number) => number }) : void;
    const fx: {
        grow: (path: any, settings: any) => any;
        shake: (item: paperItem, settings: {
            nb?: number;
            movement?: number;
            complete?: Function;
        }) => void;
        fadeIn: (item: paperItem, settings: {
            duration?: number;
            easing?: string;
            complete?: Function;
        }) => void;
        fadeOut: (item: paperItem, settings: {
            duration?: number;
            easing?: string;
            complete?: Function;
        }) => void;
        slideUp: (item: paperItem, settings: {
            duration?: number;
            easing?: string;
            distance?: number;
            complete?: Function;
        }) => void;
        slideDown: (item: paperItem, settings: {
            duration?: number;
            distance?: number;
            easing?: string;
            complete?: Function;
        }) => void;
        splash: (item: paperItem, settings: {
            duration?: number;
            complete?: Function;
            easing?: string;
        }) => void;
    };
    interface animationSettings {
        parentItem?: paperItem;
        step?: Function;
        complete?: Function;
        delay?: number;
        duration?: number;
        repeat?: Function | number;
        easing?: string;
        center?: { x: number, y: number};
        rotateCenter?: { x: number, y: number };
        scaleCenter?: { x: number, y: number };
    }
    interface paperItem {
        
    }
}