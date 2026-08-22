"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { FaPlus, FaTrash, FaImages, FaExchangeAlt, FaEdit, FaSave, FaTimes, FaSpinner, FaCheck, FaUpload, FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { fetchApi, uploadFile } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";
import SafeImage from "@/components/shared/SafeImage";

interface InfrastructureItem {
  _id: string;
  imageUrl: string;
  caption?: string;
  order: number;
}

const ITEMS_PER_PAGE = 20;

export default function InfrastructureAdminContent() {
  const [infraItems, setInfraItems] = useState<InfrastructureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingInfra, setUploadingInfra] = useState(false);
  const [infraFiles, setInfraFiles] = useState<File[]>([]);
  const [infraPreviews, setInfraPreviews] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<InfrastructureItem | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const loadInfrastructure = async () => {
    try {
      const res = await fetchApi("/network/infrastructure");
      setInfraItems(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load infrastructure gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInfrastructure();
  }, []);

  const handleSelectInfraFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    setInfraFiles(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setInfraPreviews(urls);
  };

  const handleUploadInfra = async () => {
    if (infraFiles.length === 0) return;
    setUploadingInfra(true);

    try {
      const formData = new FormData();
      infraFiles.forEach((file) => {
        formData.append("images", file);
      });

      await uploadFile("/network/infrastructure", formData);
      toast.success(`${infraFiles.length} image(s) uploaded successfully`);
      setInfraFiles([]);
      setInfraPreviews([]);
      loadInfrastructure();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload images");
    } finally {
      setUploadingInfra(false);
    }
  };

  const handleMoveInfra = async (globalIndex: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? globalIndex - 1 : globalIndex + 1;
    if (targetIndex < 0 || targetIndex >= infraItems.length) return;

    const newItems = [...infraItems];
    const [moved] = newItems.splice(globalIndex, 1);
    newItems.splice(targetIndex, 0, moved);
    setInfraItems(newItems);

    try {
      await fetchApi("/network/infrastructure/reorder", {
        method: "PUT",
        body: JSON.stringify({ ids: newItems.map((item) => item._id) }),
      });
      toast.success("Gallery reordered");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reorder images");
      loadInfrastructure();
    }
  };

  const handleDeleteInfra = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery photo?")) return;
    try {
      await fetchApi(`/network/infrastructure/${id}`, { method: "DELETE" });
      toast.success("Gallery photo deleted");
      loadInfrastructure();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete gallery photo");
    }
  };

  // Open Edit Modal
  const openEditModal = (item: InfrastructureItem) => {
    setEditingItem(item);
    setEditLabel(item.caption || "");
    setEditFile(null);
    setEditPreview(null);
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setEditLabel("");
    setEditFile(null);
    setEditPreview(null);
  };

  const handleSelectEditFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditFile(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSavingEdit(true);

    try {
      const formData = new FormData();
      if (editFile) {
        formData.append("image", editFile);
      }
      formData.append("caption", editLabel);

      await uploadFile(`/network/infrastructure/${editingItem._id}`, formData, "PUT");
      toast.success("Photo & label updated successfully!");
      closeEditModal();
      loadInfrastructure();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update photo details");
    } finally {
      setSavingEdit(false);
    }
  };

  const totalPages = Math.ceil(infraItems.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = infraItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-4 md:p-5 space-y-4">
      {/* Hidden Add File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleSelectInfraFiles}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-base font-semibold text-brand flex items-center gap-2">
            <FaImages className="text-gold" /> Gallery Photos
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Upload and manage photos & labels for the gallery showcase.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {infraItems.length} Photo{infraItems.length !== 1 ? "s" : ""} Total
          </span>

          <AdminUploadButton
            label="Upload Photos"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onMultipleFilesSelect={(files) => {
              setInfraFiles(files);
              const urls = files.map((file) => URL.createObjectURL(file));
              setInfraPreviews(urls);
            }}
          />
        </div>
      </div>

      {/* Selected File Previews (Pending Upload) */}
      {infraPreviews.length > 0 && (
        <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              {infraPreviews.length} Photo{infraPreviews.length > 1 ? "s" : ""} Selected
            </h4>
            <div className="flex gap-2">
              <button
                onClick={handleUploadInfra}
                disabled={uploadingInfra}
                className="admin-btn-primary !px-3 !py-1 !text-xs"
              >
                {uploadingInfra ? <FaSpinner className="animate-spin" /> : <FaCheck />} Upload Now
              </button>
              <button
                onClick={() => { setInfraFiles([]); setInfraPreviews([]); }}
                disabled={uploadingInfra}
                className="admin-btn-secondary !px-2.5 !py-1 !text-xs"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
            {infraPreviews.map((url, i) => (
              <div key={i} className="relative aspect-square rounded overflow-hidden border border-stone-300 bg-stone-100">
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Images Compact Gallery Grid */}
      {loading ? (
        <div className="py-6 flex justify-center">
          <div className="w-6 h-6 border-3 border-stone-200 border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : infraItems.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="text-center py-8 px-4 border-2 border-dashed border-stone-200 hover:border-brand rounded-lg bg-stone-50/50 cursor-pointer transition-colors"
        >
          <FaUpload className="text-2xl text-stone-400 mx-auto mb-1.5" />
          <p className="text-xs font-semibold text-stone-700">No gallery photos uploaded yet.</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Click here to upload high-resolution photos.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {paginatedItems.map((item, localIndex) => {
              const globalIndex = startIndex + localIndex;
              return (
                <div
                  key={item._id}
                  className="admin-card !p-0 overflow-hidden group relative hover:shadow-md transition-all flex flex-col bg-white border border-stone-200"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.caption || `Gallery photo ${globalIndex + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteInfra(item._id)}
                      disabled={uploadingInfra}
                      className="absolute top-1.5 right-1.5 p-1 bg-white/90 hover:bg-rose-600 text-stone-600 hover:text-white rounded-full shadow-xs transition-colors cursor-pointer"
                      title="Delete Photo"
                    >
                      <FaTrash className="text-[10px]" />
                    </button>
                  </div>

                  {/* Photo Label Display Box */}
                  <div className="px-2 py-2 bg-white text-center border-t border-stone-100 min-h-[36px] flex items-center justify-center">
                    <span className="font-serif font-bold text-xs text-brand truncate max-w-full">
                      {item.caption || <span className="text-stone-300 font-sans font-normal italic text-[11px]">No label</span>}
                    </span>
                  </div>

                  {/* Footer Toolbar with Edit & Reorder */}
                  <div className="px-2 py-1.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-1 mt-auto">
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleMoveInfra(globalIndex, "left")}
                        disabled={globalIndex === 0}
                        title="Move Left"
                        className="p-1 text-stone-600 hover:text-brand hover:bg-stone-200 rounded disabled:opacity-25 cursor-pointer"
                      >
                        <FaArrowLeft className="text-[10px]" />
                      </button>
                      <button
                        onClick={() => handleMoveInfra(globalIndex, "right")}
                        disabled={globalIndex === infraItems.length - 1}
                        title="Move Right"
                        className="p-1 text-stone-600 hover:text-brand hover:bg-stone-200 rounded disabled:opacity-25 cursor-pointer"
                      >
                        <FaArrowRight className="text-[10px]" />
                      </button>
                    </div>

                    <button
                      onClick={() => openEditModal(item)}
                      className="text-[11px] font-bold text-brand hover:bg-brand/10 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <FaEdit className="text-[10px]" /> Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-200 pt-4 mt-4">
              <p className="text-xs text-stone-500">
                Showing <span className="font-semibold text-brand">{startIndex + 1}</span> to{" "}
                <span className="font-semibold text-brand">
                  {Math.min(startIndex + ITEMS_PER_PAGE, infraItems.length)}
                </span>{" "}
                of <span className="font-semibold text-brand">{infraItems.length}</span> photos
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 text-xs font-semibold rounded border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-stone-700"
                >
                  <FaChevronLeft size={10} /> Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 text-xs font-bold rounded transition-colors ${
                        currentPage === pageNum
                          ? "bg-brand text-white"
                          : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 text-xs font-semibold rounded border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-stone-700"
                >
                  Next <FaChevronRight size={10} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* EDIT PHOTO & LABEL MODAL */}
      {editingItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-md">
            <div className="admin-modal-header">
              <h2 className="text-lg font-serif font-bold text-brand flex items-center gap-2">
                <FaEdit className="text-gold" /> Edit Photo & Label
              </h2>
              <button onClick={closeEditModal} className="admin-modal-close">
                <FaTimes />
              </button>
            </div>

            <form id="editPhotoForm" onSubmit={handleSaveEdit} className="admin-modal-body space-y-4">
              {/* Photo Preview & Change Image */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                  Photo Image
                </label>
                <div className="relative h-44 sm:h-52 w-full rounded-lg overflow-hidden border border-stone-300 bg-stone-900 mb-2">
                  <img
                    src={editPreview || editingItem.imageUrl}
                    alt="Photo Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <AdminUploadButton
                  label="Upload Image"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onFileSelect={(file) => {
                    if (file) {
                      setEditFile(file);
                      setEditPreview(URL.createObjectURL(file));
                    }
                  }}
                  selectedFile={editFile}
                  compact
                  className="w-full justify-center"
                />
              </div>

              {/* Photo Label Input */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                  Photo Label / Title
                </label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="e.g. Electronics, Spices, Machinery..."
                  className="admin-input font-serif font-bold text-brand text-base"
                  maxLength={60}
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  This label will appear centered in bold green font below the photo.
                </p>
              </div>
            </form>

            <div className="admin-modal-footer">
              <button
                type="button"
                onClick={closeEditModal}
                className="admin-btn-secondary"
                disabled={savingEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="editPhotoForm"
                disabled={savingEdit}
                className="admin-btn-primary"
              >
                {savingEdit ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <FaCheck /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}