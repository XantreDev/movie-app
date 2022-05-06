import React from "react";

const useCombineCallbacksByState = (
  entities: { target?: string; callback: () => void; isNeedToUse?: boolean }[],
  state: string
) => {
  return () => {
    const ent =
      entities
        .filter((ent) => ent.isNeedToUse ?? true)
        .find((ent) => ent?.target === state) ?? entities.at(-1);
    ent.callback();
  };
};

export default useCombineCallbacksByState;
