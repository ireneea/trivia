import { useState, useEffect } from "react";

type OnEnd = () => void;
type OnTick = (msLeft: number) => void;

type StartProp = {
  milliseconds: number;
  onEnd?: OnEnd;
  onTick?: OnTick;
};

const useCountdown = () => {
  const [totalMs, setTotalMs] = useState(0);
  const [msLeft, setMsLeft] = useState(0);
  const [timer, setTimer] = useState(undefined);
  const [paused, setPaused] = useState(false);
  const [onCountdownEnd, setOnCountdownEnd] = useState((): OnEnd => () => {});
  const [onCountdownTick, setOnCountdownTick] = useState(
    (): OnTick => () => {}
  );

  useEffect(() => {
    // this will called on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    onCountdownTick && onCountdownTick(msLeft);
    if (msLeft === 0 && timer && totalMs !== 0) {
      clearInterval(timer);
      onCountdownEnd && onCountdownEnd();
    }
  }, [msLeft]);

  const start = (props: StartProp) => {
    const { milliseconds, onEnd, onTick } = props;

    clearInterval(timer);
    setPaused(false);
    onEnd && setOnCountdownEnd(() => onEnd);
    onTick && setOnCountdownTick(() => onTick);
    setTotalMs(milliseconds);
    setMsLeft(milliseconds);

    run();
  };

  const pause = () => {
    setPaused(true);
    clearInterval(timer);
  };

  const resume = () => {
    setPaused(false);
    if (msLeft > 0) {
      run();
    }
  };

  const stop = () => {
    setPaused(false);
    clearInterval(timer);
    setTotalMs(0);
    setMsLeft(0);
  };

  const run = () => {
    const newTimer = setInterval(() => {
      setMsLeft((prev) => prev - 100);
    }, 100);
    setTimer((prev) => {
      clearInterval(prev);
      return newTimer;
    });
  };

  const timeLeft = () => {
    return msLeft;
  };

  const timeSpent = () => {
    return totalMs - msLeft;
  };

  return {
    start,
    pause,
    resume,
    timeLeft,
    timeSpent,
    stop,
    paused,
  };
};

export default useCountdown;
