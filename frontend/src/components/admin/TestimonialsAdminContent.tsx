"use client";

import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSpinner,
  FaQuoteLeft
} from "react-icons/fa";
import { getAuthToken, API_BASE } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import RichTextEditor from "@/components/shared/RichTextEditor";
import RichTextRenderer from "@/components/shared/RichTextRenderer";

interface Testimonial {
  _id: string;
  authorName: string;
  authorTitle: string;
  quote: string;
}

export default function TestimonialsAdminContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  const [formData, setFormData] = useState({
    authorName: "",
    authorTitle: "",
    quote: "",
  });

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_BASE}/testimonials`);
      const data = await res.json();
      setTestimonials(data.data || []);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingId(testimonial._id);
      setFormData({
        authorName: testimonial.authorName,
        authorTitle: testimonial.authorTitle,
        quote: testimonial.quote,
      });
    } else {
      setEditingId(null);
      setFormData({
        authorName: "",
        authorTitle: "",
        quote: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const token = getAuthToken();
    if (!token) {
      toast.error("Unauthorized");
      setSubmitting(false);
      return;
    }

    const url = editingId
      ? `${API_BASE}/testimonials/${editingId}`
      : `${API_BASE}/testimonials`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingId ? "Testimonial updated successfully" : "Testimonial added successfully");
        fetchTestimonials();
        closeModal();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save testimonial");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save testimonial due to a network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")) return;

    const token = getAuthToken();
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Testimonial deleted successfully");
        fetchTestimonials();
      } else {
        toast.error("Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-brand">Testimonials</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage the client testimonials displayed across your website.
          </p>
        </div>

        <div className="w-full md:w-auto mt-4 md:mt-0">
          <button
            onClick={() => openModal()}
            className="admin-btn-primary w-full md:w-auto"
          >
            <FaPlus /> Add New Testimonial
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-lg border border-stone-200 p-16 text-center text-stone-500 flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-3xl text-brand mb-4" />
          <span>Loading testimonials...</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center animate-fadeIn">
          <FaQuoteLeft className="text-4xl text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-semibold text-brand mb-1">No testimonials found</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Get started by adding your first testimonial.
          </p>
        </div>
      ) : (
        <div className="admin-table-container animate-fadeIn bg-white">
          <table className="admin-table">
            <thead>
              <tr>
                  <th className="py-3.5 px-4 w-1/4">Author Details</th>
                  <th className="py-3.5 px-4 w-2/3">Message</th>
                  <th className="py-3.5 px-4 text-right w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <div className="font-semibold text-brand">{testimonial.authorName}</div>
                      <div className="text-xs text-text-muted mt-1">{testimonial.authorTitle}</div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <RichTextRenderer content={testimonial.quote} clampLines={2} className="text-sm text-stone-600 italic" />
                    </td>
                    <td className="py-4 px-4 text-right align-top">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(testimonial)}
                          className="admin-btn-icon"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial._id)}
                          className="admin-btn-icon-danger"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-2xl">
            
            {/* Modal Header */}
            <div className="admin-modal-header">
              <h2 className="text-xl font-serif font-bold text-brand">
                {editingId ? "Edit Testimonial" : "Add New Testimonial"}
              </h2>
              <button
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-700 transition-colors p-2 cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form id="testimonialForm" onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="admin-modal-body space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="admin-input"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      Position / Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.authorTitle}
                      onChange={(e) => setFormData({ ...formData, authorTitle: e.target.value })}
                      className="admin-input"
                      placeholder="e.g. CEO, Example Corp"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                    Message (Quote) <span className="text-red-500">*</span>
                  </label>
                  <RichTextEditor
                    value={formData.quote}
                    onChange={val => setFormData({ ...formData, quote: val })}
                    placeholder="Enter the testimonial message..."
                  />
                </div>
              </div>

            {/* Modal Footer */}
            <div className="admin-modal-footer">
              <button
                type="button"
                onClick={closeModal}
                className="admin-btn-secondary w-full sm:w-auto"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="testimonialForm"
                disabled={submitting}
                className="admin-btn-primary w-full sm:w-auto"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  editingId ? "Update Testimonial" : "Save Testimonial"
                )}
              </button>
            </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
