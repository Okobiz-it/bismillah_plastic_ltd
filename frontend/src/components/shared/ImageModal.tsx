"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import SafeImage from "./SafeImage";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src?: string;
  title?: string;
  description?: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  src,
  title,
  description,
}: ImageModalProps) {
  if (!isOpen || !src) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 cursor-pointer animate-fadeIn"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg p-3 sm:p-6 md:p-8 overflow-hidden shadow-2xl flex flex-col items-center justify-center cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <FaTimes size={16} />
          </button>

          {/* Image preview */}
          <div className="relative w-full h-[45vh] sm:h-[55vh] min-h-[220px] sm:min-h-[280px] flex items-center justify-center bg-stone-50/50 rounded-md overflow-hidden p-2 sm:p-4">
            <SafeImage
              src={src}
              alt={title || "Certificate Preview"}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Text Info */}
          {(title || description) && (
            <div className="mt-4 text-center">
              {title && <h3 className="font-serif text-lg sm:text-xl font-bold text-brand">{title}</h3>}
              {description && <p className="text-sm text-stone-600 mt-1 max-w-xl">{description}</p>}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
