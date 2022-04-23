import React from "react";

function starIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      fill="none"
      viewBox="0 0 20 21"
    >
      <path
        fill="#fff"
        d="M19.947 7.68a1 1 0 00-.868-.676l-5.701-.453-2.467-5.461a.997.997 0 00-1.822-.001L6.622 6.55l-5.701.453a1 1 0 00-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 001.53 1.057L10 16.703l5.445 3.63a1.001 1.001 0 001.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"
      ></path>
    </svg>
  );
}

export default React.memo(starIcon);
