import React from "react";

interface SVGProps {
  isActive: boolean;
  dimension?: number;
}

const ModifyIcon: React.FC<SVGProps> = ({
  isActive = true,
  dimension = 24,
}) => {
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox={`0 0 26 26`}
      stroke="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* all of this because the original size of the svg comes out to 26px instead of 24 */}
      <path
        d="M11.5006 1.5322C12.3411 0.822601 13.6979 0.822601 14.5144 1.5322L16.4116 3.15585C16.7719 3.45653 17.4563 3.7091 17.9366 3.7091H19.9779C21.2507 3.7091 22.2953 4.75545 22.2953 6.03032V8.07492C22.2953 8.556 22.5475 9.22952 22.8477 9.59033L24.4687 11.4906C25.1771 12.3325 25.1771 13.6916 24.4687 14.5094L22.8477 16.4097C22.5475 16.7705 22.2953 17.444 22.2953 17.9251V19.9697C22.2953 21.2446 21.2507 22.2909 19.9779 22.2909H17.9366C17.4563 22.2909 16.7839 22.5435 16.4236 22.8441L14.5265 24.4678C13.6859 25.1774 12.3291 25.1774 11.5126 24.4678L9.61539 22.8441C9.25516 22.5435 8.57073 22.2909 8.10244 22.2909H6.00113C4.72833 22.2909 3.68368 21.2446 3.68368 19.9697V17.9131C3.68368 17.444 3.44353 16.7585 3.14334 16.4097L1.52233 14.4974C0.825891 13.6675 0.825891 12.3205 1.52233 11.4906L3.14334 9.5783C3.44353 9.21749 3.68368 8.54397 3.68368 8.07492V6.04234C3.68368 4.76748 4.72833 3.72112 6.00113 3.72112H8.07842C8.55872 3.72112 9.23114 3.46855 9.59137 3.16788L11.5006 1.5322Z"
        stroke={isActive ? "#fff" : "#999999"}
        strokeWidth={(dimension / 24) * 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.79883 17.7586L13.0015 8.28125L17.2041 17.7586"
        stroke={isActive ? "#fff" : "#999999"}
        strokeWidth={(dimension / 24) * 1.8}
        strokeLinejoin="bevel"
      />
      <path
        d="M15.1029 14.5938H10.9002"
        stroke={isActive ? "#fff" : "#999999"}
        strokeWidth={(dimension / 24) * 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ModifyIcon;
