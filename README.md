# animatePaper.js
An animation library for [paper.js](http://paperjs.org/).

See a live demo [on jsbin](http://jsbin.com/jusumo/1/edit?html,js,output).

The minified version is in `dist/animatePaper.min.js`.

Features include :

 * Animation of multiple properties at the same time,
 * easing,
 * chaining

This is a work in progress, and any help or feedback is more than welcome.

So far, only `opacity`, `position`, `scale`, `rotate`, `translate`, `fillColor`, `strokeColor` and `segmentGrow` are supported, but I add a bit more whenever I have the time.


## Usage
First, include [paper.js](http://paperjs.org/) in your page, then this library.

### Animate an Item

You can either use a predefined animation :
````
var myCircle = new paper.Path.Circle(new paper.Point(50,50),35);
animatePaper.fx.shake(myCircle);
````

Or animate properties :
````
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
````

The lib also extends `Item.prototype` with an `.animate()` method, which means you can also use
````
myCircle.animate({
    /*
        Animation parameters ...
    */
});
````

If you want to perform multiple animations successively, you can provide an array of parameters objects :
````
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
````

You can stop all running animations on an item by calling :
````
animatePaper.stop(star);
// or
star.stop();
````

The `stop` method can take a `goToEnd` argument.
If true, all the animations will take their final value and `complete` callbacks will be called.


### Add custom easing functions

You can use `animatePaper.extendEasing(myEasingFunctions)` method to add your own easing functions or override any existing easing.

The method takes only one argument : an object in which keys are easing names, and values are easing functions:

````
animatePaper.extendEasing({
    "triple": function(p) {
        return p*3;
    }
});
````

### Extend property hooks

If you want to add support for a new property or override the library's behavior for properties that are already supported,
you can use `animatePaper.extendPropHooks(myPropHooks);`.

`myPropHooks` should be an object in which keys are property names, and values are "hook objects".

Each "hook object" can have a `get`, `set` and `ease` method, and will be used to interface the animation with the property.

For example, say you want to add support for color animation:
````
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
````
When these functions are used, they are passed only one argument : the Tween object (see the doc in doc/ for more details),
exept for the `ease()` function which gets the eased percent as second parameter.

 * The `get()` function must return the current value of the `Tween.item`'s property.
 * The `set()` function must set the value of the `Tween.item`'s property with `Tween.now` (which will most likely be the result of `get()` or `ease()`)
 * The `ease()` function must return the eased value. The second parameter is the eased percent.


### Add your own animations to the lib

To do so, simply add properties to `animatePaper.fx`, like so :
````
animatePaper.fx.wave = function(item,settings) {
  var myAnimations = [...];
  item.animate(myAnimations);
};
animatePaper.fx.wave(myItem);
````

## Help needed !

I'm a beginner in paper.js, so if you spot a mistake or want to add something to the lib,
any help would be appreciated :-)

## Todo

 * Add hooks for more properties
 * Add funny things to `fx`

## Author
camille dot hodoul at gmail dot com

@Eartz_HC