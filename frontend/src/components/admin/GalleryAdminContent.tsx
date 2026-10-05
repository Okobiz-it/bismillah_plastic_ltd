"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { fetchApi, uploadFile } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";
import {
  PhotoItem,
  VideoItem,
  MediaSettings,
  PhotoCategoryKey,
  VideoCategoryKey,
  PHOTO_CATEGORIES,
  VIDEO_CATEGORIES,
} from "@/data/mediaData";
import {
  FaImages,
  FaVideo,
  FaCog,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaSpinner,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaExchangeAlt,
  FaUpload,
  FaExternalLinkAlt,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaImage,
  FaExpand,
  FaCompress,
} from "react-icons/fa";

type TabType = "photos" | "videos" | "settings";

const DEFAULT_SETTINGS: MediaSettings = {
  heading: "Photos & Videos Showcase",
  subheading:
    "A structured visual narrative illustrating our journey — from grassroots collection and women-led centers to industrial mechanical recycling and community impact.",
  heroImageUrl: "",
};

export default function GalleryAdminContent() {
  const [activeTab, setActiveTab] = useState<TabType>("photos");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const adminVideoModalRef = useRef<HTMLDivElement>(null);
  const [isAdminFullscreen, setIsAdminFullscreen] = useState(false);

  const handleToggleAdminFullscreen = () => {
    const el = adminVideoModalRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleAdminFsChange = () => {
      setIsAdminFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleAdminFsChange);
    document.addEventListener("webkitfullscreenchange", handleAdminFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleAdminFsChange);
      document.removeEventListener("webkitfullscreenchange", handleAdminFsChange);
    };
  }, []);

  // ─── PHOTOS STATE ──────────────────────────────────────────────────────────
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [photoFilter, setPhotoFilter] = useState<"all" | PhotoCategoryKey>("all");
  const [uploadCategory, setUploadCategory] = useState<PhotoCategoryKey>("plant-processing");
  const [uploadCaption, setUploadCaption] = useState("");
  const [selectedPhotoFiles, setSelectedPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  // Photo Edit Modal State
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [editPhotoCaption, setEditPhotoCaption] = useState("");
  const [editPhotoCategory, setEditPhotoCategory] = useState<PhotoCategoryKey>("plant-processing");
  const [savingPhotoEdit, setSavingPhotoEdit] = useState(false);

  // ─── VIDEOS STATE ──────────────────────────────────────────────────────────
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [videoFilter, setVideoFilter] = useState<"all" | VideoCategoryKey>("all");

  // Video Add / Edit Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [videoForm, setVideoForm] = useState<{
    title: string;
    description: string;
    category: VideoCategoryKey;
    videoUrl: string;
    thumbnailUrl: string;
    duration: string;
  }>({
    title: "",
    description: "",
    category: "operational-walkthrough",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
  });
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);
  const [videoThumbnailPreview, setVideoThumbnailPreview] = useState<string>("");
  const [savingVideo, setSavingVideo] = useState(false);
  const [uploadingVideoFile, setUploadingVideoFile] = useState(false);

  // Video Preview Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // ─── SETTINGS STATE ────────────────────────────────────────────────────────
  const [settings, setSettings] = useState<MediaSettings>(DEFAULT_SETTINGS);
  const [settingsDraft, setSettingsDraft] = useState<MediaSettings>(DEFAULT_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  // ─── LOAD DATA ─────────────────────────────────────────────────────────────
  const loadAllData = async () => {
    try {
      const [photosRes, videosRes, settingsRes] = await Promise.allSettled([
        fetchApi("/media/photos"),
        fetchApi("/media/videos"),
        fetchApi("/settings/gallery"),
      ]);

      if (photosRes.status === "fulfilled" && photosRes.value?.data) {
        setPhotos(photosRes.value.data);
      }
      if (videosRes.status === "fulfilled" && videosRes.value?.data) {
        setVideos(videosRes.value.data);
      }
      if (settingsRes.status === "fulfilled" && settingsRes.value?.data) {
        setSettings({ ...DEFAULT_SETTINGS, ...settingsRes.value.data });
        setSettingsDraft({ ...DEFAULT_SETTINGS, ...settingsRes.value.data });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load media assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    return () => {
      // Clean up any remaining preview URLs on unmount
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // ─── PHOTO HANDLERS ────────────────────────────────────────────────────────
  const handlePhotoFilesSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // Revoke previous object URLs to prevent memory leaks
    photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    const files = Array.from(e.target.files);
    setSelectedPhotoFiles(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotoPreviews(urls);
  };

  const handleUploadPhotos = async () => {
    if (selectedPhotoFiles.length === 0) {
      toast.error("Please select at least one photo to upload");
      return;
    }
    setUploadingPhotos(true);
    try {
      const formData = new FormData();
      selectedPhotoFiles.forEach((file) => formData.append("images", file));
      formData.append("category", uploadCategory);
      if (uploadCaption) formData.append("caption", uploadCaption);

      await uploadFile("/media/photos", formData);
      toast.success(`${selectedPhotoFiles.length} photo(s) uploaded successfully!`);
      // Revoke preview URLs after upload
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
      setSelectedPhotoFiles([]);
      setPhotoPreviews([]);
      setUploadCaption("");
      // reload photos
      const res = await fetchApi("/media/photos");
      setPhotos(res.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload photos");
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleOpenEditPhoto = (photo: PhotoItem) => {
    setEditingPhoto(photo);
    setEditPhotoCaption(photo.caption || "");
    setEditPhotoCategory(photo.category);
  };

  const handleSavePhotoEdit = async () => {
    if (!editingPhoto?._id) return;
    setSavingPhotoEdit(true);
    try {
      await fetchApi(`/media/photos/${editingPhoto._id}`, {
        method: "PUT",
        body: JSON.stringify({
          caption: editPhotoCaption,
          category: editPhotoCategory,
        }),
      });
      toast.success("Photo details updated!");
      setEditingPhoto(null);
      const res = await fetchApi("/media/photos");
      setPhotos(res.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to update photo");
    } finally {
      setSavingPhotoEdit(false);
    }
  };

  const handleDeletePhoto = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to permanently delete this photo?")) return;
    try {
      await fetchApi(`/media/photos/${id}`, { method: "DELETE" });
      toast.success("Photo permanently deleted");
      setPhotos((prev) => prev.filter((p) => p._id !== id));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("media_updated"));
        localStorage.setItem("media_last_updated", Date.now().toString());
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete photo");
    }
  };

  const handleMovePhoto = async (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredPhotos.length) return;

    const newPhotos = [...filteredPhotos];
    const [moved] = newPhotos.splice(index, 1);
    newPhotos.splice(targetIndex, 0, moved);

    // Reorder IDs
    try {
      await fetchApi("/media/photos/reorder", {
        method: "PUT",
        body: JSON.stringify({ ids: newPhotos.map((p) => p._id) }),
      });
      // reload
      const res = await fetchApi("/media/photos");
      setPhotos(res.data || []);
      toast.success("Photo order updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to reorder photos");
    }
  };

  const filteredPhotos =
    photoFilter === "all" ? photos : photos.filter((p) => p.category === photoFilter);

  // ─── VIDEO HANDLERS ────────────────────────────────────────────────────────
  const handleOpenAddVideo = () => {
    setEditingVideo(null);
    setVideoForm({
      title: "",
      description: "",
      category: "operational-walkthrough",
      videoUrl: "",
      thumbnailUrl: "",
      duration: "",
    });
    setVideoThumbnailFile(null);
    setVideoThumbnailPreview("");
    setIsVideoModalOpen(true);
  };

  const handleOpenEditVideo = (video: VideoItem) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      description: video.description,
      category: video.category,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || "",
      duration: video.duration || "",
    });
    setVideoThumbnailFile(null);
    setVideoThumbnailPreview(video.thumbnailUrl || "");
    setIsVideoModalOpen(true);
  };

  const handleVideoFileUpload = async (file: File | null) => {
    if (!file) return;

    const MAX_VIDEO_SIZE = 1024 * 1024 * 1024; // 1GB maximum size limit
    if (file.size > MAX_VIDEO_SIZE) {
      toast.error("Video exceeds the 1GB maximum file limit. Please select a video under 1GB.");
      return;
    }

    // 1. Client-side duration extraction via HTML5 Video element
    try {
      const tempVideo = document.createElement("video");
      tempVideo.preload = "metadata";
      tempVideo.src = URL.createObjectURL(file);
      tempVideo.onloadedmetadata = () => {
        window.URL.revokeObjectURL(tempVideo.src);
        const mins = Math.floor(tempVideo.duration / 60);
        const secs = Math.floor(tempVideo.duration % 60);
        const formatted = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
        setVideoForm((prev) => ({ ...prev, duration: formatted }));
      };
    } catch (err) {
      console.warn("Client duration extraction error:", err);
    }

    // 2. Upload video file to Cloudinary through backend endpoint with compression & optimization
    setUploadingVideoFile(true);
    try {
      const formData = new FormData();
      formData.append("video", file);
      const res = await uploadFile("/media/videos/upload", formData);
      if (res.data?.videoUrl) {
        setVideoForm((prev) => ({
          ...prev,
          videoUrl: res.data.videoUrl,
          duration: prev.duration || res.data.duration || "",
        }));
        toast.success("Video compressed, optimized and uploaded to Cloudinary successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload video to Cloudinary");
    } finally {
      setUploadingVideoFile(false);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.videoUrl) {
      toast.error("Please provide video Title and Video URL");
      return;
    }
    setSavingVideo(true);

    try {
      const formData = new FormData();
      formData.append("title", videoForm.title);
      formData.append("description", videoForm.description);
      formData.append("category", videoForm.category);
      formData.append("videoUrl", videoForm.videoUrl);
      if (videoForm.duration) formData.append("duration", videoForm.duration);
      if (videoForm.thumbnailUrl) formData.append("thumbnailUrl", videoForm.thumbnailUrl);
      if (videoThumbnailFile) formData.append("thumbnail", videoThumbnailFile);

      if (editingVideo?._id) {
        await uploadFile(`/media/videos/${editingVideo._id}`, formData, "PUT");
        toast.success("Video updated successfully!");
      } else {
        await uploadFile("/media/videos", formData, "POST");
        toast.success("Video added successfully!");
      }

      setIsVideoModalOpen(false);
      const res = await fetchApi("/media/videos");
      setVideos(res.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to save video");
    } finally {
      setSavingVideo(false);
    }
  };

  const handleDeleteVideo = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to permanently delete this video? This will also remove its assets from Cloudinary.")) return;
    try {
      await fetchApi(`/media/videos/${id}`, { method: "DELETE" });
      toast.success("Video permanently deleted");
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete video");
    }
  };

  const filteredVideos =
    videoFilter === "all" ? videos : videos.filter((v) => v.category === videoFilter);

  // ─── SETTINGS HANDLERS ─────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await fetchApi("/settings/gallery", {
        method: "PUT",
        body: JSON.stringify(settingsDraft),
      });
      setSettings(settingsDraft);
      toast.success("Page settings saved!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleHeroImageUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingHero(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadFile("/settings/upload", formData);
      if (res.data?.imageUrl) {
        setSettingsDraft((prev) => ({ ...prev, heroImageUrl: res.data.imageUrl }));
        toast.success("Hero image uploaded!");
      }
    } catch (error: any) {
      toast.error(error.message || "Image upload failed");
    } finally {
      setUploadingHero(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-card p-12 text-center text-stone-500">
        <FaSpinner className="animate-spin text-2xl mx-auto mb-2 text-brand" />
        <p>Loading media console...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold mb-1">
            <FaImages /> Media Hub
          </div>
          <h1 className="text-2xl font-serif font-bold text-brand">
            Photos & Videos Management
          </h1>
          <p className="text-sm text-stone-500">
            Manage operational photos (4 thematic pillars) and video showcase (2 focus areas) for{" "}
            <span className="font-semibold text-brand">/photos-videos</span>.
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("photos")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "photos"
              ? "bg-brand text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <FaImages className="text-xs" />
          <span>Photos Gallery ({photos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("videos")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "videos"
              ? "bg-brand text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <FaVideo className="text-xs" />
          <span>Videos Showcase ({videos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-brand text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <FaCog className="text-xs" />
          <span>Page Banner & Text Settings</span>
        </button>
      </div>

      {/* ─── TAB 1: PHOTOS MANAGEMENT ───────────────────────────────────────── */}
      {activeTab === "photos" && (
        <div className="space-y-6">
          {/* Upload New Photos Box */}
          <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-brand font-serif flex items-center gap-2">
              <FaUpload className="text-emerald-700" /> Upload Operational Photos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Assign to Operational Pillar / Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as PhotoCategoryKey)}
                  className="admin-input font-medium"
                >
                  {PHOTO_CATEGORIES.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Default Caption (Optional)
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="e.g. Unit 1 dual hot-washing line in operation"
                  className="admin-input"
                />
              </div>
            </div>

            {/* File Picker */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                Select Photo Files (Multiple Supported)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoFilesSelect}
                  className="block text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-brand file:text-white hover:file:bg-brand-light cursor-pointer"
                />
                {selectedPhotoFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={handleUploadPhotos}
                    disabled={uploadingPhotos}
                    className="admin-btn-primary flex items-center gap-2 text-xs py-2 px-4 cursor-pointer"
                  >
                    {uploadingPhotos ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                    <span>
                      {uploadingPhotos
                        ? "Uploading..."
                        : `Upload ${selectedPhotoFiles.length} Photo(s)`}
                    </span>
                  </button>
                )}
              </div>

              {/* Previews */}
              {photoPreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-200">
                  {photoPreviews.map((url, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded overflow-hidden border border-stone-300 relative shadow-xs"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Photos Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase text-stone-500 mr-1">Filter:</span>
              <button
                type="button"
                onClick={() => setPhotoFilter("all")}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                  photoFilter === "all"
                    ? "bg-brand text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                All ({photos.length})
              </button>
              {PHOTO_CATEGORIES.map((cat) => {
                const count = photos.filter((p) => p.category === cat.key).length;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setPhotoFilter(cat.key)}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                      photoFilter === cat.key
                        ? "bg-brand text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {cat.shortLabel} ({count})
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-stone-400">
              Showing {filteredPhotos.length} of {photos.length} photos
            </span>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, idx) => {
              const catMeta = PHOTO_CATEGORIES.find((c) => c.key === photo.category);
              return (
                <div
                  key={photo._id || idx}
                  className="bg-stone-50 rounded border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full bg-stone-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || "Photo"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-brand/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                        {catMeta?.shortLabel || "Photo"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-stone-700 line-clamp-2 mb-3 leading-snug">
                      {photo.caption || <span className="italic text-stone-400">No caption</span>}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                      {/* Move left/right */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMovePhoto(idx, "left")}
                          disabled={idx === 0}
                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 cursor-pointer"
                          title="Move Left"
                        >
                          <FaChevronLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMovePhoto(idx, "right")}
                          disabled={idx === filteredPhotos.length - 1}
                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 cursor-pointer"
                          title="Move Right"
                        >
                          <FaChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditPhoto(photo)}
                          className="text-stone-600 hover:text-brand font-semibold flex items-center gap-1 cursor-pointer"
                          title="Edit Photo"
                        >
                          <FaEdit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo._id)}
                          className="text-stone-400 hover:text-red-600 cursor-pointer"
                          title="Delete Photo"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-12 bg-white rounded border border-stone-200 text-stone-500">
              <FaImages className="text-3xl mx-auto mb-2 text-stone-300" />
              <p>No photos found in this category.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: VIDEOS MANAGEMENT ───────────────────────────────────────── */}
      {activeTab === "videos" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-stone-50 p-4 rounded-lg border border-stone-200">
            <div>
              <h3 className="text-base font-bold text-brand font-serif">
                Video Showcase Assets
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                B2B facility tours and human-interest impact stories with modal players.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddVideo}
              className="admin-btn-primary text-xs flex items-center gap-1.5 cursor-pointer py-2 px-4"
            >
              <FaPlus className="w-3 h-3" /> Add New Video
            </button>
          </div>

          {/* Videos Category Filter */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-lg border border-stone-200">
            <span className="text-xs font-bold uppercase text-stone-500 mr-1">Filter:</span>
            <button
              type="button"
              onClick={() => setVideoFilter("all")}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                videoFilter === "all"
                  ? "bg-brand text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              All Videos ({videos.length})
            </button>
            {VIDEO_CATEGORIES.map((cat) => {
              const count = videos.filter((v) => v.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setVideoFilter(cat.key)}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                    videoFilter === cat.key
                      ? "bg-brand text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat.shortLabel} ({count})
                </button>
              );
            })}
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredVideos.map((video, idx) => {
              const catMeta = VIDEO_CATEGORIES.find((c) => c.key === video.category);
              return (
                <div
                  key={video._id || idx}
                  className="bg-stone-50 rounded-lg border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        video.thumbnailUrl ||
                        "https://res.cloudinary.com/wpttnkjq/image/upload/v1787229904/www.beatsnoop.com-3000-9kZPl3OjxS_mtz7rj.jpg"
                      }
                      alt={video.title}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setPreviewVideoUrl(video.videoUrl)}
                        className="w-12 h-12 rounded-full bg-brand/90 hover:bg-gold text-white flex items-center justify-center shadow-lg transition-all transform hover:scale-110 cursor-pointer"
                        title="Preview Video"
                      >
                        <FaPlay className="text-base ml-0.5" />
                      </button>
                    </div>

                    <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                      <span className="bg-brand/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                        {catMeta?.shortLabel || "Video"}
                      </span>
                      {video.duration && (
                        <span className="bg-black/75 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                          {video.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-brand text-base mb-1.5 line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-3">
                        {video.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 truncate mb-3">
                        <FaExternalLinkAlt className="text-[10px] shrink-0" />
                        <span className="truncate">{video.videoUrl}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setPreviewVideoUrl(video.videoUrl)}
                        className="text-xs text-emerald-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <FaPlay className="text-[9px]" /> Play Preview
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEditVideo(video)}
                          className="text-xs text-stone-600 hover:text-brand font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(video._id)}
                          className="text-xs text-stone-400 hover:text-red-600 cursor-pointer"
                          title="Delete Video"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12 bg-white rounded border border-stone-200 text-stone-500">
              <FaVideo className="text-3xl mx-auto mb-2 text-stone-300" />
              <p>No videos found in this category.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: PAGE SETTINGS ───────────────────────────────────────────── */}
      {activeTab === "settings" && (
        <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-brand font-serif">
                Page Headline & Hero Settings
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Customize the hero title, subtitle, and banner image for <span className="font-semibold text-brand">/photos-videos</span>.
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="admin-btn-primary flex items-center gap-1.5 cursor-pointer py-2 px-4 text-xs"
            >
              {savingSettings ? <FaSpinner className="animate-spin" /> : <FaSave />}
              <span>{savingSettings ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Page Heading
              </label>
              <input
                type="text"
                value={settingsDraft.heading || ""}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({ ...prev, heading: e.target.value }))
                }
                className="admin-input"
                placeholder="e.g. Photos & Videos Showcase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Page Subheading
              </label>
              <textarea
                rows={3}
                value={settingsDraft.subheading || ""}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({ ...prev, subheading: e.target.value }))
                }
                className="admin-input"
                placeholder="Detailed subtitle..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                Hero Banner Image
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {settingsDraft.heroImageUrl && (
                  <div className="w-32 h-20 rounded border border-stone-300 overflow-hidden relative shadow-xs shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settingsDraft.heroImageUrl}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 w-full space-y-2">
                  <AdminUploadButton
                    onFileSelect={handleHeroImageUpload}
                    isLoading={uploadingHero}
                    label="Upload Hero Banner Image"
                  />
                  <input
                    type="text"
                    value={settingsDraft.heroImageUrl || ""}
                    onChange={(e) =>
                      setSettingsDraft((prev) => ({ ...prev, heroImageUrl: e.target.value }))
                    }
                    className="admin-input text-xs"
                    placeholder="Or paste image URL directly..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: EDIT PHOTO ──────────────────────────────────────────────── */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 shrink-0 bg-stone-50/80">
              <h3 className="font-serif font-bold text-brand text-lg">Edit Photo Details</h3>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 p-2 rounded-full cursor-pointer transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editingPhoto.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Operational Pillar / Category
                </label>
                <select
                  value={editPhotoCategory}
                  onChange={(e) => setEditPhotoCategory(e.target.value as PhotoCategoryKey)}
                  className="admin-input font-medium"
                >
                  {PHOTO_CATEGORIES.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Caption
                </label>
                <textarea
                  rows={3}
                  value={editPhotoCaption}
                  onChange={(e) => setEditPhotoCaption(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-3.5 border-t border-stone-200 bg-stone-50/80 shrink-0">
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="admin-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePhotoEdit}
                disabled={savingPhotoEdit}
                className="admin-btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {savingPhotoEdit ? <FaSpinner className="animate-spin" /> : <FaSave />}
                <span>{savingPhotoEdit ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD / EDIT VIDEO ────────────────────────────────────────── */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">
            {/* Modal Header (Fixed) */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 shrink-0 bg-stone-50/80">
              <div>
                <h3 className="font-serif font-bold text-brand text-lg sm:text-xl">
                  {editingVideo ? "Edit Video Asset" : "Add New Video Asset"}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Upload video directly to Cloudinary or link external video (YouTube/Vimeo).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 p-2 rounded-full cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="text-base" />
              </button>
            </div>

            {/* Modal Body (Scrollable Form Fields) */}
            <form
              id="video-admin-form"
              onSubmit={handleSaveVideo}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Strategic Focus Category
                </label>
                <select
                  value={videoForm.category}
                  onChange={(e) =>
                    setVideoForm({ ...videoForm, category: e.target.value as VideoCategoryKey })
                  }
                  className="admin-input font-medium"
                >
                  {VIDEO_CATEGORIES.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. End-to-End Mechanical Recycling Facility Walkthrough"
                  className="admin-input"
                />
              </div>

              {/* Cloudinary Video Upload Area */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1.5">
                      <FaCloudUploadAlt className="text-emerald-700 text-base" /> Upload Video to Cloudinary
                    </span>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      Select an MP4, WebM, or MOV video file (Max 1GB). Automatically compressed & optimized.
                    </p>
                  </div>

                  <label
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-semibold text-white cursor-pointer shadow-xs transition-colors shrink-0 ${
                      uploadingVideoFile
                        ? "bg-stone-400 cursor-not-allowed"
                        : "bg-emerald-700 hover:bg-emerald-800"
                    }`}
                  >
                    {uploadingVideoFile ? (
                      <>
                        <FaSpinner className="animate-spin text-xs" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-sm" />
                        <span>Upload Video File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      disabled={uploadingVideoFile}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) handleVideoFileUpload(file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadingVideoFile && (
                  <div className="flex items-center gap-2 text-xs text-emerald-900 bg-white/90 p-2.5 rounded border border-emerald-300">
                    <FaSpinner className="animate-spin text-emerald-700" />
                    <span>Compressing, optimizing, and uploading video (Max limit: 1GB). Please wait...</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Video URL (Cloudinary, YouTube, Vimeo, or MP4) *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or https://www.youtube.com/watch?v=..."
                  className="admin-input text-xs sm:text-sm font-mono"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Auto-populated when uploading above, or you can paste a direct MP4, YouTube, or Vimeo link.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Description / Story Summary
                </label>
                <textarea
                  rows={3}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  placeholder="Detailed context about this operational or impact story..."
                  className="admin-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    placeholder="Duration (e.g. 4:18)"
                    className="admin-input text-xs"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Calculated automatically upon video selection or enter manually.
                  </p>
                </div>

                {/* Styled Thumbnail Upload Button */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                    Custom Thumbnail (Optional)
                  </label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer border border-stone-300 shadow-xs transition-colors">
                        <FaImage className="text-emerald-700 text-sm" />
                        <span>{videoThumbnailFile ? "Change Thumbnail" : "Upload Thumbnail"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setVideoThumbnailFile(file);
                            if (file) setVideoThumbnailPreview(URL.createObjectURL(file));
                          }}
                          className="hidden"
                        />
                      </label>
                      {(videoThumbnailPreview || videoForm.thumbnailUrl) && (
                        <button
                          type="button"
                          onClick={() => {
                            setVideoThumbnailFile(null);
                            setVideoThumbnailPreview("");
                            setVideoForm((prev) => ({ ...prev, thumbnailUrl: "" }));
                          }}
                          className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {videoThumbnailFile && (
                      <p className="text-[11px] text-stone-600 truncate max-w-full">
                        Selected: <span className="font-semibold">{videoThumbnailFile.name}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {videoThumbnailPreview && (
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Thumbnail Preview:
                  </span>
                  <div className="relative aspect-[16/9] w-40 rounded-md overflow-hidden border border-stone-300 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={videoThumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </form>

            {/* Modal Footer (Fixed at bottom) */}
            <div className="flex justify-end items-center gap-2.5 px-6 py-3.5 border-t border-stone-200 bg-stone-50/80 shrink-0">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="admin-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="video-admin-form"
                disabled={savingVideo}
                className="admin-btn-primary text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {savingVideo ? <FaSpinner className="animate-spin" /> : <FaSave />}
                <span>{savingVideo ? "Saving..." : "Save Video"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: PREVIEW VIDEO (1.5X Bigger: max-w-6xl) ────────────────────── */}
      {previewVideoUrl && (
        <div
          onClick={() => setPreviewVideoUrl(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6"
        >
          <div
            ref={adminVideoModalRef}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl bg-black rounded-xl overflow-hidden shadow-2xl border border-stone-800 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center px-4 sm:px-6 py-3 bg-stone-900/95 border-b border-stone-800 text-white">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gold">
                Video Player Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleAdminFullscreen}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-medium cursor-pointer transition-colors"
                  title={isAdminFullscreen ? "Exit Fullscreen" : "Full Screen"}
                  aria-label="Toggle Fullscreen"
                >
                  {isAdminFullscreen ? (
                    <>
                      <FaCompress className="text-xs" />
                      <span className="hidden sm:inline">Exit Fullscreen</span>
                    </>
                  ) : (
                    <>
                      <FaExpand className="text-xs" />
                      <span className="hidden sm:inline">Full Screen</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (document.fullscreenElement) {
                      document.exitFullscreen().catch(() => {});
                    }
                    setPreviewVideoUrl(null);
                  }}
                  className="text-white/70 hover:text-white hover:bg-stone-800 p-1.5 rounded-full cursor-pointer transition-colors"
                  aria-label="Close preview"
                >
                  <FaTimes className="text-base sm:text-lg" />
                </button>
              </div>
            </div>
            <div className="relative aspect-[16/9] w-full max-h-[82vh] bg-black">
              {(() => {
                const embed = previewVideoUrl.match(
                  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
                );
                if (embed && embed[1]) {
                  return (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${embed[1]}?autoplay=1`}
                      title="Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
                return (
                  <video src={previewVideoUrl} controls autoPlay className="w-full h-full object-contain" />
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
