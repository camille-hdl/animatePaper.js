import {
    _parseAbsoluteOrRelative,
    __pointDiff, _getColorType,
    _getColorComponentNames,
    _tweenPropHooks
} from "../../src/prophooks";

test("_parseAbsoluteOrRelative", () => {
    const input = "+40";
    expect(_parseAbsoluteOrRelative(input)).toEqual({
        value: 40,
        direction: "+"
    });
    const input2 = -50;
    expect(_parseAbsoluteOrRelative(input2)).toEqual({
        value: -50,
        direction: ""
    });
    const input3 = "-50";
    expect(_parseAbsoluteOrRelative(input3)).toEqual({
        value: 50,
        direction: "-"
    });
});

test("__pointDiff", () => {
    const addMock = jest.fn();
    const subMock = jest.fn();
    const operand1 = {
        x: 40,
        y: 20,
        add: addMock,
        subtract: subMock
    };
    const operand2 = {
        x: 10,
        y: -10
    };
    __pointDiff(operand1, operand2, "+");
    expect(addMock).toBeCalled();
    __pointDiff(operand1, operand2, "-");
    expect(subMock).toBeCalled();
});

test("_getColorType", () => {
    const input1 = {
        type: "rgb"
    };
    expect(_getColorType(input1)).toBe("rgb");
    const input2 = {
        red: 1
    };
    expect(_getColorType(input2)).toBe("rgb");
    const input3 = {
        brightness: 0.4
    };
    expect(_getColorType(input3)).toBe("hsb");
    const input4 = {
        lightness: 0.4
    };
    expect(_getColorType(input4)).toBe("hsl");
    const input5 = {
        gray: 0.4
    };
    expect(_getColorType(input5)).toBe("gray");
});

test("_getColorComponentNames", () => {
    const input1 = {
        _properties: [ "test1", "test2", "test3" ]
    };
    expect(_getColorComponentNames(input1)).toEqual([ "test1", "test2", "test3" ]);
    const input2 = {
        type: "rgb"
    };
    expect(_getColorComponentNames(input2)).toEqual([ "red", "green", "blue" ]);
    const input3 = {
        type: "hsb"
    };
    expect(_getColorComponentNames(input3)).toEqual([ "hue", "brightness", "saturation" ]);
    const input4 = {
        type: "hsl"
    };
    expect(_getColorComponentNames(input4)).toEqual([ "hue", "saturation", "lightness" ]);
});

test("_tweenPropHooks._default", () => {
    const mockSet = jest.fn((val) => val);
    let inputTween = {
        prop: "myProp",
        end: 15,
        now: 14,
        item: {
            myProp: 13,
            set: mockSet
        }
    };
    expect(_tweenPropHooks._default.get(inputTween)).toBe(13);
    _tweenPropHooks._default.set(inputTween, 0.5);
    expect(mockSet).toBeCalledWith({ myProp: inputTween.now });
    _tweenPropHooks._default.set(inputTween, 1);
    expect(mockSet).toBeCalledWith({ myProp: inputTween.end });
});

test("_tweenPropHooks.scale", () => {
    const mockSet = jest.fn((val) => val);
    let inputTween = {
        prop: "scale",
        A: {
            settings: {}
        },
        end: 2,
        now: 1.5,
        item: {
            data: {},
            scale: mockSet
        }
    };
    expect(_tweenPropHooks.scale.get(inputTween)).toBe(1);
    _tweenPropHooks.scale.set(inputTween, 0.5);
    expect(mockSet).toBeCalledWith(1.5);
    inputTween.A.settings.center = "testCenter";
    _tweenPropHooks.scale.set(inputTween, 0.5);
    expect(mockSet).toBeCalledWith(1, "testCenter");
    // todo ensure final value accuracy with .scale()
    // inputTween.now = inputTween.end;
    // _tweenPropHooks.scale.set(inputTween, 1);
    // expect(mockSet).toBeCalledWith(2);
});

test("_tweenPropHooks.rotate", () => {
    const mockSet = jest.fn((val) => val);
    let inputTween = {
        prop: "scale",
        A: {
            settings: {}
        },
        end: 90,
        now: 30,
        item: {
            data: {},
            rotate: mockSet
        }
    };
    expect(_tweenPropHooks.rotate.get(inputTween)).toBe(-0);
    _tweenPropHooks.rotate.set(inputTween, 0.5);
    expect(mockSet).toBeCalledWith(30);
    inputTween.now = 90;
    inputTween.A.settings.center = "testCenter";
    _tweenPropHooks.rotate.set(inputTween, 1);
    expect(mockSet).toBeCalledWith(60, "testCenter");
});


