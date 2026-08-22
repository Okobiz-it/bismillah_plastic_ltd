"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCertificate } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import SafeImage from "@/components/shared/SafeImage";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";

interface Cert {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function CertificationsAdminContent() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadCerts = async () => {
    try {
      const res = await fetchApi("/certifications");
      setCerts(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const openModal = (cert?: Cert) => {
    if (cert) {
      setEditingId(cert._id);
      setFormData({ title: cert.title, description: cert.description });
    } else {
      setEditingId(null);
      setFormData({ title: "", description: "" });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await fetchApi(`/certifications/${editingId}`, { method: "PUT", body: fd });
        toast.success("Certification updated successfully");
      } else {
        await fetchApi("/certifications", { method: "POST", body: fd });
        toast.success("Certification added successfully");
      }

      closeModal();
      loadCerts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save certification.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      try {
        await fetchApi(`/certifications/${id}`, { method: "DELETE" });
        toast.success("Certification deleted successfully");
        loadCerts();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete certification.");
      }
    }
  };

  return (
    <div className="p-4 md:p-6 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-brand">Certifications</h3>
          <p className="text-sm text-stone-500 mt-1">Manage ISO and other compliance certificates.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="admin-btn-primary w-full sm:w-auto"
        >
          <FaPlus /> Add Certification
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-stone-200 border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead className="bg-stone-50">
              <tr className="border-b border-stone-200">
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Image</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Title</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Description</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {certs.map((cert) => (
                <tr key={cert._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-16 h-16 relative bg-white flex items-center justify-center p-1 rounded-sm border border-stone-200 shadow-sm">
                      <SafeImage src={cert.imageUrl} alt={cert.title} className="max-w-full max-h-full object-contain" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-brand">{cert.title}</td>
                  <td className="py-3 px-4 text-sm text-stone-600 max-w-xs truncate">{cert.description}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openModal(cert)} className="admin-btn-icon" title="Edit">
                        <FaEdit size={14} />
                      </button>
                      <button onClick={() => handleDelete(cert._id)} className="admin-btn-icon-danger" title="Delete">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {certs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-500 bg-stone-50/50">
                    <FaCertificate className="w-8 h-8 mx-auto text-stone-300 mb-3" />
                    No certifications found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-md">
            <div className="admin-modal-header">
              <h2 className="text-xl font-serif font-bold text-brand">
                {editingId ? 'Edit Certification' : 'Add New Certification'}
              </h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-700 transition-colors p-2 cursor-pointer">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <form id="certForm" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. ISO 9001:2015"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="admin-input h-24 resize-none"
                    placeholder="Describe the certification..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Image {editingId ? '(Optional)' : <span className="text-red-500">*</span>}
                  </label>
                  <AdminUploadButton
                    onFileSelect={file => setImageFile(file)}
                    selectedFile={imageFile}
                    label="Upload Image"
                  />
                </div>
              </form>
            </div>

            <div className="admin-modal-footer justify-end">
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
                form="certForm"
                disabled={submitting}
                className="admin-btn-primary w-full sm:w-auto"
              >
                {submitting ? 'Saving...' : 'Save Certification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
