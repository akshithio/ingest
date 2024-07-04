import React from "react";

interface SVGProps {
  dimension?: number;
}

const ExpandIcon: React.FC<SVGProps> = ({ dimension = 24 }) => {
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox={`0 0 24 24`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M3.5 22H20.5"
        stroke="white"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M19 3.50195L5 17.502"
        stroke="white"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.73 3.50195L19 3.50195V13.772"
        stroke="white"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ExpandIcon;