test("_tweenPropHooks.position (absolute)", () => {
    // absolute values
    let inputTween = {
        prop: "position",
        end: {
            x: 90,
            y: 80
        },
        now: {
            x: 50,
            y: 30
        },
        start: {
            x: 10,
            y: 10
        },
        item: {
            data: {},
            position: {
                x: 10,
                y: 10
            }
        }
    };
    expect(_tweenPropHooks.position.get(inputTween)).toEqual({ x: 10, y: 10});
    _tweenPropHooks.position.set(inputTween, 0.5);
    expect(inputTween.item.position).toEqual({ x: 60, y: 40 });
    _tweenPropHooks.position.set(inputTween, 1);
    expect(inputTween.item.position).toEqual({ x: 90, y: 80 });

    
});
test("_tweenPropHooks.position (relative)", () => {
    // relative values
    let inputTween2 = {
        prop: "position",
        start: {
            x: 10,
            y: 10
        },
        end: {
            x: "+50",
            y: "-4"
        },
        now: {
            x: 25,
            y: -2
        },
        item: {
            data: {},
            position: {
                x: 10,
                y: 10
            }
        }
    };
    expect(_tweenPropHooks.position.get(inputTween2)).toEqual({ x: 10, y: 10});
    _tweenPropHooks.position.set(inputTween2, 0.5);
    expect(inputTween2.item.position).toEqual({ x: 35, y: 8 });
    _tweenPropHooks.position.set(inputTween2, 1);
    expect(inputTween2.item.position).toEqual({ x: 60, y: 6 });
})
test("_tweenPropHooks.position.ease (absolute)", () => {
    // absolute values
    let inputTween = {
        prop: "position",
        end: {
            x: 90,
            y: 110
        },
        now: {
            
        },
        start: {
            x: 10,
            y: 10
        },
        item: {
            data: {},
            position: {
                x: 10,
                y: 10
            }
        }
    };
    _tweenPropHooks.position.ease(inputTween, 0.25);
    expect(inputTween.now).toEqual({ x: 20 , y: 25});
    _tweenPropHooks.position.ease(inputTween, 0.5);
    expect(inputTween.now).toEqual({ x: 20 , y: 25});
    _tweenPropHooks.position.ease(inputTween, 1);
    expect(inputTween.now).toEqual({ x: 40 , y: 50});
});
test("_tweenPropHooks.position.ease (relative)", () => {
    // absolute values
    let inputTween = {
        prop: "position",
        end: {
            x: "-100",
            y: "+100"
        },
        now: {
            
        },
        start: {
            x: 0,
            y: 0
        },
        item: {
            data: {},
            position: {
                x: 0,
                y: 0
            }
        }
    };
    _tweenPropHooks.position.ease(inputTween, 0.25);
    expect(inputTween.now).toEqual({ x: -25 , y: 25});
    _tweenPropHooks.position.ease(inputTween, 0.5);
    expect(inputTween.now).toEqual({ x: -25 , y: 25});
    _tweenPropHooks.position.ease(inputTween, 1);
    expect(inputTween.now).toEqual({ x: -50 , y: 50});
});

test("_tweenPropHooks.pointPosition (absolute)", () => {
    // absolute values
    let inputTween = {
        prop: "position",
        end: {
            x: 90,
            y: 80
        },
        now: {
            x: 50,
            y: 30
        },
        start: {
            x: 10,
            y: 10
        },
        item: {
            x: 10,
            y: 10
        }
    };
    expect(_tweenPropHooks.pointPosition.get(inputTween)).toEqual({ x: 10, y: 10});
    _tweenPropHooks.pointPosition.set(inputTween, 0.5);
    expect(inputTween.item).toEqual({ x: 60, y: 40 });
    _tweenPropHooks.pointPosition.set(inputTween, 1);
    expect(inputTween.item).toEqual({ x: 90, y: 80 });

    
});
test("_tweenPropHooks.pointPosition (relative)", () => {
    // relative values
    let inputTween2 = {
        prop: "position",
        start: {
            x: 10,
            y: 10
        },
        end: {
            x: "+50",
            y: "-4"
        },
        now: {
            x: 25,
            y: -2
        },
        item: {
            x: 10,
            y: 10
        }
    };
    expect(_tweenPropHooks.pointPosition.get(inputTween2)).toEqual({ x: 10, y: 10});
    _tweenPropHooks.pointPosition.set(inputTween2, 0.5);
    expect(inputTween2.item).toEqual({ x: 35, y: 8 });
    _tweenPropHooks.pointPosition.set(inputTween2, 1);
    expect(inputTween2.item).toEqual({ x: 60, y: 6 });
})
test("_tweenPropHooks.pointPosition.ease (absolute)", () => {
    // absolute values
    let inputTween = {
        prop: "position",
        end: {
            x: 90,
            y: 110
        },
        now: {
            
        },
        start: {
            x: 10,
            y: 10
        },
        item: {
            x: 10,
            y: 10
        }
    };
    _tweenPropHooks.pointPosition.ease(inputTween, 0.25);
    expect(inputTween.now).toEqual({ x: 20 , y: 25});
    _tweenPropHooks.pointPosition.ease(inputTween, 0.5);
    expect(inputTween.now).toEqual({ x: 20 , y: 25});
    _tweenPropHooks.pointPosition.ease(inputTween, 1);
    expect(inputTween.now).toEqual({ x: 40 , y: 50});
});
test("_tweenPropHooks.pointPosition.ease (relative)", () => {
    // absolute values
    let inputTween = {
        prop: "position",
        end: {
            x: "-100",
            y: "+100"
        },
        now: {
            
        },
        start: {
            x: 0,
            y: 0
        },
        item: {
            x: 0,
            y: 0
        }
    };
    _tweenPropHooks.pointPosition.ease(inputTween, 0.25);
    expect(inputTween.now).toEqual({ x: -25 , y: 25});
    _tweenPropHooks.pointPosition.ease(inputTween, 0.5);
    expect(inputTween.now).toEqual({ x: -25 , y: 25});
    _tweenPropHooks.pointPosition.ease(inputTween, 1);
    expect(inputTween.now).toEqual({ x: -50 , y: 50});
});

