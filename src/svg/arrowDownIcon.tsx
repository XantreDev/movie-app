import React from "react";

import { IconProps } from "../types/props";

function arrowDownIcon(props: IconProps)  {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="39"
      height="40"
      fill="none"
      viewBox="0 0 39 40"
    >
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M19.5 2.938a1.219 1.219 0 011.219 1.218v28.746l7.668-7.671a1.22 1.22 0 111.726 1.726l-9.75 9.75a1.218 1.218 0 01-1.726 0l-9.75-9.75a1.22 1.22 0 111.726-1.726l7.668 7.67V4.157a1.219 1.219 0 011.22-1.218z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default React.memo(arrowDownIcon);
