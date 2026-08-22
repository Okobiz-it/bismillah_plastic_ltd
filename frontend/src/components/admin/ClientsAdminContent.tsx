"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import SafeImage from "@/components/shared/SafeImage";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";

interface ClientData {
  _id: string;
  name: string;
  imageUrl: string;
}

export default function ClientsAdminContent() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadClients = async () => {
    try {
      const res = await fetchApi("/clients");
      setClients(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const openModal = (client?: ClientData) => {
    if (client) {
      setEditingId(client._id);
      setFormData({ name: client.name });
    } else {
      setEditingId(null);
      setFormData({ name: "" });
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
      fd.append("name", formData.name);
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await fetchApi(`/clients/${editingId}`, { method: "PUT", body: fd });
        toast.success("Client updated successfully");
      } else {
        await fetchApi("/clients", { method: "POST", body: fd });
        toast.success("Client added successfully");
      }

      closeModal();
      loadClients();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save client.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      try {
        await fetchApi(`/clients/${id}`, { method: "DELETE" });
        toast.success("Client deleted successfully");
        loadClients();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete client.");
      }
    }
  };

  return (
    <div className="p-4 md:p-5 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-brand">Our Sister Concerns</h3>
          <p className="text-sm text-stone-500 mt-1">Manage the sister concern logos shown on the homepage and about page.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="admin-btn-primary w-full sm:w-auto"
        >
          <FaPlus /> Add Sister Concern
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
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Logo</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Name</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {clients.map((client) => (
                <tr key={client._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-24 h-12 relative bg-white flex items-center justify-center p-2 rounded-sm border border-stone-200 shadow-sm">
                      <SafeImage src={client.imageUrl} alt={client.name} className="max-w-full max-h-full object-contain" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-brand">{client.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openModal(client)} className="admin-btn-icon" title="Edit">
                        <FaEdit size={14} />
                      </button>
                      <button onClick={() => handleDelete(client._id)} className="admin-btn-icon-danger" title="Delete">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-stone-500 bg-stone-50/50">
                    <FaImage className="w-8 h-8 mx-auto text-stone-300 mb-3" />
                    No clients found. Add one to get started.
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
                {editingId ? 'Edit Sister Concern' : 'Add New Sister Concern'}
              </h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-700 transition-colors p-2 cursor-pointer">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <form id="clientForm" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Sister Concern Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. Bismillah Logistics Ltd"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Logo {editingId ? '(Optional)' : <span className="text-red-500">*</span>}
                  </label>
                  <AdminUploadButton
                    onFileSelect={file => setImageFile(file)}
                    selectedFile={imageFile}
                    label="Upload Logo"
                  />
                  <p className="text-xs text-stone-500 mt-1.5">Please upload a high-quality logo with a transparent background (PNG or SVG preferred).</p>
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
                form="clientForm"
                disabled={submitting}
                className="admin-btn-primary w-full sm:w-auto"
              >
                {submitting ? 'Saving...' : 'Save Sister Concern'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
