"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaLeaf, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import SafeImage from "@/components/shared/SafeImage";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";

interface RawMaterialData {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  order: number;
}

export default function RawMaterialsAdminContent() {
  const [rawMaterials, setRawMaterials] = useState<RawMaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadRawMaterials = async () => {
    try {
      const res = await fetchApi("/raw-materials");
      setRawMaterials(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRawMaterials();
  }, []);

  const openModal = (item?: RawMaterialData) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        name: item.name,
        description: item.description || "",
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "" });
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
      fd.append("description", formData.description);
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await fetchApi(`/raw-materials/${editingId}`, { method: "PUT", body: fd });
        toast.success("Raw material updated successfully");
      } else {
        await fetchApi("/raw-materials", { method: "POST", body: fd });
        toast.success("Raw material added successfully");
      }

      closeModal();
      loadRawMaterials();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save raw material.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this raw material?")) {
      try {
        await fetchApi(`/raw-materials/${id}`, { method: "DELETE" });
        toast.success("Raw material deleted successfully");
        loadRawMaterials();
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to delete raw material.");
      }
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newItems = [...rawMaterials];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;

    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];

    const reorderPayload = newItems.map((item, i) => ({ _id: item._id, order: i }));

    try {
      await fetchApi("/raw-materials/reorder", {
        method: "PUT",
        body: JSON.stringify({ items: reorderPayload }),
      });
      setRawMaterials(newItems.map((item, i) => ({ ...item, order: i })));
      toast.success("Order updated");
    } catch (error: any) {
      toast.error("Failed to reorder.");
    }
  };

  return (
    <div className="admin-card">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 p-0 md:p-0">
        <div>
          <h3 className="text-lg font-semibold text-brand">All Raw Materials</h3>
          <p className="text-sm text-stone-500 mt-1">
            {rawMaterials.length} raw material{rawMaterials.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="admin-btn-primary w-full sm:w-auto"
        >
          <FaPlus /> Add Raw Material
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
                  <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600 w-12">Order</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Image</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Name</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600 hidden md:table-cell">Description</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rawMaterials.map((item, index) => (
                  <tr key={item._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0}
                          className="text-stone-400 hover:text-brand disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          aria-label="Move up"
                        >
                          <FaArrowUp size={11} />
                        </button>
                        <button
                          onClick={() => handleMove(index, "down")}
                          disabled={index === rawMaterials.length - 1}
                          className="text-stone-400 hover:text-brand disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          aria-label="Move down"
                        >
                          <FaArrowDown size={11} />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-16 h-12 relative bg-white flex items-center justify-center rounded-sm border border-stone-200 shadow-sm overflow-hidden">
                        <SafeImage src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-brand">{item.name}</td>
                    <td className="py-3 px-4 text-sm text-stone-600 hidden md:table-cell max-w-xs truncate">{item.description}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openModal(item)} className="admin-btn-icon" title="Edit">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="admin-btn-icon-danger" title="Delete">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rawMaterials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-500 bg-stone-50/50">
                      <FaLeaf className="w-8 h-8 mx-auto text-stone-300 mb-3" />
                      No raw materials found. Add one to get started.
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
          <div className="admin-modal-content max-w-lg">
            <div className="admin-modal-header">
              <h2 className="text-xl font-serif font-bold text-brand">
                {editingId ? "Edit Raw Material" : "Add New Raw Material"}
              </h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-700 transition-colors p-2 cursor-pointer">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <form id="rawMaterialForm" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. PET Bottles"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-semibold text-stone-700">
                      Description
                    </label>
                    <span className={`text-xs ${formData.description.length >= 250 ? 'text-red-500 font-bold' : 'text-stone-400'}`}>
                      {formData.description.length}/250
                    </span>
                  </div>
                  <textarea
                    maxLength={250}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 250) })}
                    className="admin-input h-24 resize-y"
                    placeholder="Short description of this raw material (max 250 characters)..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Image {editingId ? "(Optional)" : <span className="text-red-500">*</span>}
                  </label>
                  <AdminUploadButton
                    onFileSelect={(file) => setImageFile(file)}
                    selectedFile={imageFile}
                    label="Upload Image"
                  />
                  <p className="text-xs text-stone-500 mt-1.5">Upload a clear photo of the raw material.</p>
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
                form="rawMaterialForm"
                disabled={submitting}
                className="admin-btn-primary w-full sm:w-auto"
              >
                {submitting ? "Saving..." : "Save Raw Material"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
