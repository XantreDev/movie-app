import React, { useEffect } from 'react'

const useInputSlider = (increment: () => void, decriment: () => void) => {
  useEffect(() => {
    const listner = (() => {
      const keys = {
        isArrowLeftPressed: false,
        isArrowRightPressed: false,
      };
      return {
        keydown: (event: React.KeyboardEvent) => {
          if (Object.values(keys).some((key) => !!key)) return;
          if (event.key === "ArrowLeft") {
            decriment();
            keys.isArrowLeftPressed = true;
            return;
          }
          if (event.key === "ArrowRight") {
            increment()
            keys.isArrowRightPressed = true;
            return;
          }
        },
        keyup: (event: React.KeyboardEvent) => {
          if (event.key === "ArrowLeft") {
            keys.isArrowLeftPressed = false;
            return;
          }
          if (event.key === "ArrowRight") {
            keys.isArrowRightPressed = false;
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