"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSpinner, FaTags } from "react-icons/fa";
import { getAuthToken, API_BASE } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

interface Category {
  _id: string;
  name: string;
  description: string;
}

export default function CategoriesAdminContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
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

  const openModal = (category?: Category) => {
    if (category) {
      setEditingId(category._id);
      setFormData({ name: category.name, description: category.description || "" });
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSubmitting(true);
    const url = editingId
      ? `${API_BASE}/categories/${editingId}`
      : `${API_BASE}/categories`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-brand">Product Categories</h1>
          <p className="text-sm text-text-muted mt-1">Manage categories for your product catalog.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="admin-btn-primary w-full sm:w-auto"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="p-16 text-center flex flex-col items-center">
            <FaSpinner className="animate-spin text-3xl text-brand mb-4" />
            <span className="text-stone-500">Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <FaTags className="text-4xl text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-semibold text-brand mb-1">No categories</h3>
            <p className="text-sm text-stone-500">Add a category to categorize your products.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-600">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-4 px-6 font-semibold text-brand">{category.name}</td>
                  <td className="py-4 px-6 text-stone-500">{category.description || "—"}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(category)}
                        className="admin-btn-icon"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="admin-btn-icon-danger"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-md">
            <div className="admin-modal-header">
              <h3 className="font-serif font-semibold text-brand text-lg">
                {editingId ? "Edit Category" : "Add Category"}
              </h3>
              <button
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="admin-input"
                  placeholder="e.g. Textiles"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder="Optional description"
                ></textarea>
              </div>
              <div className="admin-modal-footer justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="admin-btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-btn-primary w-full sm:w-auto"
                >
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
