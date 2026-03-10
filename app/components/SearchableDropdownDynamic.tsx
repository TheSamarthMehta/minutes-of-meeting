"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Plus } from "lucide-react";

interface SearchableDropdownDynamicProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  onAddNew: () => void;
  isLoading?: boolean;
}

export function SearchableDropdownDynamic({
  label,
  value,
  onChange,
  options,
  placeholder = "Select option",
  required = false,
  error,
  disabled = false,
  className = "",
  onAddNew,
  isLoading = false,
}: SearchableDropdownDynamicProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
  };

  return (
    <div className={className} ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div
            className={`bg-[#0f0f0f] border ${
              error ? "border-red-500" : "border-gray-800"
            } rounded-lg px-4 py-3 cursor-pointer flex items-center justify-between ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-gray-700"
            } transition-all`}
            onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
          >
            <span className={selectedOption ? "text-white" : "text-gray-500"}>
              {isLoading
                ? "Loading..."
                : selectedOption
                  ? selectedOption.label
                  : placeholder}
            </span>
            <div className="flex items-center gap-2">
              {value && !disabled && !isLoading && (
                <X
                  className="w-4 h-4 text-gray-400 hover:text-white transition-colors"
                  onClick={handleClear}
                />
              )}
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {isOpen && !disabled && !isLoading && (
            <div className="absolute top-full mt-1 w-full bg-[#0f0f0f] border border-gray-800 rounded-lg shadow-xl z-50 max-h-60 overflow-hidden">
              <div className="p-2 border-b border-gray-800">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className="px-4 py-2 text-white hover:bg-purple-500/20 cursor-pointer transition-colors"
                      onClick={() => handleSelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    No results found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onAddNew}
          disabled={isLoading || disabled}
          className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Add new"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}
