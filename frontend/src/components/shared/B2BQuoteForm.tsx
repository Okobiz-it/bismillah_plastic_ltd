"use client";

import { useState, useRef, useEffect } from "react";
import { API_BASE } from "@/lib/api";
import { FaPaperclip, FaTimes, FaCheck, FaSpinner, FaLock } from "react-icons/fa";
import MiniRichTextEditor from "@/components/shared/MiniRichTextEditor";

interface B2BQuoteFormProps {
  productName?: string;
  hideSampleOption?: boolean;
  formTitle?: string;
  formSubtitle?: string;
}

export default function B2BQuoteForm({
  productName = "",
  formTitle,
  formSubtitle,
}: B2BQuoteFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    country: "",
    email: "",
    phone: "",
    whatsapp: "",
    product: productName || "",
    productGrade: "",
    quantity: "",
    requiredSpecification: "",
    destinationPort: "",
    incoterm: "FOB",
    targetDelivery: "",
    message: "",
  });

  useEffect(() => {
    if (productName) {
      setFormData((prev) => ({ ...prev, product: productName }));
    }
  }, [productName]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      return setError("Please provide your detailed requirements or notes.");
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        country: formData.country.trim(),
        email: formData.email.trim(),
        phone: (formData.phone || formData.whatsapp).trim(),
        whatsapp: formData.whatsapp.trim(),
        product: formData.product.trim(),
        productGrade: formData.productGrade.trim(),
        quantity: formData.quantity.trim(),
        requiredSpecification: formData.requiredSpecification.trim(),
        destinationPort: formData.destinationPort.trim(),
        incoterm: formData.incoterm,
        targetDelivery: formData.targetDelivery.trim(),
        message: formData.message.trim(),
        type: "quote",
        inquiryType: "Export Quote Request",
        details: {},
      };

      const res = await fetch(`${API_BASE}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");

      setSubmitted(true);
    } catch (_err) {
      setError(
        "Failed to send your request. Please try again or contact us directly via email or phone."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full px-3.5 py-2.5 bg-stone-50/60 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-brand focus:ring-2 focus:ring-brand/15 rounded text-sm text-stone-800 placeholder-stone-400 transition-all outline-none";

  const labelCls =
    "block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5";

  if (submitted) {
    return (
      <div className="bg-white p-8 sm:p-10 text-center w-full">
        <div className="w-14 h-14 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheck className="text-xl" />
        </div>
        <h3 className="text-xl sm:text-2xl font-serif text-brand font-bold mb-2">
          Quote Request Received
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. Our export team will review your specifications and respond with a detailed quotation within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: "",
              company: "",
              country: "",
              email: "",
              phone: "",
              whatsapp: "",
              product: productName || "",
              productGrade: "",
              quantity: "",
              requiredSpecification: "",
              destinationPort: "",
              incoterm: "FOB",
              targetDelivery: "",
              message: "",
            });
            setFile(null);
          }}
          className="px-6 py-2.5 bg-brand text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-light transition-all cursor-pointer shadow-xs"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white w-full">
      {/* Optional header for standalone usage */}
      {(formTitle || formSubtitle) && (
        <div className="border-b border-stone-100 bg-stone-50/70 px-5 sm:px-6 py-3.5 sm:py-4">
          {formTitle && (
            <h3 className="font-serif text-lg sm:text-xl font-bold text-brand">
              {formTitle}
            </h3>
          )}
          {formSubtitle && (
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5 leading-relaxed">
              {formSubtitle}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-5">
        {error && (
          <div className="p-3.5 bg-red-50 text-red-700 text-xs sm:text-sm border border-red-200 rounded">
            {error}
          </div>
        )}

        {/* ── SECTION 1: Contact Information ─────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1.5 border-b border-stone-100">
            <span className="w-5 h-5 rounded-full bg-brand/10 text-brand text-[10px] font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <h4 className="text-[11px] font-bold text-brand uppercase tracking-wider">
              Contact Information
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className={labelCls}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Michael Smith"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Company Name</label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Global Plastics Corp"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>
                Business Email <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. buyer@company.com"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>
                Country / Region <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. Germany, USA, Vietnam"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Phone Number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 234 567 8900"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>WhatsApp / WeChat</label>
              <input
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="e.g. +1 234 567 8900"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Material Specifications ─────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1.5 border-b border-stone-100">
            <span className="w-5 h-5 rounded-full bg-brand/10 text-brand text-[10px] font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <h4 className="text-[11px] font-bold text-brand uppercase tracking-wider">
              Material Specifications
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Product / Material <span className="text-red-500">*</span>
                </label>
                {productName && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-stone-400 font-medium">
                    <FaLock size={8} /> Selected Product
                  </span>
                )}
              </div>
              <input
                required
                name="product"
                value={formData.product}
                onChange={handleChange}
                readOnly={!!productName}
                placeholder="e.g. Hot Washed Clear PET Flakes"
                className={`${inputCls} ${
                  productName
                    ? "bg-stone-100 text-stone-600 font-medium cursor-not-allowed select-none border-stone-200"
                    : ""
                }`}
              />
            </div>

            <div>
              <label className={labelCls}>Required Grade / Color</label>
              <input
                name="productGrade"
                value={formData.productGrade}
                onChange={handleChange}
                placeholder="e.g. Clear / Light Blue / Green"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>
                Order Quantity (MT) <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 50 MT / Monthly"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Target Technical Parameters</label>
              <input
                name="requiredSpecification"
                value={formData.requiredSpecification}
                onChange={handleChange}
                placeholder="e.g. IV: 0.72–0.76, Moisture < 1%"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Logistics & Incoterms ───────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1.5 border-b border-stone-100">
            <span className="w-5 h-5 rounded-full bg-brand/10 text-brand text-[10px] font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <h4 className="text-[11px] font-bold text-brand uppercase tracking-wider">
              Logistics & Incoterms
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            <div>
              <label className={labelCls}>
                Destination Port <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="destinationPort"
                value={formData.destinationPort}
                onChange={handleChange}
                placeholder="e.g. Hamburg, Los Angeles"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Trade Incoterms</label>
              <select
                name="incoterm"
                value={formData.incoterm}
                onChange={handleChange}
                className={inputCls + " cursor-pointer"}
              >
                <option value="FOB">FOB – Chattogram Port</option>
                <option value="CIF">CIF – Cost, Insurance & Freight</option>
                <option value="CFR">CFR – Cost & Freight</option>
                <option value="EXW">EXW – Ex Works (Factory)</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Target Delivery Timeline</label>
              <input
                name="targetDelivery"
                value={formData.targetDelivery}
                onChange={handleChange}
                placeholder="e.g. Next month / Q3 2026"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Message & Attachment (Rich Text) ─────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1.5 border-b border-stone-100">
            <span className="w-5 h-5 rounded-full bg-brand/10 text-brand text-[10px] font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <h4 className="text-[11px] font-bold text-brand uppercase tracking-wider">
              Additional Details & Technical Sheets
            </h4>
          </div>

          <div>
            <label className={labelCls}>
              Detailed Requirements / Notes <span className="text-red-500">*</span>
            </label>
            <MiniRichTextEditor
              value={formData.message}
              onChange={handleMessageChange}
              placeholder="Please describe any special packaging, lab test certificates required, target price, or specific factory standards..."
              minHeight="min-h-[170px]"
            />
          </div>

          {/* File Attachment */}
          <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded transition-colors cursor-pointer border border-stone-200"
            >
              <FaPaperclip className="text-brand text-xs" />
              <span>{file ? file.name : "Attach Spec / RFQ Document"}</span>
            </button>
            {file && (
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-red-400 hover:text-red-600 p-1 rounded-full transition-colors cursor-pointer"
                title="Remove file"
              >
                <FaTimes size={12} />
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
            />
            <span className="text-[11px] text-stone-400">
              PDF, DOC, XLS or image (up to 10 MB)
            </span>
          </div>
        </div>

        {/* ── SUBMIT ─────────────────────────────────────────── */}
        <div className="pt-2">
          <button
            disabled={submitting}
            type="submit"
            className="w-full py-3 bg-brand hover:bg-brand-light text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Submit Quote Request</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
