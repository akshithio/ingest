import React from "react";

interface SVGProps {
  isActive: boolean;
  dimension?: number;
}

const AddIcon: React.FC<SVGProps> = ({ isActive = true, dimension = 24 }) => {
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox={`0 0 24 24`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0C5.37 0 0 5.37 0 12C0 14.25 0.63 16.38 1.74 18.18C3.81 21.66 7.62 24 12 24C16.38 24 20.19 21.66 22.26 18.18C23.37 16.38 24 14.25 24 12C24 5.37 18.63 0 12 0ZM16.47 14.1899H14.25V16.53C14.25 17.76 13.23 18.78 12 18.78C10.77 18.78 9.75 17.76 9.75 16.53V14.1899H7.53C6.3 14.1899 5.28 13.1699 5.28 11.9399C5.28 10.7099 6.3 9.68994 7.53 9.68994H9.75V7.56006C9.75 6.33006 10.77 5.31006 12 5.31006C13.23 5.31006 14.25 6.33006 14.25 7.56006V9.68994H16.47C17.7 9.68994 18.72 10.7099 18.72 11.9399C18.72 13.1699 17.73 14.1899 16.47 14.1899Z"
        fill={isActive ? "#fff" : "#999999"}
      />
    </svg>
  );
};

export default AddIcon;
