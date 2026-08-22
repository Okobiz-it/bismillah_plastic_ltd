"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchableDropdownProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchableDropdown({ options, value, onChange, placeholder = "Select an option..." }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full max-w-sm ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <div 
        className="flex items-center justify-between w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-ivory border border-stone/50 rounded-sm cursor-pointer shadow-sm hover:border-brand/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-sm ${value ? "text-brand" : "text-brand/50"}`}>
          {value || placeholder}
        </span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={`text-brand/70 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-ivory border border-stone/50 rounded-sm shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-stone/30">
              <div className="relative">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-brand/40">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input 
                  type="text"
                  className="w-full pl-9 pr-3 py-2 bg-warm-white text-sm text-brand border-none outline-none focus:ring-1 focus:ring-brand rounded-sm placeholder:text-brand/40"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option}
                    className={`px-4 py-2.5 sm:px-5 sm:py-3 text-sm cursor-pointer transition-colors ${
                      value === option 
                        ? "bg-brand/10 text-brand font-bold" 
                        : "text-brand hover:bg-stone/20"
                    }`}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    {option}
                  </div>
                ))
              ) : (
                <div className="px-5 py-4 text-sm text-brand/50 text-center">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
