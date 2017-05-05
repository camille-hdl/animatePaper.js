
QUnit.module( "Callbacks" );
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
QUnit.test( "settings.step", function( assert ) {
    resetCanvas();
    var scope = paper.setup('defCanvas');
    var square = new paper.Path.Rectangle(new paper.Point(150, 350), new paper.Size(50,50));
    square.strokeColor = "black";
    var expectedTime = 500;
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
            step: function() {
                setCallbackCalled(true);
            }
        }
    });
    setTimeout(function() {
        assert.ok(getCallbackCalled(), "step callback should have been called");
        done();
        square.remove();
    }, expectedTime + 20);
});