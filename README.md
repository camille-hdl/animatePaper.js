# animatePaper.js
An animation library for [paper.js](http://paperjs.org/).

See a live demo [on jsbin](http://jsbin.com/jusumo/2/edit?js,output).

## How to use :
### npm and browserify
`npm install --save paper-animate`


### bower
`bower install paper-animate --save`


### directly in the browser
(not recommended)  
Get the minified file in `dist/paper-animate-browser.min.js`, and include it in your page.


## Features :

 * Animation of multiple properties at the same time,
 * easing,
 * chaining

This is a work in progress, and any help or feedback is more than welcome.

So far, only `opacity`, `position`, `scale`, `rotate`, `translate`, `fillColor`, `strokeColor` and `segmentGrow` are supported, but I add a bit more whenever I have the time.


### Animate an Item

(you can animate a `Group` too, but it's up to what property will be changed: while you can animate a group's `position` or `scale`, you can't animate it's `fillColor`)

You can either use a predefined animation :
```js
var myCircle = new paper.Path.Circle(new paper.Point(50,50),35);
animatePaper.fx.shake(myCircle);
```
Predefined animations available by default : `shake`, `fadeIn`, `fadeOut`, `slideUp`, `slideDown`, `splash`. You can try them [on this demo](http://jsbin.com/gitaso/4/).

Or animate properties :
```js
var myCircle = new paper.Path.Circle(new paper.Point(50,50),35);
animatePaper.animate(myCircle, {
    properties: {
        translate: new paper.Point(100,50),
        scale: 3
    },
    settings: {
        duration: 4000,
        easing: "easeInElastic",
        complete: function() {
            console.log('complete !');
        }
    }
});
```

When animating `position` or color properties, you can provide either relative or absolute values :
```js
var square = new paper.Path.Rectangle(new paper.Point(75, 75), new paper.Size(50,50));
square.strokeColor = 'green';
square.animate({
  properties: {
    position: {
      x: "+200", // relative to the current position of the item. At the end, `x` will be : 275
      y: 150     // absolute position. At the end, `y` will be : 150
    },
    strokeColor: {
      hue: "+100",
      brightness: "-0.4"
    }
  },
  settings: {
    duration:1500,
    easing:"easeInBounce"
  }
});
```


The lib also extends `Item.prototype` with `.animate()` and `.stop()` methods, which means you can also use
```js
myCircle.animate({
    /*
        Animation parameters ...
    */
});
```

If you want to perform multiple animations successively, you can provide an array of parameters objects :
```js
var star = new paper.Path.Star(new paper.Point(45,50),5,25,45);
star.fillColor = "black";
star.opacity = 0;
star.animate([{
  properties: {
      translate: new paper.Point(200,50),
      rotate: -200,
      scale: 2,
      opacity:1
  },
  settings: {
      duration:3000,
      easing:"swing"
  }
},
{
  properties: {
      translate: new paper.Point(0,50),
      rotate: 200,
      scale: 1,
      opacity:0
  },
  settings: {
      duration:3000,
      easing:"swing"
  }
}]);
```
This is especially helpful when adding predefined animations to the library, it helps avoiding callback hell.


You can stop all running animations on an item by calling :
```js
animatePaper.stop(star);
// or
star.stop();
```

The `stop` method can take a `goToEnd` argument.
If true, all the animations will take their final value and `complete` callbacks will be called.


### Add custom easing functions

You can use `animatePaper.extendEasing(myEasingFunctions)` method to add your own easing functions or override any existing easing.

The method takes only one argument : an object in which keys are easing names, and values are easing functions:

```js
animatePaper.extendEasing({
    "triple": function(p) {
        return p*3;
    }
});
```

### Extend property hooks

If you want to add support for a new property or override the library's behavior for properties that are already supported,
you can use `animatePaper.extendPropHooks(myPropHooks);`.

`myPropHooks` should be an object in which keys are property names, and values are "hook objects".

Each "hook object" can have a `get`, `set` and `ease` method, and will be used to interface the animation with the property.

For example, say you want to add support for color animation:
```js
animatePaper.extendPropHooks({
  "fillColor": {
    get: function(tween) {
      // my code ...
    },
    ease: function(tween,easedPercent) {
      // my code ...
    }
  }
});
```
When these functions are used, they are passed only one argument : the Tween object (see the doc in doc/ for more details),
exept for the `ease()` function which gets the eased percent as second parameter.

 * The `get()` function must return the current value of the `Tween.item`'s property.
 * The `set()` function must set the value of the `Tween.item`'s property with `Tween.now` (which will most likely be the result of `get()` or `ease()`)
 * The `ease()` function must return the eased value. The second parameter is the eased percent.


### Add your own animations to the lib

To do so, simply add properties to `animatePaper.fx`, like so :
```js
animatePaper.fx.wave = function(item,settings) {
  var myAnimations = [...];
  item.animate(myAnimations);
};
animatePaper.fx.wave(myItem);
```

## Help needed !

I'm a beginner in paper.js, so if you spot a mistake or want to add something to the lib,
any help would be appreciated :-)

## Todo

 * Add hooks for more properties
 * Add funny things to `fx`

## Author
camille dot hodoul at gmail dot com

@Eartz_HC