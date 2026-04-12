import React from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({
  value = "",
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  showClearButton = true,
  disabled = false,
  icon = true,
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange("");
    }
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      )}

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-lg py-2.5 pr-10 transition-all focus:outline-none focus:ring-2 focus:ring-[#00CC99] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
          icon ? "pl-10" : "pl-4"
        }`}
      />

      {/* Clear Button */}
      {showClearButton && value && !disabled && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
