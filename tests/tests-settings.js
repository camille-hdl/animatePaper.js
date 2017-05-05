
QUnit.module( "Settings" );
QUnit.test( "settings.repeat: integer", function( assert ) {
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
QUnit.test( "settings.repeat: function", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 200;
    var done = assert.async();
    var c = 0;
    animatePaper.animate(square,{
        properties: {
            rotate: '+160'
        },
        settings: {
            duration: expectedTime,
            repeat: function() {
                c++;
                return c < 2;
            },
            easing: "linear"
        }
    });
    setTimeout(function() {
        assert.equal(c, 2, "animation should have run 2 times total");
        done();
        square.remove();
    }, (expectedTime * 3) + 20);
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
                x: 100,
                y: "+50"
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
    var expected = {
        x: 100,
        y: square.position.y + 50
    }
    var done = assert.async();
    setTimeout(function() {
        var isCompleted = completed;
        assert.ok(isCompleted, "Sould be already finished");
        done();
        square.remove();
    }, expectedTime + 100);
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
    }, expectedTime + 100);
});
