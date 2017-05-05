QUnit.module( "Paper API" );
QUnit.test( "Rotation", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 2000;
    animatePaper.animate(square,{
        properties: {
            rotate: '+160'
        },
        settings: {
            duration: expectedTime,
            easing: "linear"
        }
    });
    var done = assert.async();
    setTimeout(function() {
        assert.equal(parseInt(square.segments[0].getCurve().bounds.x), 189, "rotation checking position of 1st segment x");
        assert.equal(parseInt(square.segments[0].getCurve().bounds.y), 342, "rotation checking position of 1st segment y");
        done();
        square.remove();
    }, expectedTime + 1);
});
QUnit.test( "Negative position", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 2000;
    animatePaper.animate(square,{
        properties: {
            position: {
                x: -100,
                y: 100
            }
        },
        settings: {
            duration: expectedTime,
            easing: "linear"
        }
    });
    var done = assert.async();
    setTimeout(function() {
        let newX = square.position.x;
        assert.equal(newX, -100, "new position.x should be -100");
        let newY = square.position.y;
        assert.equal(newY, 100, "new position.y should be 100");
        done();
        square.remove();
    }, expectedTime + 100);
});

QUnit.test( "Relative and absolute positions", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 200;
    animatePaper.animate(square,{
        properties: {
            position: {
                x: 100,
                y: "+50"
            }
        },
        settings: {
            duration: expectedTime,
            easing: "linear"
        }
    });
    var expected = {
        x: 100,
        y: square.position.y + 50
    };
    var done = assert.async();
    setTimeout(function() {
        let newX = square.position.x;
        assert.equal(newX, expected.x, "new position.x should be " + expected.x);
        let newY = square.position.y;
        assert.equal(newY, expected.y, "new position.y should be " + expected.y);
        done();
        square.remove();
    }, expectedTime + 100);
});
QUnit.test( "pointPosition absolute", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(10, 10), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 200;
    animatePaper.animate(square.segments[0].point,{
        properties: {
            pointPosition: {
                x: 100,
                y: 50
            }
        },
        settings: {
            duration: expectedTime,
            easing: "linear",
            parentItem: square
        }
    });
    var expected = {
        x: 100,
        y: 50
    };
    var done = assert.async();
    setTimeout(function() {
        assert.equal(square.segments[0].point.x, expected.x, "new position.x should be " + expected.x);
        assert.equal(square.segments[0].point.y, expected.y, "new position.y should be " + expected.y);
        done();
        square.remove();
    }, expectedTime + 100);
});
QUnit.test( "pointPosition relative", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(10, 60), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 200;
    animatePaper.animate(square.segments[0].point,{
        properties: {
            pointPosition: {
                x: "+100",
                y: "-50"
            }
        },
        settings: {
            duration: expectedTime,
            easing: "linear",
            parentItem: square
        }
    });
    var expected = {
        x: square.segments[0].point.x + 100,
        y: square.segments[0].point.y - 50
    };
    var done = assert.async();
    setTimeout(function() {
        assert.equal(square.segments[0].point.x, expected.x, "new position.x should be " + expected.x);
        assert.equal(square.segments[0].point.y, expected.y, "new position.y should be " + expected.y);
        done();
        square.remove();
    }, expectedTime + 100);
});
QUnit.test( "strokeColor : rgb absolute", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(10, 60), new paper.Size(50,50));
    square.strokeColor = new paper.Color(1, 0, 1);
    var expectedTime = 200;
    animatePaper.animate(square, {
        properties: {
            strokeColor: {
                red: 0.5,
                green: 0.4,
                blue: 0.1
            }
        },
        settings: {
            duration: expectedTime,
            easing: "linear",
        }
    });
    var expected = {
        red: 0.5,
        green: 0.4,
        blue: 0.1
    };
    var done = assert.async();
    setTimeout(function() {
        assert.equal(square.strokeColor.green, expected.green, "new color.g should be " + expected.green);
        assert.equal(square.strokeColor.red, expected.red, "new color.r should be " + expected.red);
        assert.equal(square.strokeColor.blue, expected.blue, "new color.y should be " + expected.blue);
        done();
        square.remove();
    }, expectedTime + 100);
});




