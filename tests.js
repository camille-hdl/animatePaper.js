var scope = paper.setup('defCanvas');
QUnit.test( "Rotation", function( assert ) {
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