import React from "react";

interface SVGProps {
  isActive: boolean;
  dimension?: number;
}

const SearchIcon: React.FC<SVGProps> = ({
  isActive = false,
  dimension = 24,
}) => {
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox={`0 0 ${dimension} ${dimension}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        fill={isActive ? "#fff" : "#999999"}
      />
      <path
        d="M21.3001 22.0005C21.1201 22.0005 20.9401 21.9305 20.8101 21.8005L18.9501 19.9405C18.6801 19.6705 18.6801 19.2305 18.9501 18.9505C19.2201 18.6805 19.6601 18.6805 19.9401 18.9505L21.8001 20.8105C22.0701 21.0805 22.0701 21.5205 21.8001 21.8005C21.6601 21.9305 21.4801 22.0005 21.3001 22.0005Z"
        fill={isActive ? "#fff" : "#999999"}
      />
    </svg>
  );
};

export default SearchIcon;
