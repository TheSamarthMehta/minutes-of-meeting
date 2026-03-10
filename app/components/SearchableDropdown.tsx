"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface SearchableDropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = "Select option",
  required = false,
  error,
  disabled = false,
  className = "",
}: SearchableDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get the label for the selected value
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : "";

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            value={isDropdownOpen ? searchQuery : displayValue}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => {
              setSearchQuery("");
              setIsDropdownOpen(true);
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-[#2a2a2a] border ${
              error ? "border-red-500" : "border-gray-700"
            } rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
            <ChevronDown
              className={`text-gray-400 pointer-events-none transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              size={20}
            />
          </div>
        </div>

        {isDropdownOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-4 py-2.5 hover:bg-purple-600/20 text-white cursor-pointer transition-colors ${
                    value === option.value ? "bg-purple-600/30" : ""
                  }`}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2.5 text-gray-400 text-sm">
                No options found
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
