"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/api";
import { FaCheck, FaSpinner, FaPaperPlane } from "react-icons/fa";
import MiniRichTextEditor from "@/components/shared/MiniRichTextEditor";

interface SimpleQuoteFormProps {
  productName?: string;
  submitButtonText?: string;
  formTitle?: string;
  formSubtitle?: string;
  onSuccess?: () => void;
  className?: string;
}

export default function SimpleQuoteForm({
  productName = "",
  submitButtonText = "Submit quote",
  formTitle,
  formSubtitle,
  onSuccess,
  className = "",
}: SimpleQuoteFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    company: "",
    email: "",
    phone: "",
    product: productName || "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMessageChange = (val: string) => {
    setFormData((prev) => ({ ...prev, message: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate rich text message
    const cleanMessageText = (formData.message || "").replace(/<[^>]*>/g, "").trim();
    if (!cleanMessageText) {
      return setError("Please provide your message or inquiry details.");
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        product: formData.product.trim(),
        message: formData.message.trim(),
        type: "quote",
        inquiryType: "Export Quote Request",
      };

      const res = await fetch(`${API_BASE}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");

      setSubmitted(true);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2200);
      }
    } catch (_err) {
      setError(
        "Failed to send your quote request. Please try again or contact us directly via email/phone."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-6 sm:p-10 border border-stone-200 rounded-lg text-center shadow-xs w-full">
        <div className="w-14 h-14 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheck className="text-xl" />
        </div>
        <h3 className="text-xl sm:text-2xl font-serif text-brand font-bold mb-2">
          Quote Request Received
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. Our export desk will review your requirements and provide a detailed quotation within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: "",
              designation: "",
              company: "",
              email: "",
              phone: "",
              product: productName || "",
              message: "",
            });
          }}
          className="px-6 py-2.5 bg-brand text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-light transition-all shadow-xs cursor-pointer"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden w-full ${className}`}>
      {(formTitle || formSubtitle) && (
        <div className="border-b border-stone-100 bg-stone-50/70 px-5 sm:px-7 py-4">
          {formTitle && (
            <h3 className="font-serif text-lg sm:text-xl font-bold text-brand">
              {formTitle}
            </h3>
          )}
          {formSubtitle && (
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {formSubtitle}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4">
        {error && (
          <div className="p-3.5 bg-red-50 text-red-700 text-xs sm:text-sm border border-red-200 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-3.5 py-2.5 bg-stone-50/60 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-brand focus:ring-2 focus:ring-brand/15 rounded text-sm text-stone-800 placeholder-stone-400 transition-all outline-none"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Designation
            </label>
            <input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Procurement Manager"
              className="w-full px-3.5 py-2.5 bg-stone-50/60 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-brand focus:ring-2 focus:ring-brand/15 rounded text-sm text-stone-800 placeholder-stone-400 transition-all outline-none"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Company
            </label>
            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Global Polymers Ltd."
              className="w-full px-3.5 py-2.5 bg-stone-50/60 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-brand focus:ring-2 focus:ring-brand/15 rounded text-sm text-stone-800 placeholder-stone-400 transition-all outline-none"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. procurement@company.com"
              className="w-full px-3.5 py-2.5 bg-stone-50/60 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-brand focus:ring-2 focus:ring-brand/15 rounded text-sm text-stone-800 placeholder-stone-400 transition-all outline-none"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 234 567 8900"
              className="w-full px-3.5 py-2.5 bg-stone-50/60 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-brand focus:ring-2 focus:ring-brand/15 rounded text-sm text-stone-800 placeholder-stone-400 transition-all outline-none"
            />
          </div>

          {/* Product of Interest */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Product of Interest
            </label>
            <input
              name="product"
              value={formData.product}
              onChange={handleChange}
              placeholder="e.g. Hot Washed Clear PET Flakes"
              className="w-full px-3.5 py-2.5 bg-stone-50/60 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-brand focus:ring-2 focus:ring-brand/15 rounded text-sm text-stone-800 placeholder-stone-400 transition-all outline-none"
            />
          </div>

          {/* Message (Rich Text Editor) */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Message <span className="text-red-500">*</span>
            </label>
            <MiniRichTextEditor
              value={formData.message}
              onChange={handleMessageChange}
              placeholder="Please specify your required quantity, specifications, destination port, or any questions..."
              minHeight="min-h-[170px]"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-brand hover:bg-brand-light text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaPaperPlane className="text-xs" />
                <span>{submitButtonText}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
