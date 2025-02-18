import React from "react";

interface SVGProps {
  dimension?: number;
  fill?: string;
}

const PaperIcon: React.FC<SVGProps> = ({ dimension = 24, fill = "#fff" }) => {
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 4.5H21"
        stroke={fill}
        strokeWidth={(dimension / 24) * 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 9.5H21"
        stroke={fill}
        strokeWidth={(dimension / 24) * 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14.5H21"
        stroke={fill}
        strokeWidth={(dimension / 24) * 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 8.43V5.57C9.5 4.45 9.05 4 7.92 4H5.07C3.95 4 3.5 4.45 3.5 5.57V8.42C3.5 9.55 3.95 10 5.07 10H7.92C9.05 10 9.5 9.55 9.5 8.43Z"
        stroke={fill}
        strokeWidth={(dimension / 24) * 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0498 19.5H20.9998"
        stroke={fill}
        strokeWidth={(dimension / 24) * 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 19.5H5.98"
        stroke={fill}
        strokeWidth={(dimension / 24) * 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PaperIcon;
