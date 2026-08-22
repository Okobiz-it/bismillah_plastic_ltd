"use client";

import { FaTimes } from "react-icons/fa";
import B2BQuoteForm from "@/components/shared/B2BQuoteForm";

interface QuoteModalProps {
  isOpen?: boolean;
  product: {
    name: string;
    category?: string;
    description?: string;
    imageUrl?: string;
    image?: string;
    type?: string;
  };
  defaultInquiryType?: string;
  onClose: () => void;
}

export default function QuoteModal({ isOpen = true, product, onClose }: QuoteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-charcoal/80 backdrop-blur-xs overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-lg shadow-2xl border border-stone-200 z-10 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="pr-4 min-w-0">
            <span className="text-[10px] font-bold text-brand uppercase tracking-wider block mb-0.5 leading-tight">
              {product.category || "Recycled Plastic Material"}
            </span>
            <h2 className="font-serif text-base sm:text-lg md:text-xl font-bold text-charcoal truncate leading-tight">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-stone-400 hover:text-charcoal bg-white p-1.5 rounded-full border border-stone-200 hover:border-stone-300 transition-colors shrink-0 cursor-pointer shadow-2xs"
            aria-label="Close quote modal"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Form Container */}
        <div className="p-0">
          <B2BQuoteForm
            productName={product.name}
            hideSampleOption={true}
          />
        </div>
      </div>
    </div>
  );
}
