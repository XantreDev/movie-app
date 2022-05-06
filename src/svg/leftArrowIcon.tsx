import React from "react";
import { IconProps } from "./../types/props";

const leftArrowIcon = (props: IconProps)  => {
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
        d="M16.06 2.454a1.5 1.5 0 010 2.121L8.637 12l7.425 7.425a1.5 1.5 0 01-2.121 2.121l-8.486-8.485a1.5 1.5 0 010-2.121l8.486-8.486a1.5 1.5 0 012.12 0z"
      ></path>
    </svg>
  );
};

export default React.memo(leftArrowIcon);