test("_tweenPropHooks.Color (absolute)", () => {
    // absolute values
    let inputTween = {
        _easeColorCache: {},
        prop: "fillColor",
        end: {
            red: 90
        },
        now: {
            blue: 0,
            green: 0,
            red: 50,
        },
        start: {
            blue: 0,
            green: 0,
            red: 10,
        },
        item: {
            fillColor: {
                type: "rgb",
                blue: 0,
                green: 0,
                red: 10
            }
        }
    };
    expect(_tweenPropHooks.Color.get(inputTween)).toEqual({ blue: 0, green: 0, red: 10});
    _tweenPropHooks.Color.set(inputTween, 0.5);
    expect(inputTween.item.fillColor).toEqual({ blue: 0, green: 0, red: 60 });
    _tweenPropHooks.Color.set(inputTween, 1);
    expect(inputTween.item.fillColor).toEqual({ blue: 0, green: 0, red: 90 });

    
});
test("_tweenPropHooks.Color (relative)", () => {
    // relative values
    let inputTween2 = {
        _easeColorCache: {},
        prop: "fillColor",
        start: {
            blue: 0,
            green: 0,
            red: 10
        },
        end: {
            red: "+50"
        },
        now: {
            blue: 0,
            green: 0,
            red: 25,
        },
        item: {
            fillColor: {
                type: "rgb",
                blue: 0,
                green: 0,
                red: 10
            }
        }
    };
    expect(_tweenPropHooks.Color.get(inputTween2)).toEqual({ blue: 0, green: 0, red: 10 });
    _tweenPropHooks.Color.set(inputTween2, 0.5);
    expect(inputTween2.item.fillColor).toEqual({ blue: 0, green: 0, red: 35 });
    _tweenPropHooks.Color.set(inputTween2, 1);
    expect(inputTween2.item.fillColor).toEqual({ blue: 0, green: 0, red: 60 });
})
test("_tweenPropHooks.Color.ease (absolute)", () => {
    // absolute values
    let inputTween = {
        prop: "fillColor",
        end: {
            red: 90,
        },
        now: {
            
        },
        start: {
            blue: 0,
            green: 0,
            red: 10,
        },
        item: {
            fillColor: {
                type: "rgb",
                blue: 0,
                green: 0,
                red: 10
            }
        }
    };
    _tweenPropHooks.Color.ease(inputTween, 0.25);
    expect(inputTween.now).toEqual({ blue: 0, green: 0, red: 20 });
    _tweenPropHooks.Color.ease(inputTween, 0.5);
    expect(inputTween.now).toEqual({ blue: 0, green: 0, red: 20 });
    _tweenPropHooks.Color.ease(inputTween, 1);
    expect(inputTween.now).toEqual({ blue: 0, green: 0, red: 40 });
});
test("_tweenPropHooks.Color.ease (relative)", () => {
    // absolute values
    let inputTween = {
        prop: "fillColor",
        end: {
            red: "-100",
        },
        now: {
            
        },
        start: {
            blue: 0,
            green: 0,
            red: 0,
        },
        item: {
            fillColor: {
                type: "rgb",
                blue: 0,
                green: 0,
                red: 10
            }
        }
    };
    _tweenPropHooks.Color.ease(inputTween, 0.25);
    expect(inputTween.now).toEqual({ blue: 0, green: 0, red: -25 });
    _tweenPropHooks.Color.ease(inputTween, 0.5);
    expect(inputTween.now).toEqual({ blue: 0, green: 0, red: -25 });
    _tweenPropHooks.Color.ease(inputTween, 1);
    expect(inputTween.now).toEqual({ blue: 0, green: 0, red: -50 });
});