
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
QUnit.test( "settings.complete", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 2000;
    var done = assert.async();
    var callbackCalled = false;
    var setCallbackCalled = function(val) {
        callbackCalled = val;
    }
    var getCallbackCalled = function() {
        return callbackCalled;
    }
    animatePaper.animate(square,{
        properties: {
            rotate: '+160'
        },
        settings: {
            duration: expectedTime,
            easing: "linear",
            complete: function() {
                setCallbackCalled(true);
            }
        }
    });
    assert.ok(!getCallbackCalled(), "complete callback shouldn't be called right away");
    setTimeout(function() {
        assert.ok(getCallbackCalled(), "complete callback should be called at the end");
        done();
        square.remove();
    }, expectedTime + 20);
});
QUnit.test( "settings.repeat", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 500;
    var done = assert.async();
    var c = 0;
    animatePaper.animate(square,{
        properties: {
            rotate: '+160'
        },
        settings: {
            duration: expectedTime,
            repeat: 2,
            easing: "linear",
            complete: function() {
                c++;
            }
        }
    });
    setTimeout(function() {
        assert.equal(c, 3, "animation should have run 3 times total");
        done();
        square.remove();
    }, (expectedTime * 4) + 20);
});
QUnit.test( "settings.delay", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 1;
    var done = assert.async();
    var done2 = assert.async();
    var animRun = false;
    animatePaper.animate(square,{
        properties: {
            rotate: '+160'
        },
        settings: {
            duration: expectedTime,
            delay: 200,
            easing: "linear",
            complete: function() {
                animRun = true;
            }
        }
    });
    setTimeout(function() {
        assert.ok(!animRun, "animation shouldn't have run yet");
        done();
    }, 100);
    setTimeout(function() {
        assert.ok(animRun, "animation should have run by now");
        done2();
        square.remove();
    }, 250);
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
                x: -100
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
        assert.ok(newX > -101, "new position.x should be around -100");
        assert.ok(newX < -99, "new position.x should be around -100");
        done();
        square.remove();
    }, expectedTime + 10);
});
QUnit.test( "0 duration", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 0;
    var completed = false;
    animatePaper.animate(square,{
        properties: {
            position: {
                x: 100
            }
        },
        settings: {
            duration: expectedTime,
            easing: "linear",
            complete: function() {
                completed = true;
            }
        }
    });
    var done = assert.async();
    setTimeout(function() {
        var isCompleted = completed;
        assert.ok(isCompleted, "Sould be already finished");
        let newX = square.position.x;
        assert.equal(newX, 100, "new position.x should be 100");
        done();
        square.remove();
    }, expectedTime + 1);
});
QUnit.test( "custom easing (callback)", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    var myBezier = _bezier(0, 0, 1, 0.5);
    var myEasingUsed = 0;
    var myEasing = function(p) {
        myEasingUsed++;
        return myBezier(p);
    }
    square.strokeColor = "black";
    var expectedTime = 300;
    var completed = false;
    animatePaper.animate(square,{
        properties: {
            position: {
                x: 100
            }
        },
        settings: {
            duration: expectedTime,
            easing: myEasing,
            complete: function() {
                completed = true;
            }
        }
    });
    var done = assert.async();
    setTimeout(function() {
        var easingUsed = myEasingUsed;
        assert.ok(myEasingUsed > 0, "Custom easing should be used. Used : " + myEasingUsed + " times");
        done();
        square.remove();
    }, expectedTime + 1);
});


function resetCanvas() {
    $('#defCanvas').remove();
    var $c = $('<canvas width="1000px" height="700px" style="visibility:hidden;" id="defCanvas"></canvas>');
    $('body').append($c);
}