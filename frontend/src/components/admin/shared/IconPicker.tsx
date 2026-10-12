"use client";

import { useState, useMemo } from "react";
import { FaTimes, FaSearch, FaCheck } from "react-icons/fa";
import { AVAILABLE_ICONS, renderAppIcon } from "@/components/shared/IconRenderer";

interface IconPickerProps {
  value?: string;
  onChange: (iconKey: string) => void;
  label?: string;
}

export default function IconPicker({
  value = "FaLeaf",
  onChange,
  label = "Select Icon",
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Environmental", "Industry & Process", "Social & Welfare", "Metrics & General"];

  const filteredIcons = useMemo(() => {
    return AVAILABLE_ICONS.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.key.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const currentIconObj = AVAILABLE_ICONS.find((i) => i.key === value);

  return (
    <div>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-stone-300 rounded-md hover:border-brand hover:shadow-xs transition-all text-xs cursor-pointer group"
        title="Click to change icon"
      >
        <span className="w-6 h-6 rounded bg-emerald-50 text-brand flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
          {renderAppIcon(value, "w-3.5 h-3.5")}
        </span>
        <span className="font-medium text-stone-700">
          {currentIconObj?.label || value || label}
        </span>
        <span className="text-[10px] text-stone-400 group-hover:text-brand font-semibold underline ml-1">
          Change
        </span>
      </button>

      {/* Modal Picker */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-stone-200 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="font-serif font-bold text-base text-brand">Choose an Icon</h3>
                <p className="text-xs text-stone-500">Pick an icon representation for this section or step</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-md hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Search & Categories */}
            <div className="p-4 border-b border-stone-100 space-y-3 bg-white">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search icons by name or function..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                  autoFocus
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-brand text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Grid */}
            <div className="p-4 overflow-y-auto flex-1 max-h-[380px]">
              {filteredIcons.length === 0 ? (
                <div className="text-center py-10 text-stone-400 text-xs">
                  No matching icons found. Try a different search term.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {filteredIcons.map((item) => {
                    const isSelected = value === item.key;
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          onChange(item.key);
                          setIsOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer relative group ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/30"
                            : "border-stone-200 hover:border-brand hover:bg-stone-50 text-stone-700"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[8px]">
                            <FaCheck />
                          </div>
                        )}
                        <IconComponent className={`w-5 h-5 mb-1.5 ${isSelected ? "text-emerald-700" : "text-stone-600 group-hover:text-brand"}`} />
                        <span className="text-[10px] font-medium leading-tight line-clamp-1">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-stone-200 bg-stone-50 flex justify-between items-center text-xs">
              <span className="text-stone-500">
                Selected: <strong className="text-brand">{currentIconObj?.label || value}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 rounded font-medium text-stone-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
