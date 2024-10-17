import React, { useState, useEffect, useRef } from "react";
import { Save, Trash, EditIcon } from "lucide-react";

const SearchableSelect = ({ options, value, onChange, disabled }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options.slice(0, 10));
  const selectRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered.slice(0, 10));
    } else {
      setFilteredOptions(options.slice(0, 10));
    }
  }, [searchTerm, options]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (e) => {
    onChange(e);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search hero..."
        className="w-full p-2 border border-gray-300 rounded-md mb-1"
        disabled={disabled}
      />
      <select
        ref={selectRef}
        value={value}
        onChange={handleSelectChange}
        disabled={disabled}
        className="w-full p-2 border border-gray-300 rounded-md appearance-none"
      >
        <option value="">Choose a hero</option>
        {filteredOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
};

export default SearchableSelect;