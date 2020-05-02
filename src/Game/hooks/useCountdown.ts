import React from "react";

import useInterval from "./useInterval";

type OnEnd = () => void;
type OnTick = (msLeft: number) => void;

type StartProp = {
  time: number;
  onEnd?: OnEnd;
  onTick?: OnTick;
};

const START = "START";
const TICK = "TICK";
const PAUSE = "PAUSE";
const RESUME = "RESUME";

type ActionType = {
  type: string;
  payload?: any;
};

type CountdownState = {
  timeLeft: number;
  timeSpent: number;
  isDone: boolean;
  isRunning: boolean;
  isPaused: boolean;
  timerID?: number;
};

const COUNTDOWN_DELAY = 100;

const countdownReducer: React.Reducer<CountdownState, ActionType> = (state, action) => {
  const { type, payload } = action;

  switch (action.type) {
    case START: {
      const { time } = payload;
      return {
        timeLeft: time || 0,
        timeSpent: 0,
        isDone: false,
        isRunning: true,
        isPaused: false,
      };
    }
    case TICK: {
      if (!state.isRunning || state.timeLeft <= 0) {
        return state;
      } else {
        const timeLeft = state.timeLeft - COUNTDOWN_DELAY;
        const timeSpent = state.timeSpent + COUNTDOWN_DELAY;
        const isDone = timeLeft <= 0;
        const isRunning = !isDone;
        return {
          ...state,
          timeLeft,
          timeSpent,
          isDone,
          isRunning,
        };
      }
    }
    case PAUSE: {
      if (!state.isRunning) {
        return state;
      } else {
        return {
          ...state,
          isPaused: true,
        };
      }
    }
    case RESUME: {
      if (!state.isRunning) {
        return state;
      } else {
        return {
          ...state,
          isPaused: false,
        };
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
};

const initialState = {
  timeLeft: 0,
  timeSpent: 0,
  isDone: false,
  isRunning: false,
  isPaused: false,
};

const useCountdown = () => {
  const [state, dispatch] = React.useReducer(countdownReducer, initialState);

  const [onCountdownTick, setOnCountdownTick] = React.useState(() => () => {});
  const [onCountdownEnd, setOnCountdownEnd] = React.useState(() => () => {});

  const canTick = state.isRunning && !state.isPaused;
  useInterval(() => dispatch({ type: TICK }), canTick ? COUNTDOWN_DELAY : 0);

  const start = React.useCallback(({ time, onTick, onEnd }: StartProp) => {
    if (time > 0) {
      !!onTick && setOnCountdownTick(() => onTick);
      !!onEnd && setOnCountdownEnd(() => onEnd);
      dispatch({ type: START, payload: { time } });
    }
  }, []);

  React.useEffect(() => {
    if (!!onCountdownTick) {
      onCountdownTick();
    }

    if (!!onCountdownEnd && state.timeLeft === 0) {
      onCountdownEnd();
    }
  }, [state.timeLeft]);

  const pause = React.useCallback(() => dispatch({ type: PAUSE }), []);
  const resume = React.useCallback(() => dispatch({ type: RESUME }), []);

  const countdown = {
    start,
    pause,
    resume,
    timeLeft: state.timeLeft,
    timeSpent: state.timeSpent,
    isDone: state.isDone,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    // stop,
  };

  return countdown;
};

export default useCountdown;
