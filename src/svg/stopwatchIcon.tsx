import React from "react";

function stopwatchIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="22"
      fill="none"
      viewBox="0 0 23 22"
    >
      <path
        fill="#000"
        d="M11.5 4.583c-4.043 0-7.333 3.29-7.333 7.334 0 4.043 3.29 7.333 7.333 7.333s7.333-3.29 7.333-7.333c0-4.044-3.29-7.334-7.333-7.334zm0 12.834a5.506 5.506 0 01-5.5-5.5c0-3.034 2.467-5.5 5.5-5.5s5.5 2.466 5.5 5.5c0 3.033-2.467 5.5-5.5 5.5z"
      ></path>
      <path
        fill="#000"
        d="M10.583 8.25h1.834v4.583h-1.834V8.25zM8.75 1.833h5.5v1.834h-5.5V1.833zm9.435 5.232L16.352 5.23l1.296-1.296 1.833 1.834-1.296 1.296z"
      ></path>
    </svg>
  );
}

export default React.memo(stopwatchIcon);
