import React from "react";

interface SVGProps {
  dimension?: number;
  percentage?: number;
  status?: "todo" | "in-progress" | "completed";
}

const ProgressIcon: React.FC<SVGProps> = ({
  dimension = 24,
  percentage = 0,
}) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r={radius}
        stroke="#999999"
        strokeWidth="4"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r={radius}
        stroke="#FFFF77"
        strokeWidth="4"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
};

export default ProgressIcon;
