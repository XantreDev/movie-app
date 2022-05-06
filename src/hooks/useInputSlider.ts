import React, { useEffect } from 'react'

export type InputAction = {
  callback: () => void,
  key: string
}

const useInputSlider = (forwardAction: InputAction, backwardAction: InputAction) => {
  useEffect(() => {
    const listner = (() => {
      const keys = {
        isForwardPressed: false,
        isBackwardPressed: false,
      };
      return {
        keydown: (event: React.KeyboardEvent) => {
          if (Object.values(keys).some((key) => !!key)) return;
          if (event.key === forwardAction.key) {
            forwardAction.callback()
            keys.isForwardPressed = true;
            return;
          }
          if (event.key === backwardAction.key) {
            backwardAction.callback()
            keys.isBackwardPressed = true;
            return;
          }
        },
        keyup: (event: React.KeyboardEvent) => {
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

    window.addEventListener("keyup", listner.keyup as any);
    window.addEventListener("keydown", listner.keydown as any);

    return () => {
      window.removeEventListener("keydown", listner.keydown as any);
      window.removeEventListener("keyup", listner.keyup as any);
    };
  }, []);
}

export default useInputSlider