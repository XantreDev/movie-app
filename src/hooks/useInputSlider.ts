import React, { useCallback, useEffect, useMemo } from "react";
import { throttle } from "lodash-es";

export type InputAction = {
  callback: () => void;
  key: string;
};

type KeysStatus = {
  isForwardPressed: boolean,
  isBackwardPressed: boolean,
} 

const useInputSlider = (
  forwardAction: InputAction,
  backwardAction: InputAction,
  isNeedToUse = true
) => {
  const throttledHandler = useMemo(() => throttle((event: KeyboardEvent, keys: KeysStatus) => {
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
  }, 200), [forwardAction, backwardAction])

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
          if ([forwardAction.key, backwardAction.key].includes(event.key)){
            throttledHandler(event, keys)
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
  }, [isNeedToUse, forwardAction, backwardAction]);
};

export default useInputSlider;
