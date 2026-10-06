"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { FaPlus, FaTrash, FaTimes, FaImage, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import SafeImage from "@/components/shared/SafeImage";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";

interface BannerData {
  _id: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
}

export default function HomeBannersAdminContent() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadBanners = async () => {
    try {
      const res = await fetchApi("/home/banners");
      setBanners(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openModal = () => {
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("image", imageFile);

      await fetchApi("/home/banners", { method: "POST", body: fd });
      toast.success("Banner added successfully");

      closeModal();
      loadBanners();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save banner.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await fetchApi(`/home/banners/${id}`, { method: "DELETE" });
        toast.success("Banner deleted successfully");
        loadBanners();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete banner.");
      }
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await fetchApi(`/home/banners/${id}/toggle`, { method: "PATCH" });
      loadBanners();
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle status.");
    }
  };

  return (
    <div className="p-4 md:p-5 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-brand">Home Banners</h3>
          <p className="text-sm text-stone-500 mt-1">Manage the image sliders shown on the homepage hero section.</p>
        </div>
        <button
          onClick={openModal}
          className="admin-btn-primary w-full sm:w-auto"
        >
          <FaPlus /> Add Banner
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
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Status</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {banners.map((banner) => (
                <tr key={banner._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-40 h-20 relative bg-stone-200 flex items-center justify-center rounded-sm overflow-hidden border border-stone-200 shadow-sm">
                      <SafeImage src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleActive(banner._id)}
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                        banner.isActive
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                      }`}
                    >
                      {banner.isActive ? <FaCheckCircle /> : <FaRegCircle />}
                      {banner.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleDelete(banner._id)} className="admin-btn-icon-danger" title="Delete">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-stone-500 bg-stone-50/50">
                    <FaImage className="w-8 h-8 mx-auto text-stone-300 mb-3" />
                    No banners found. Add one to get started.
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
                Add New Banner
              </h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-700 transition-colors p-2 cursor-pointer">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <form id="bannerForm" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Banner Image <span className="text-red-500">*</span>
                  </label>
                  <AdminUploadButton
                    onFileSelect={file => setImageFile(file)}
                    selectedFile={imageFile}
                    label="Upload Banner Image"
                  />
                  <p className="text-xs text-stone-500 mt-1.5">Please upload a high-quality landscape image (1920x1080 recommended).</p>
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
                form="bannerForm"
                disabled={submitting}
                className="admin-btn-primary w-full sm:w-auto"
              >
                {submitting ? 'Saving...' : 'Upload Banner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
