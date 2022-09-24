import { throttle } from "lodash-es";
import { useCallback, useEffect, useMemo } from "react";

export type InputAction = {
  callback: () => void;
  key: string;
};

type KeysStatus = {
  isForwardPressed: boolean;
  isBackwardPressed: boolean;
};

const useInputSlider = (
  forwardAction: InputAction,
  backwardAction: InputAction,
  isNeedToUse = true
) => {
  const throttledClearHandler = useMemo(
    () =>
      throttle(
        (
          forwardAction: InputAction,
          backwardAction: InputAction,
          event: KeyboardEvent,
          keys: KeysStatus
        ) => {
          if (event.key === forwardAction.key) {
            forwardAction.callback();
            keys.isForwardPressed = true;
            return;
          }
          if (event.key === backwardAction.key) {
            backwardAction.callback();
            keys.isBackwardPressed = true;
            return;
          }
        },
        200
      ),
    []
  );

  type ThrottledArgs = Parameters<typeof throttledClearHandler>;
  const throttledHandler = useCallback(
    (...args: [ThrottledArgs[2], ThrottledArgs[3]]) =>
      throttledClearHandler(forwardAction, backwardAction, ...args),
    [backwardAction, forwardAction, throttledClearHandler]
  );

  useEffect(() => {
    const listner = (() => {
      const keys = {
        isForwardPressed: false,
        isBackwardPressed: false,
      };

      return {
        keydown: (event: KeyboardEvent) => {
          if (!isNeedToUse) return;
          if (Object.values(keys).some((key) => !!key)) return;
          if ([forwardAction.key, backwardAction.key].includes(event.key)) {
            throttledHandler(event, keys);
          }
        },
        keyup: (event: KeyboardEvent) => {
          if (event.key === forwardAction.key) {
            keys.isForwardPressed = false;
            return;
          }
          if (event.key === backwardAction.key) {
            keys.isBackwardPressed = false;
            return;
          }
        },
      };
    })();

    window.addEventListener("keyup", listner.keyup);
    window.addEventListener("keydown", listner.keydown);

    return () => {
      window.removeEventListener("keydown", listner.keydown);
      window.removeEventListener("keyup", listner.keyup);
    };
  }, [isNeedToUse, forwardAction, backwardAction, throttledHandler]);
};

export default useInputSlider;
