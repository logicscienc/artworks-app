// src/components/RowSelectDropdown.tsx
import React, { useState, useRef, useEffect } from "react";


// Props interface (TypeScript) for this component
// - onSubmit: function that gets called with the number user enters
// - onClose: function that closes the dropdown
interface RowSelectDropdownProps {
  onSubmit: (value: number) => void;
  onClose: () => void;
}


// Functional component definition
const RowSelectDropdown: React.FC<RowSelectDropdownProps> = ({ onSubmit, onClose }) => {

   // Local state to store user input from the textbox
  const [value, setValue] = useState("");

  // Ref to the dropdown DOM element (used for click outside detection)
  const dropdownRef = useRef<HTMLDivElement>(null);

   // Effect: Detect clicks outside the dropdown and close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      
      // If click is outside the dropdown, call onClose()
  
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

