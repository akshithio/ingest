import React from "react";

// uneven icon, no dimension prop

interface SVGProps {
  isActive: boolean;
  dimension?: number;
}

const HomeIcon: React.FC<SVGProps> = ({ isActive = false, dimension = 24 }) => {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.83 6.01002L13.28 0.770018C12 -0.249982 9.99996 -0.259982 8.72996 0.760018L2.17996 6.01002C1.23996 6.76002 0.669963 8.26002 0.869963 9.44002L2.12996 16.98C2.41996 18.67 3.98996 20 5.69996 20H16.3C17.99 20 19.59 18.64 19.88 16.97L21.14 9.43002C21.32 8.26002 20.75 6.76002 19.83 6.01002ZM11.75 16C11.75 16.41 11.41 16.75 11 16.75C10.59 16.75 10.25 16.41 10.25 16V13C10.25 12.59 10.59 12.25 11 12.25C11.41 12.25 11.75 12.59 11.75 13V16Z"
        fill={isActive ? "#fff" : "#999999"}
      />
    </svg>
  );
};

export default HomeIcon;
