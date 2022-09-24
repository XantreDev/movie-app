import React from "react";

import { IconProps } from "../types/props";

function searchIcon(props: IconProps)  {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        fill="#fff"
        fillOpacity="0.8"
        d="M14.678 12.927a8.125 8.125 0 10-1.746 1.748h-.001c.037.05.077.097.122.143l4.813 4.813a1.25 1.25 0 101.768-1.768l-4.812-4.812a1.266 1.266 0 00-.144-.125v.001zm.323-4.805a6.876 6.876 0 01-11.736 4.862A6.875 6.875 0 1115 8.122z"
      ></path>
    </svg>
  );
}

export default searchIcon;
