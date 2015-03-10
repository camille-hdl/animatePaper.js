# animatePaper.js
An animation library for [paper.js](http://paperjs.org/).

Features include :

 * Animation of multiple properties at the same time,
 * easing,
 * chaining

This is a work in progress, and any help or feedback is more than welcome.

For now, only `scale`, `rotate` and `translate` are supported, but I add a bit more whenever I have the time.


## Usage
First, include [paper.js](http://paperjs.org/) in your page, then this library.

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

## Todo

 * Add hooks for skew, shear and style properties,
 * figure out a way to easily add custom easing algorithms,
 * add the `animate` method to the `Item.prototype` (maybe not very clean ?)

## Author
camille dot hodoul at gmail dot com

@Eartz_HC