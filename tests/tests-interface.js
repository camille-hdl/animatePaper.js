QUnit.module( "animatePaper API" );
QUnit.test( "animate", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 0;
    var hasRun = false;
    var returnValue = animatePaper.animate(square,{
        properties: {
            position: {
                x: -100,
                y: 100
            }
        },
        settings: {
            duration: expectedTime,
            easing: "linear",
            complete: function() {
                hasRun = true;
            }
        }
    });
    var done = assert.async();
    setTimeout(function() {
        assert.ok(hasRun, "animation has run");
        assert.ok(returnValue instanceof paper.Item, "animate returns the paper.Item object");
        done();
        square.remove();
    }, expectedTime + 100);
});
QUnit.test( "stop !goToEnd", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 300;
    var hasRun = false;
    animatePaper.animate(square,{
        properties: {
            position: {
                x: -100,
                y: 100
            }
        },
        settings: {
            duration: expectedTime,
            easing: "linear",
            complete: function() {
                hasRun = true;
            }
        }
    });
    setTimeout(function() {
        animatePaper.stop(square);
    }, 150);
    var done = assert.async();
    setTimeout(function() {
        assert.ok(!hasRun, "animation should not complete");
        assert.ok(square.position.y !== 100, "item should not have it's final values");
        done();
        square.remove();
    }, expectedTime);
});
QUnit.test( "stop goToEnd", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 300;
    var hasRun = false;
    animatePaper.animate(square,{
        properties: {
            position: {
                x: -100,
                y: 100
            }
        },
        settings: {
            duration: expectedTime,
            easing: "linear",
            complete: function() {
                hasRun = true;
            }
        }
    });
    setTimeout(function() {
        animatePaper.stop(square, true);
    }, 150);
    var done = assert.async();
    setTimeout(function() {
        assert.ok(hasRun, "complete callback should be called");
        assert.ok(square.position.y === 100, "item should have it's final values");
        done();
        square.remove();
    }, expectedTime);
});
QUnit.test( "paper.Item prototype extended", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    assert.ok(typeof square.animate === "function", "item.animate");
    assert.ok(typeof square.stop === "function", "item.stop");
    square.remove();
});
