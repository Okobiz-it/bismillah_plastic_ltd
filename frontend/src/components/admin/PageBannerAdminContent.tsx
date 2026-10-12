"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { PageBannerConfig } from "@/lib/pageBanners";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";
import {
  FaSave,
  FaUndo,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaImage,
} from "react-icons/fa";

interface Props {
  config: PageBannerConfig;
}

export default function PageBannerAdminContent({ config }: Props) {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Form states
  const [title, setTitle] = useState(config.defaultData.title);
  const [subtitle, setSubtitle] = useState(config.defaultData.subtitle);
  const [description, setDescription] = useState(config.defaultData.description);
  const [imageUrl, setImageUrl] = useState(config.defaultData.imageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCustom, setIsCustom] = useState(false);

  // Create temporary blob URL for newly selected file
  const filePreviewUrl = useMemo(() => {
    if (selectedFile) {
      try {
        return URL.createObjectURL(selectedFile);
      } catch {
        return null;
      }
    }
    return null;
  }, [selectedFile]);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const activeDisplayImage = filePreviewUrl || imageUrl || config.defaultData.imageUrl;

  // Load banner from API
  const loadBanner = async () => {
    setLoading(true);
    try {
      const res = await fetchApi(`/page-banners/${config.pageKey}`);
      if (res && res.data) {
        const d = res.data;
        setTitle(d.title || config.defaultData.title);
        setSubtitle(d.subtitle || config.defaultData.subtitle);
        setDescription(d.description || config.defaultData.description);
        setImageUrl(d.imageUrl || config.defaultData.imageUrl);
        setIsCustom(Boolean(d.isCustom));
      }
    } catch (err: any) {
      console.error("Failed to load page banner:", err);
      setTitle(config.defaultData.title);
      setSubtitle(config.defaultData.subtitle);
      setDescription(config.defaultData.description);
      setImageUrl(config.defaultData.imageUrl);
      setIsCustom(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanner();
  }, [config.pageKey]);

  // Save changes
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("description", description);

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else {
        formData.append("imageUrl", imageUrl);
      }

      const res = await fetchApi(`/page-banners/${config.pageKey}`, {
        method: "PUT",
        body: formData,
      });

      if (res && res.data) {
        setImageUrl(res.data.imageUrl || imageUrl);
        setIsCustom(true);
        setSelectedFile(null);
        toast.success(`${config.label} banner saved successfully!`);
      } else {
        toast.success("Banner updated successfully!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save banner.");
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to reset the ${config.label} banner back to system default values? Custom uploaded banner and text will be reverted.`
    );
    if (!confirmed) return;

    setResetting(true);
    try {
      await fetchApi(`/page-banners/${config.pageKey}`, {
        method: "DELETE",
      });

      setTitle(config.defaultData.title);
      setSubtitle(config.defaultData.subtitle);
      setDescription(config.defaultData.description);
      setImageUrl(config.defaultData.imageUrl);
      setSelectedFile(null);
      setIsCustom(false);

      toast.success(`${config.label} banner reset to default!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to reset banner.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16">
      {/* ── Page Header matching /business-operations ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <FaImage /> Banners / {config.label}
          </div>
          <h1 className="text-2xl font-serif font-bold text-brand leading-tight">
            {config.adminTitle}
          </h1>
          <p className="text-sm text-stone-500 mt-1">{config.adminDescription}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={config.publicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-secondary !rounded-[4px] text-xs flex items-center gap-1.5"
          >
            <FaExternalLinkAlt className="text-xs" />
            <span>View Live Page</span>
          </Link>

          {/* TOP PRIMARY SAVE BUTTON */}
          <button
            type="submit"
            form="pageBannerForm"
            disabled={saving || loading}
            className="admin-btn-primary !rounded-[4px] text-xs flex items-center gap-1.5 cursor-pointer"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaSave className="text-xs" />
            )}
            <span>{saving ? "Saving Changes..." : "Save Banner"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-card p-12 text-center text-stone-500">
          <div className="w-8 h-8 border-4 border-stone-200 border-t-brand rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">Loading banner configuration...</p>
        </div>
      ) : (
        /* ── Banner Configuration Form ── */
        <form
          id="pageBannerForm"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
            {/* Left 2 Columns: Text Upon Banners */}
            <div className="lg:col-span-2">
              <div className="admin-card p-5 sm:p-6 space-y-4">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="text-base font-bold text-brand font-serif">Text Upon Banner</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Customize the badge subtitle, main title, and descriptive text rendered on this
                    page's hero section.
                  </p>
                </div>

                {/* Subtitle / Eyebrow */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Badge / Eyebrow Subtitle
                    </label>
                    <span className="text-[11px] text-stone-400">Shown above headline</span>
                  </div>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. ABOUT US"
                    className="admin-input !rounded-[4px]"
                  />
                </div>

                {/* Title / Headline */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Main Headline / Title <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-stone-400">{title.length} chars</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Driving the Circular Plastics Economy"
                    className="admin-input !rounded-[4px] font-semibold text-stone-900"
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Banner Subtext / Description
                    </label>
                    <span className="text-[11px] text-stone-400">
                      {description.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a clear, concise overview summary..."
                    className="admin-input !rounded-[4px] resize-y leading-relaxed text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Right 1 Column: Banner Image & Controls */}
            <div className="space-y-4">
              <div className="admin-card p-5 sm:p-6 space-y-4">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-brand font-serif">Banner Image</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Single hero background image.</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-200">
                    1 Banner
                  </span>
                </div>

                {/* Image Preview Box */}
                <div className="space-y-2">
                  <div className="relative aspect-[16/9] w-full rounded-[4px] overflow-hidden border border-stone-200 bg-stone-100 shadow-inner group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeDisplayImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />

                    {selectedFile && (
                      <div className="absolute top-2 left-2 bg-brand/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px] shadow">
                        Selected: {selectedFile.name.slice(0, 18)}
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-500 leading-normal flex items-start gap-1.5">
                    <FaInfoCircle className="text-brand shrink-0 mt-0.5 text-xs" />
                    <span>
                      Recommended: <strong>1920 × 1080px</strong> (WEBP, JPG, PNG).
                    </span>
                  </p>
                </div>

                {/* Upload Button */}
                <div>
                  <AdminUploadButton
                    onFileSelect={(file) => setSelectedFile(file)}
                    selectedFile={selectedFile}
                    label={selectedFile ? "Change Image" : "Upload Banner Image"}
                    roundedClassName="rounded-[4px]"
                  />
                </div>
              </div>

              {/* Bottom Submit Card */}
              <div className="admin-card p-4 space-y-2">
                <button
                  type="submit"
                  disabled={saving || loading}
                  className="admin-btn-primary w-full py-2.5 text-sm !rounded-[4px] shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FaSave />
                  <span>{saving ? "Saving Changes..." : "Save Banner"}</span>
                </button>

                <p className="text-center text-[11px] text-stone-400">
                  Changes immediately reflect on{" "}
                  <code className="text-brand font-mono font-medium">{config.publicPath}</code>
                </p>
              </div>
            </div>
          </form>
      )}
    </div>
  );
}
