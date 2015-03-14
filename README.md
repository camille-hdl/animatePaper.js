# animatePaper.js
An animation library for [paper.js](http://paperjs.org/).

Features include :

 * Animation of multiple properties at the same time,
 * easing,
 * chaining

This is a work in progress, and any help or feedback is more than welcome.

So far, only `opacity`, `scale`, `rotate`, `translate` and `segmentGrow` are supported, but I add a bit more whenever I have the time.


## Usage
First, include [paper.js](http://paperjs.org/) in your page, then this library.

### Animate an Item

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

### Add custom easing functions

You can use `animatePaper.extendEasing(myEasingFunctions)` method to add your own easing functions or override any existing easing.

The method takes only one argument : an object in which keys are easing names, and values are easin functions :

````
animatePaper.extendEasing({
    "triple": function(p) {
        return p*3;
    }
});
````


## Todo

 * Add hooks for more properties
 * Add a way to stop all animations on an Item

## Author
camille dot hodoul at gmail dot com

@Eartz_HC