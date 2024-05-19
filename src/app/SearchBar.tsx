import React from "react";

const SearchBar = () => {
  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg w-1/3">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>
  );
};

export default SearchBar;
