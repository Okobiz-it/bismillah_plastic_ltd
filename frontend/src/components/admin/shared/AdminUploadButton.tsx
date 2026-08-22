"use client";

import React, { useRef } from "react";
import { FaCloudUploadAlt, FaTimes, FaSpinner, FaCheckCircle } from "react-icons/fa";

interface AdminUploadButtonProps {
  onFileSelect?: (file: File | null) => void;
  onMultipleFilesSelect?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  currentFileName?: string;
  selectedFile?: File | null;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
}

export default function AdminUploadButton({
  onFileSelect,
  onMultipleFilesSelect,
  accept = "image/*",
  multiple = false,
  label = "Upload",
  currentFileName,
  selectedFile,
  isLoading = false,
  disabled = false,
  className = "",
  compact = false,
}: AdminUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (multiple && onMultipleFilesSelect) {
      const files = Array.from(e.target.files || []);
      onMultipleFilesSelect(files);
    } else if (onFileSelect) {
      const file = e.target.files?.[0] || null;
      onFileSelect(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onFileSelect) onFileSelect(null);
    if (onMultipleFilesSelect) onMultipleFilesSelect([]);
  };

  const displayName = selectedFile?.name || currentFileName;

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={disabled || isLoading}
      />

      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light active:scale-95 text-white font-medium rounded-lg transition-all duration-200 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50 disabled:cursor-not-allowed ${
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs sm:text-sm"
        }`}
      >
        {isLoading ? (
          <FaSpinner className="animate-spin text-sm" />
        ) : (
          <FaCloudUploadAlt className="text-base shrink-0" />
        )}
        <span>{isLoading ? "Uploading..." : label}</span>
      </button>

      {displayName && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-md text-xs text-stone-700 max-w-[200px] sm:max-w-[260px] truncate">
          <FaCheckCircle className="text-brand shrink-0 text-xs" />
          <span className="truncate">{displayName}</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-stone-400 hover:text-red-600 transition-colors p-0.5 ml-0.5 cursor-pointer"
            title="Clear file"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
