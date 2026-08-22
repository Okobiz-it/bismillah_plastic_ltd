"use client";

import { useState, useEffect, useRef } from "react";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSpinner,
  FaTags,
  FaSearch,
} from "react-icons/fa";
import { getAuthToken, API_BASE } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import SafeImage from "@/components/shared/SafeImage";

interface Category {
  _id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export default function ProductCategoriesAdminContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const counts = {
    all: categories.length,
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingId(category._id);
      setFormData({
        name: category.name,
        description: category.description || "",
      });
      setImagePreview(category.imageUrl);
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "" });
      setImagePreview("");
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return toast.error("Unauthorized");

    if (!formData.name.trim()) return toast.error("Category name is required");
    if (!editingId && !imageFile) return toast.error("Category image is required");

    setSubmitting(true);

    const fd = new FormData();
    fd.append("name", formData.name.trim());
    if (formData.description) fd.append("description", formData.description);
    if (imageFile) fd.append("image", imageFile);

    const url = editingId ? `${API_BASE}/categories/${editingId}` : `${API_BASE}/categories`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (res.ok) {
        toast.success(editingId ? "Category updated successfully" : "Category created successfully");
        fetchCategories();
        closeModal();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const token = getAuthToken();
    if (!token) return toast.error("Unauthorized");

    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-brand">Product Categories</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage your material categories.
          </p>
        </div>
        <button onClick={() => openModal()} className="admin-btn-primary w-full sm:w-auto">
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-md text-xs focus:ring-2 focus:ring-accent/50 outline-none transition-shadow"
          />
        </div>
      </div>

      {/* Category List View */}
      {loading ? (
        <div className="bg-white rounded-lg border border-stone-200 p-16 text-center flex flex-col items-center">
          <FaSpinner className="animate-spin text-3xl text-brand mb-4" />
          <span className="text-stone-500">Loading categories...</span>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
          <FaTags className="text-4xl text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-semibold text-brand mb-1">No categories found</h3>
          <p className="text-sm text-stone-500">
            {searchQuery ? `No categories matched "${searchQuery}".` : 'Add a category to get started.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
          <div className="admin-table-container border-b-0 rounded-none bg-white">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16 text-center">Image</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <div className="w-12 h-12 rounded-md border border-stone-200 bg-stone-100 overflow-hidden relative mx-auto flex items-center justify-center shrink-0 shadow-2xs">
                        <SafeImage src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-semibold text-brand text-base">
                      {category.name}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 text-xs max-w-sm">
                      {category.description || <span className="text-stone-400 italic">—</span>}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => openModal(category)} className="p-2 text-stone-600 hover:text-brand hover:bg-stone-100 rounded transition-colors" title="Edit">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => handleDelete(category._id)} className="p-2 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-lg">
            <div className="admin-modal-header">
              <h3 className="font-serif font-semibold text-brand text-lg">{editingId ? "Edit Category" : "Add Category"}</h3>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-200 transition-colors">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Category Name *</label>
                <input
                  type="text" required value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="admin-input" placeholder="e.g. PET Flakes"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Category Image {!editingId && "*"}</label>
                {imagePreview && (
                  <div className="relative rounded-lg overflow-hidden border border-stone-200 mb-3">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <button type="button" onClick={removeImage} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                      <FaTimes size={10} />
                    </button>
                  </div>
                )}
                <div>
                  <AdminUploadButton
                    onFileSelect={(file) => {
                      if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                    }}
                    selectedFile={imageFile} label="Upload Image"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={2} className="admin-input resize-none" placeholder="Optional description"
                ></textarea>
              </div>

              <div className="admin-modal-footer justify-end">
                <button type="button" onClick={closeModal} className="admin-btn-secondary w-full sm:w-auto">Cancel</button>
                <button type="submit" disabled={submitting} className="admin-btn-primary w-full sm:w-auto">
                  {submitting && <FaSpinner className="animate-spin" />}
                  {editingId ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
