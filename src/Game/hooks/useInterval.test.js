import { renderHook, act } from "@testing-library/react-hooks";

import useInterval from "./useInterval";

jest.useFakeTimers();

describe("useInterval", () => {
  it("should call the call back on each tick", () => {
    const mockCallback = jest.fn();

    renderHook(() => useInterval(mockCallback, 100));

    act(() => jest.advanceTimersByTime(50));
    expect(mockCallback).toHaveBeenCalledTimes(0);

    act(() => jest.advanceTimersByTime(50));
    expect(mockCallback).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(400));
    expect(mockCallback).toHaveBeenCalledTimes(5);
  });

  it("should not tick if the delay is not a positive number", () => {
    const mockCallback = jest.fn();
    let delay = 100;

    const { result, rerender } = renderHook(() => useInterval(mockCallback, delay));

    act(() => jest.advanceTimersByTime(210));
    expect(mockCallback).toHaveBeenCalledTimes(2);

    delay = null;
    rerender();
    act(() => jest.advanceTimersByTime(90));
    expect(mockCallback).toHaveBeenCalledTimes(2);

    delay = 100;
    rerender();
    act(() => jest.advanceTimersByTime(100));
    expect(mockCallback).toHaveBeenCalledTimes(3);

    delay = undefined;
    rerender();
    act(() => jest.advanceTimersByTime(100));
    expect(mockCallback).toHaveBeenCalledTimes(3);

    delay = 100;
    rerender();
    act(() => jest.advanceTimersByTime(100));
    expect(mockCallback).toHaveBeenCalledTimes(4);

    delay = 0;
    rerender();
    act(() => jest.advanceTimersByTime(100));
    expect(mockCallback).toHaveBeenCalledTimes(4);

    delay = 100;
    rerender();
    act(() => jest.advanceTimersByTime(100));
    expect(mockCallback).toHaveBeenCalledTimes(5);

    delay = -10;
    rerender();
    act(() => jest.advanceTimersByTime(100));
    expect(mockCallback).toHaveBeenCalledTimes(5);
  });
});
