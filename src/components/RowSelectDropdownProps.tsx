// src/components/RowSelectDropdown.tsx
import React, { useState, useRef, useEffect } from "react";

interface RowSelectDropdownProps {
  onSubmit: (value: number) => void;
  onClose: () => void;
}

const RowSelectDropdown: React.FC<RowSelectDropdownProps> = ({ onSubmit, onClose }) => {
  const [value, setValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      onSubmit(num);
      setValue("");
      onClose();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 top-full mt-2 p-3 bg-white border border-gray-600 shadow-md rounded-md z-50 w-48"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="number"
          placeholder="Select rows..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="px-2 py-1 border border-gray-500 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        >
          submit
        </button>
      </form>
    </div>
  );
};

export default RowSelectDropdown; 

