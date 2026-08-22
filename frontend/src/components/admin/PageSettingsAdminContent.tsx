"use client";

import { useState, useEffect, useRef } from "react";
import { fetchApi } from "@/lib/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import SafeImage from "@/components/shared/SafeImage";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";

interface ServiceStat {
  _id: string;
  category: string;
  value: string;
  label: string;
}

interface ServiceHeaderData {
  _id?: string;
  category: string;
  headline: string;
  description: string;
}

interface ServiceCategoryItemData {
  _id: string;
  category: string;
  title: string;
  imageUrl: string;
}

interface Props {
  pageKey: string;
  pageTitle: string;
}

export default function PageSettingsAdminContent({ pageKey, pageTitle }: Props) {
  const [stats, setStats] = useState<ServiceStat[]>([]);
  const [header, setHeader] = useState<ServiceHeaderData>({ category: pageKey, headline: "", description: "" });
  const [categoryItems, setCategoryItems] = useState<ServiceCategoryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Stat Modal State
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [submittingStat, setSubmittingStat] = useState(false);
  const [statFormData, setStatFormData] = useState({ value: "", label: "" });

  // Header Modal State
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [submittingHeader, setSubmittingHeader] = useState(false);
  const [headerFormData, setHeaderFormData] = useState({ headline: "", description: "" });

  // Category Item Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [submittingItem, setSubmittingItem] = useState(false);
  const [itemFormData, setItemFormData] = useState({ title: "" });
  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const [itemImagePreview, setItemImagePreview] = useState<string>("");

  const loadData = async () => {
    try {
      const [statsRes, headersRes, itemsRes] = await Promise.all([
        fetchApi("/services"),
        fetchApi("/services/headers"),
        fetchApi("/services/category-items"),
      ]);
      setStats((statsRes.data || []).filter((s: any) => s.category === pageKey));
      const h = (headersRes.data || []).find((h: any) => h.category === pageKey);
      if (h) setHeader(h);
      setCategoryItems((itemsRes.data || []).filter((i: any) => i.category === pageKey));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load page data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pageKey]);

  // Stat Handlers
  const openStatModal = (stat?: ServiceStat) => {
    if (!stat && stats.length >= 4) {
      toast.error(`Maximum 4 stats allowed.`);
      return;
    }
    if (stat) {
      setEditingStatId(stat._id);
      setStatFormData({ value: stat.value, label: stat.label });
    } else {
      setEditingStatId(null);
      setStatFormData({ value: "", label: "" });
    }
    setIsStatModalOpen(true);
  };

  const closeStatModal = () => {
    setIsStatModalOpen(false);
    setEditingStatId(null);
  };

  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingStat(true);
    try {
      if (editingStatId) {
        await fetchApi(`/services/${editingStatId}`, {
          method: "PUT",
          body: JSON.stringify({ ...statFormData, category: pageKey }),
        });
        toast.success("Stat updated successfully.");
      } else {
        await fetchApi("/services", {
          method: "POST",
          body: JSON.stringify({ ...statFormData, category: pageKey }),
        });
        toast.success("Stat added successfully.");
      }
      closeStatModal();
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save stat.");
    } finally {
      setSubmittingStat(false);
    }
  };

  const handleStatDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this stat?")) {
      try {
        await fetchApi(`/services/${id}`, { method: "DELETE" });
        toast.success("Stat deleted successfully.");
        loadData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete stat.");
      }
    }
  };

  // Header Handlers
  const openHeaderModal = () => {
    setHeaderFormData({ headline: header.headline, description: header.description });
    setIsHeaderModalOpen(true);
  };

  const closeHeaderModal = () => setIsHeaderModalOpen(false);

  const handleHeaderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingHeader(true);
    try {
      await fetchApi(`/services/headers/${pageKey}`, {
        method: "PUT",
        body: JSON.stringify(headerFormData),
      });
      toast.success("Header updated successfully.");
      closeHeaderModal();
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update header.");
    } finally {
      setSubmittingHeader(false);
    }
  };

  // Item Handlers
  const openItemModal = (item?: ServiceCategoryItemData) => {
    if (item) {
      setEditingItemId(item._id);
      setItemFormData({ title: item.title });
      setItemImagePreview(item.imageUrl);
    } else {
      setEditingItemId(null);
      setItemFormData({ title: "" });
      setItemImagePreview("");
    }
    setItemImageFile(null);
    setIsItemModalOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
    setEditingItemId(null);
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingItem(true);
    try {
      const fd = new FormData();
      fd.append("title", itemFormData.title);
      fd.append("category", pageKey);
      if (itemImageFile) fd.append("image", itemImageFile);

      if (editingItemId) {
        await fetchApi(`/services/category-items/${editingItemId}`, { method: "PUT", body: fd });
        toast.success("Item updated successfully");
      } else {
        if (!itemImageFile) {
            toast.error("Image is required");
            setSubmittingItem(false);
            return;
        }
        await fetchApi("/services/category-items", { method: "POST", body: fd });
        toast.success("Item added successfully");
      }
      closeItemModal();
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save item.");
    } finally {
      setSubmittingItem(false);
    }
  };

  const handleItemDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await fetchApi(`/services/category-items/${id}`, { method: "DELETE" });
        toast.success("Item deleted successfully");
        loadData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete item.");
      }
    }
  };

  if (loading) return <div className="p-8 text-stone-500">Loading settings...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-serif text-brand font-bold mb-2">{pageTitle}</h1>
        <p className="text-sm text-stone-500">Manage headings, statistics, and highlights for this page.</p>
      </div>

      <div className="admin-card space-y-8">
        
        {/* Header Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-4 mb-4">
            <h2 className="font-serif text-xl font-semibold text-brand">Page Header</h2>
            <button onClick={openHeaderModal} className="admin-btn-secondary w-full sm:w-auto"><FaEdit /> Edit Heading</button>
          </div>
          <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-4">
            <h3 className="font-serif text-lg font-semibold text-brand mt-1">{header.headline || <span className="italic text-stone-400">No heading set</span>}</h3>
            <p className="text-sm text-stone-600 mt-1 leading-relaxed">{header.description || <span className="italic text-stone-400">No subheading set</span>}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
            <h2 className="font-serif text-xl font-semibold text-brand">Key Statistics ({stats.length}/4 Max)</h2>
            <button onClick={() => openStatModal()} disabled={stats.length >= 4} className="admin-btn-primary"><FaPlus /> Add Stat</button>
          </div>

          {stats.length === 0 ? (
            <div className="text-center py-6 text-stone-400 text-sm italic bg-stone-50 rounded border border-dashed border-stone-200">No stats added yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat._id} className="bg-ivory border border-stone-200 rounded-lg p-4 relative group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl font-serif font-bold text-brand">{stat.value}</span>
                      <div className="flex gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openStatModal(stat)} className="admin-btn-icon bg-transparent hover:bg-white"><FaEdit size={14} /></button>
                        <button onClick={() => handleStatDelete(stat._id)} className="admin-btn-icon-danger bg-transparent hover:bg-white"><FaTrash size={14} /></button>
                      </div>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-text-muted font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Highlights Section */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
            <h2 className="font-serif text-xl font-semibold text-brand">Highlights & Processes</h2>
            <button onClick={() => openItemModal()} className="admin-btn-primary"><FaPlus /> Add Highlight</button>
          </div>

          {categoryItems.length === 0 ? (
            <div className="text-center py-6 text-stone-400 text-sm italic bg-stone-50 rounded border border-dashed border-stone-200">No highlights added yet.</div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categoryItems.map((item) => (
                    <tr key={item._id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-16 h-16 relative bg-white flex items-center justify-center rounded-sm border border-stone-200 shadow-sm overflow-hidden">
                          <SafeImage src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-brand">{item.title}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => openItemModal(item)} className="admin-btn-icon mr-2"><FaEdit size={14} /></button>
                        <button onClick={() => handleItemDelete(item._id)} className="admin-btn-icon-danger"><FaTrash size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Header Modal */}
      {isHeaderModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-lg">
            <div className="admin-modal-header">
              <h3 className="font-serif font-semibold text-brand text-lg">Edit Heading & Subheading</h3>
              <button onClick={closeHeaderModal} className="text-stone-400 hover:text-stone-700 p-1"><FaTimes /></button>
            </div>
            <form onSubmit={handleHeaderSubmit}>
              <div className="admin-modal-body space-y-4">
                <div>
                  <label className="admin-label">Section Heading *</label>
                  <input required type="text" value={headerFormData.headline} onChange={(e) => setHeaderFormData({ ...headerFormData, headline: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Section Subheading *</label>
                  <textarea required rows={4} value={headerFormData.description} onChange={(e) => setHeaderFormData({ ...headerFormData, description: e.target.value })} className="admin-input resize-none" />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={closeHeaderModal} className="admin-btn-secondary">Cancel</button>
                <button type="submit" disabled={submittingHeader} className="admin-btn-primary">{submittingHeader ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stat Modal */}
      {isStatModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-md">
            <div className="admin-modal-header">
              <h3 className="font-serif font-semibold text-brand text-lg">{editingStatId ? "Edit Stat" : "Add Stat"}</h3>
              <button onClick={closeStatModal} className="text-stone-400 hover:text-stone-700 p-1"><FaTimes /></button>
            </div>
            <form onSubmit={handleStatSubmit}>
              <div className="admin-modal-body space-y-4">
                <div>
                  <label className="admin-label">Value (e.g. 99%) *</label>
                  <input required type="text" value={statFormData.value} onChange={(e) => setStatFormData({ ...statFormData, value: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Label (e.g. Purity) *</label>
                  <input required type="text" value={statFormData.label} onChange={(e) => setStatFormData({ ...statFormData, label: e.target.value })} className="admin-input" />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={closeStatModal} className="admin-btn-secondary">Cancel</button>
                <button type="submit" disabled={submittingStat} className="admin-btn-primary">{submittingStat ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-md">
            <div className="admin-modal-header">
              <h3 className="font-serif font-semibold text-brand text-lg">{editingItemId ? 'Edit Highlight' : 'Add Highlight'}</h3>
              <button onClick={closeItemModal} className="text-stone-400 hover:text-stone-700 p-2"><FaTimes size={20} /></button>
            </div>
            <form id="itemForm" onSubmit={handleItemSubmit}>
              <div className="admin-modal-body space-y-6">
                <div>
                  <label className="admin-label">Title *</label>
                  <input type="text" required value={itemFormData.title} onChange={e => setItemFormData({ ...itemFormData, title: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Image {!editingItemId && "*"}</label>
                  {itemImagePreview && (
                    <div className="mb-2 relative rounded overflow-hidden border w-full h-32">
                        <SafeImage src={itemImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <AdminUploadButton onFileSelect={file => {
                      if(file) {
                          setItemImageFile(file);
                          setItemImagePreview(URL.createObjectURL(file));
                      }
                  }} selectedFile={itemImageFile} label="Upload Image" />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={closeItemModal} className="admin-btn-secondary">Cancel</button>
                <button type="submit" disabled={submittingItem} className="admin-btn-primary">{submittingItem ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
