import React from "react";

import { IconProps } from "../types/props";

const rightArrowIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="#fff"
        d="M7.94 2.454a1.5 1.5 0 000 2.121L15.363 12 7.94 19.425a1.5 1.5 0 002.121 2.121l8.486-8.485a1.5 1.5 0 000-2.121L10.06 2.454a1.5 1.5 0 00-2.12 0z"
      ></path>
    </svg>
  );
};

export default React.memo(rightArrowIcon);
