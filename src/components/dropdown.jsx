import React from "react";

const dropdown = ({ options, selected, onChange, placeholder }) => {
  return (
    <div className="dropdown">
      <select value={selected} onChange={onChange} className="dropdown-select">
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default dropdown;
