import { Tween } from "../../src/tween";

test("Tween", () => {
    const mockSet = jest.fn();
    const mockAnimation = {
        item: {
            myProp: 0,
            set: mockSet
        },
        settings: {
            duration: 200,
            easing: "linear"
        }
    };
    const tween = new Tween("myProp", 300, mockAnimation);
    expect(tween.start).toBe(0);
    expect(tween.now).toBe(0);
    expect(tween.end).toBe(300);
    expect(tween.direction).toBe("+");
    expect(tween.cur()).toBe(0);
    tween.run(0.5);
    expect(tween.now).toBe(150);
    expect(mockSet).toBeCalledWith({"myProp": 150});
});