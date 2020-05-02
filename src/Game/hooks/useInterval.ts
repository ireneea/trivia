import React from "react";
import _isNumber from "lodash/isNumber";

type Delay = null | undefined | number;

/**
 * Hook interval
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 * @param callback A function that will be called on each interval tick
 * @param delay Milliseconds delay between each tick
 */
const useInterval = (callback: () => void, delay: Delay): void => {
  const savedCallback = React.useRef(() => {});

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (isDelayValid(delay)) {
      const timerId = setInterval(() => {
        savedCallback.current();
      }, delay);
      return () => {
        clearInterval(timerId);
      };
    }
  }, [delay]);
};

const isDelayValid = (delay: Delay) => delay && _isNumber(delay) && delay > 0;

export default useInterval;
