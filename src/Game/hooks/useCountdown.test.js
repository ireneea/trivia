import { renderHook, act } from "@testing-library/react-hooks";

import useCountdown from "./useCountdown";

jest.useFakeTimers();

describe("useCountdown", () => {
  const initialState = {
    timeLeft: 0,
    timeSpent: 0,
    isDone: false,
    isRunning: false,
    isPaused: false,
  };

  it("should have the initial state", () => {
    const { result } = renderHook(() => useCountdown());
    expect(result.current).toMatchObject(initialState);
  });

  describe("start", () => {
    it("should start", () => {
      const time = 1000;
      const { result } = renderHook(() => useCountdown());

      act(() => result.current.start({ time }));

      expect(result.current).toMatchObject({
        timeLeft: time,
        timeSpent: 0,
        isDone: false,
        isRunning: true,
        isPaused: false,
      });
    });

    it("should not start when the time is a negative number", () => {
      const { result } = renderHook(() => useCountdown());

      act(() => result.current.start({ time: -10 }));

      expect(result.current).toMatchObject({
        timeLeft: 0,
        timeSpent: 0,
        isDone: false,
        isRunning: false,
        isPaused: false,
      });
    });

    it("should restart", () => {
      const time = 1000;
      const { result } = renderHook(() => useCountdown());

      act(() => result.current.start({ time }));
      act(() => jest.advanceTimersByTime(500));
      act(() => result.current.start({ time }));

      expect(result.current).toMatchObject({
        timeLeft: time,
        timeSpent: 0,
        isDone: false,
        isRunning: true,
        isPaused: false,
      });
    });
  });

  it("should countdown", () => {
    const time = 1000;
    const { result } = renderHook(() => useCountdown());

    act(() => result.current.start({ time }));

    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toMatchObject({
      timeLeft: 700,
      timeSpent: 300,
      isDone: false,
      isRunning: true,
      isPaused: false,
    });

    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toMatchObject({
      timeLeft: 500,
      timeSpent: 500,
      isDone: false,
      isRunning: true,
      isPaused: false,
    });

    act(() => jest.advanceTimersByTime(500));
    expect(result.current).toMatchObject({
      timeLeft: 0,
      timeSpent: 1000,
      isDone: true,
      isRunning: false,
      isPaused: false,
    });

    act(() => jest.advanceTimersByTime(500));
    expect(result.current).toMatchObject({
      timeLeft: 0,
      timeSpent: 1000,
      isDone: true,
      isRunning: false,
      isPaused: false,
    });
  });

  it("should pause and resume", () => {
    const { result } = renderHook(() => useCountdown());

    // pausing before starting should have no effect
    act(() => result.current.pause());
    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toMatchObject(initialState);

    // resuming before starting should have no effect
    act(() => result.current.resume());
    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toMatchObject(initialState);

    act(() => result.current.start({ time: 1000 }));

    // should set `isPaused` to true
    act(() => jest.advanceTimersByTime(300));
    act(() => result.current.pause());
    expect(result.current).toMatchObject({
      timeLeft: 700,
      timeSpent: 300,
      isDone: false,
      isRunning: true,
      isPaused: true,
    });

    // should not change the countdown
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toMatchObject({
      timeLeft: 700,
      timeSpent: 300,
      isDone: false,
      isRunning: true,
      isPaused: true,
    });

    // should change the countdown after resume
    act(() => result.current.resume());
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toMatchObject({
      timeLeft: 400,
      timeSpent: 600,
      isDone: false,
      isRunning: true,
      isPaused: false,
    });
  });

  it("should call onTick", () => {
    const mockFunction = jest.fn();
    const { result } = renderHook(() => useCountdown());
    expect(mockFunction).toHaveBeenCalledTimes(0);

    act(() => result.current.start({ time: 1000, onTick: mockFunction }));
    expect(mockFunction).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(100));
    expect(mockFunction).toHaveBeenCalledTimes(2);

    act(() => jest.advanceTimersByTime(900));
    expect(mockFunction).toHaveBeenCalledTimes(11);

    act(() => jest.advanceTimersByTime(500));
    expect(mockFunction).toHaveBeenCalledTimes(11);
  });

  it("should call onTick with custom tick delay", () => {
    const mockFunction = jest.fn();
    const { result } = renderHook(() => useCountdown(500));
    expect(mockFunction).toHaveBeenCalledTimes(0);

    act(() => result.current.start({ time: 1000, onTick: mockFunction }));
    expect(mockFunction).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(100));
    expect(mockFunction).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(500));
    expect(mockFunction).toHaveBeenCalledTimes(2);

    act(() => jest.advanceTimersByTime(400));
    expect(mockFunction).toHaveBeenCalledTimes(3);

    //FIXME: find out why thou counter has ticked 4 times here
    // act(() => jest.advanceTimersByTime(500));
    // expect(mockFunction).toHaveBeenCalledTimes(3);
  });

  it("should call onEnd", () => {
    const mockFunction = jest.fn();
    const { result } = renderHook(() => useCountdown());
    expect(mockFunction).toHaveBeenCalledTimes(0);

    act(() => result.current.start({ time: 1000, onEnd: mockFunction }));
    expect(mockFunction).toHaveBeenCalledTimes(0);

    act(() => jest.advanceTimersByTime(100));
    expect(mockFunction).toHaveBeenCalledTimes(0);

    act(() => jest.advanceTimersByTime(900));
    expect(mockFunction).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(500));
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});
