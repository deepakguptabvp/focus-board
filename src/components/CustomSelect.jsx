import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  className = "",
  menuClassName = "",
  align = "left",
  direction = "down", // "down" | "up"
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const isFull = fullWidth || className.includes("w-full");

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Format options: support both ['Work', 'Design'] and [{ value, label }]
  const formattedOptions = options.map((opt) =>
    typeof opt === "object" ? opt : { value: opt, label: opt }
  );

  const selectedOption = formattedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  const positionClasses =
    direction === "up"
      ? "bottom-full mb-1.5"
      : "top-full mt-1.5";

  return (
    <div
      className={`relative ${isFull ? "w-full block" : "inline-block"} text-left transition-all ${
        isOpen ? "z-50" : "z-10"
      }`}
      ref={containerRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-800 border rounded-xl text-xs sm:text-sm font-semibold text-slate-200 flex items-center justify-between gap-2.5 transition shadow-sm focus:outline-none ${
          isOpen
            ? "border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30"
            : "border-slate-700/80 hover:border-indigo-500/40"
        } ${className}`}
      >
        <span className="truncate">{displayLabel}</span>
        <FaChevronDown
          className={`text-[10px] text-indigo-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "transform rotate-180 text-indigo-300" : ""
          }`}
        />
      </button>

      {/* Matching Rounded Glassmorphic Menu */}
      {isOpen && (
        <div
          className={`absolute ${positionClasses} z-50 ${
            isFull ? "w-full left-0 right-0" : "min-w-full w-max max-w-xs " + (align === "right" ? "right-0" : "left-0")
          } bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/40 rounded-xl shadow-2xl shadow-black/90 p-1.5 ring-1 ring-white/10 animate-fade-in ${menuClassName}`}
        >
          <div className="max-h-60 overflow-y-auto space-y-1 pr-0.5">
            {formattedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 rounded-lg text-left text-xs font-medium transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-indigo-600/25 text-indigo-300 font-bold border border-indigo-500/30 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-indigo-600/15"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <FaCheck className="text-[10px] text-indigo-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
