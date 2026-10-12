"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchApi, uploadFile } from "@/lib/api";
import {
  FaSave,
  FaPlus,
  FaTrash,
  FaGlobe,
  FaLeaf,
  FaUsers,
  FaRecycle,
  FaAward,
  FaImage,
  FaSpinner,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";
import IconPicker from "@/components/admin/shared/IconPicker";
import { ImpactData, defaultImpactData, ImpactPillarSection } from "@/data/impactData";

type TabType = "hero" | "environmental" | "social" | "sdgs";

export default function ExportAdminContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("hero");

  // State
  const [impactData, setImpactData] = useState<ImpactData>(defaultImpactData);

  // Uploading state
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const toast = useToast();

  const loadData = async () => {
    try {
      const res = await fetchApi("/settings/impact_content");

      if (res && res.data) {
        setImpactData({
          ...defaultImpactData,
          ...res.data,
          hero: { ...defaultImpactData.hero, ...res.data.hero },
          stats: res.data.stats || defaultImpactData.stats,
          environmental: {
            ...defaultImpactData.environmental,
            ...res.data.environmental,
            trajectoryTitle:
              res.data.environmental?.trajectoryTitle ||
              defaultImpactData.environmental.trajectoryTitle,
            trajectory:
              res.data.environmental?.trajectory &&
              res.data.environmental.trajectory.length > 0
                ? res.data.environmental.trajectory
                : defaultImpactData.environmental.trajectory,
            sections:
              res.data.environmental?.sections &&
              res.data.environmental.sections.length > 0
                ? res.data.environmental.sections
                : defaultImpactData.environmental.sections,
          },
          social: {
            ...defaultImpactData.social,
            ...res.data.social,
            sections:
              res.data.social?.sections &&
              res.data.social.sections.length > 0
                ? res.data.social.sections
                : defaultImpactData.social.sections,
          },
          sdgs: {
            ...defaultImpactData.sdgs,
            ...res.data.sdgs,
            items:
              res.data.sdgs?.items || defaultImpactData.sdgs.items,
          },
        });
      }
    } catch {
      // defaults already active
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchApi("/settings/impact_content", {
        method: "PUT",
        body: JSON.stringify(impactData),
      });
      toast.success("Impact content saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File | null, targetPath: string) => {
    if (!file) return;
    setUploadingField(targetPath);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadFile("/settings/upload", formData);
      const uploadedUrl = res.data?.imageUrl;

      if (uploadedUrl) {
        if (targetPath === "hero") {
          setImpactData((prev) => ({
            ...prev,
            hero: { ...prev.hero, imageUrl: uploadedUrl },
          }));
        } else if (targetPath === "environmental") {
          setImpactData((prev) => ({
            ...prev,
            environmental: { ...prev.environmental, imageUrl: uploadedUrl },
          }));
        } else if (targetPath === "social") {
          setImpactData((prev) => ({
            ...prev,
            social: { ...prev.social, imageUrl: uploadedUrl },
          }));
        }
        toast.success("Image uploaded successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Image upload failed");
    } finally {
      setUploadingField(null);
    }
  };

  // Trajectory table handlers
  const updateTrajectoryRow = (index: number, field: "year" | "capacity", value: string) => {
    setImpactData((prev) => ({
      ...prev,
      environmental: {
        ...prev.environmental,
        trajectory: (prev.environmental?.trajectory || []).map((r, i) =>
          i === index ? { ...r, [field]: value } : r
        ),
      },
    }));
  };

  const addTrajectoryRow = () => {
    setImpactData((prev) => {
      const currentTrajectory = prev.environmental?.trajectory || [];
      return {
        ...prev,
        environmental: {
          ...prev.environmental,
          trajectory: [
            ...currentTrajectory,
            { year: `Year ${currentTrajectory.length + 1}`, capacity: "" },
          ],
        },
      };
    });
  };

  const removeTrajectoryRow = (index: number) => {
    setImpactData((prev) => ({
      ...prev,
      environmental: {
        ...prev.environmental,
        trajectory: (prev.environmental?.trajectory || []).filter((_, i) => i !== index),
      },
    }));
  };

  // Environmental section handlers
  const addEnvSection = () => {
    const newSec: ImpactPillarSection = {
      id: `env-${Date.now()}`,
      title: "New Environmental Section",
      description: "",
      icon: "FaLeaf",
    };
    setImpactData((prev) => ({
      ...prev,
      environmental: {
        ...prev.environmental,
        sections: [...(prev.environmental.sections || []), newSec],
      },
    }));
  };

  const updateEnvSection = (
    index: number,
    field: keyof ImpactPillarSection,
    value: string
  ) => {
    setImpactData((prev) => {
      const updated = [...(prev.environmental.sections || [])];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        environmental: { ...prev.environmental, sections: updated },
      };
    });
  };

  const removeEnvSection = (index: number) => {
    setImpactData((prev) => ({
      ...prev,
      environmental: {
        ...prev.environmental,
        sections: (prev.environmental.sections || []).filter((_, i) => i !== index),
      },
    }));
  };

  // Social section handlers
  const addSocialSection = () => {
    const newSec: ImpactPillarSection = {
      id: `soc-${Date.now()}`,
      title: "New Social Section",
      description: "",
      icon: "FaUsers",
    };
    setImpactData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        sections: [...(prev.social.sections || []), newSec],
      },
    }));
  };

  const updateSocialSection = (
    index: number,
    field: keyof ImpactPillarSection,
    value: string
  ) => {
    setImpactData((prev) => {
      const updated = [...(prev.social.sections || [])];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        social: { ...prev.social, sections: updated },
      };
    });
  };

  const removeSocialSection = (index: number) => {
    setImpactData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        sections: (prev.social.sections || []).filter((_, i) => i !== index),
      },
    }));
  };

  // Stat item handlers
  const updateStatItem = (index: number, field: "value" | "label" | "sublabel", value: string) => {
    const updated = [...impactData.stats];
    updated[index][field] = value;
    setImpactData((prev) => ({ ...prev, stats: updated }));
  };

  // SDG handlers
  const updateSdgItem = (index: number, field: "narrative" | "proofPoint" | "sdgNumbers" | "sdgTitles" | "badgeColor", value: string) => {
    const updated = [...impactData.sdgs.items];
    updated[index][field] = value;
    setImpactData((prev) => ({
      ...prev,
      sdgs: { ...prev.sdgs, items: updated },
    }));
  };

  if (loading) {
    return (
      <div className="admin-card p-12 text-center text-stone-500">
        <FaSpinner className="animate-spin text-2xl mx-auto mb-2 text-brand" />
        <p>Loading Impact settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <FaLeaf /> Sustainability &amp; Impact Management
          </div>
          <h1 className="text-2xl font-serif font-bold text-brand">Impact</h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage public contents, images, environmental metrics, and narratives for the{" "}
            <span className="font-semibold text-brand">/impact</span> page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/impact"
            target="_blank"
            className="admin-btn-secondary !rounded-[4px] text-xs flex items-center gap-1.5"
          >
            <FaExternalLinkAlt className="text-xs" /> View Public Page
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="admin-btn-primary !rounded-[4px] text-xs flex items-center gap-1.5 cursor-pointer"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        {[
          { key: "hero", label: "Hero & Overview", icon: FaGlobe },
          { key: "environmental", label: "Environmental & Circular", icon: FaRecycle },
          { key: "social", label: "Social Inclusion", icon: FaUsers },
          { key: "sdgs", label: "SDG Alignment", icon: FaAward },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as TabType)}
            className={`flex items-center gap-2 px-3.5 py-2 !rounded-[4px] text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-brand text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200"
            }`}
          >
            <tab.icon className="text-xs" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── TAB 1: HERO & OVERVIEW ───────────────────────────────── */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="bg-stone-50 p-5 rounded-[4px] border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-brand font-serif flex items-center gap-2">
              <FaGlobe className="text-stone-400" /> Hero Section Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Eyebrow Sub-Badge
              </label>
              <input
                type="text"
                value={impactData.hero.eyebrow}
                onChange={(e) =>
                  setImpactData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, eyebrow: e.target.value },
                  }))
                }
                className="admin-input"
                placeholder="e.g. Measurable ESG & Value Creation"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Headline
              </label>
              <input
                type="text"
                value={impactData.hero.headline}
                onChange={(e) =>
                  setImpactData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, headline: e.target.value },
                  }))
                }
                className="admin-input"
                placeholder="Page Main Headline"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={impactData.hero.description}
                onChange={(e) =>
                  setImpactData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, description: e.target.value },
                  }))
                }
                className="admin-input"
                placeholder="Detailed hero description..."
              />
            </div>

            {/* Hero Image Upload */}
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                Hero Background Image
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {impactData.hero.imageUrl && (
                  <div className="w-32 h-20 rounded border border-stone-300 overflow-hidden relative shadow-xs shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={impactData.hero.imageUrl}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <AdminUploadButton
                    onFileSelect={(file) => handleImageUpload(file, "hero")}
                    isLoading={uploadingField === "hero"}
                    label="Upload Hero Image"
                    roundedClassName="rounded-[4px]"
                  />
                  <p className="text-[10px] text-stone-400">Recommended: JPG, PNG or WEBP.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Highlights */}
          <div className="bg-stone-50 p-5 rounded-[4px] border border-stone-200">
            <h3 className="text-base font-bold text-brand font-serif mb-4">
              High-Level Metrics Strip (4 Highlights)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {impactData.stats.map((st, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded border border-stone-200 space-y-2 shadow-xs"
                >
                  <span className="text-xs font-bold text-emerald-800 uppercase">
                    Metric #{idx + 1}
                  </span>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase">
                      Value
                    </label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => updateStatItem(idx, "value", e.target.value)}
                      className="admin-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase">
                      Label
                    </label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => updateStatItem(idx, "label", e.target.value)}
                      className="admin-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase">
                      Sublabel / Context
                    </label>
                    <input
                      type="text"
                      value={st.sublabel || ""}
                      onChange={(e) => updateStatItem(idx, "sublabel", e.target.value)}
                      className="admin-input text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: ENVIRONMENTAL & CIRCULAR ECONOMY ─────────────── */}
      {activeTab === "environmental" && (
        <div className="space-y-6">
          <div className="bg-stone-50 p-5 rounded-[4px] border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-brand font-serif flex items-center gap-2">
              <FaRecycle className="text-emerald-600" /> Section Title & Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={impactData.environmental.title}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      environmental: { ...prev.environmental, title: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Section Intro Text
                </label>
                <textarea
                  rows={2}
                  value={impactData.environmental.intro}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      environmental: { ...prev.environmental, intro: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>

              {/* Section Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                  Environmental Section Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {impactData.environmental.imageUrl && (
                    <div className="w-32 h-24 rounded border border-stone-300 overflow-hidden relative shadow-xs shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={impactData.environmental.imageUrl}
                        alt="Environmental preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <AdminUploadButton
                      onFileSelect={(file) => handleImageUpload(file, "environmental")}
                      isLoading={uploadingField === "environmental"}
                      label="Upload Environmental Image"
                      roundedClassName="rounded-[4px]"
                    />
                    <p className="text-[10px] text-stone-400">Recommended: JPG, PNG or WEBP.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Year Capacity Trajectory Rows Table */}
          <div className="bg-white p-5 rounded-[4px] border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div className="flex-1 max-w-md">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Trajectory Table Section Title
                </label>
                <input
                  type="text"
                  value={impactData.environmental.trajectoryTitle || ""}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      environmental: {
                        ...prev.environmental,
                        trajectoryTitle: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. 5-Year Capacity Trajectory Rows"
                  className="admin-input !rounded-[4px]"
                />
              </div>
              <button
                type="button"
                onClick={addTrajectoryRow}
                className="admin-btn-secondary !rounded-[4px] text-xs flex items-center gap-1.5 self-start sm:self-end cursor-pointer"
              >
                <FaPlus className="w-2.5 h-2.5" /> Add Row
              </button>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-3 px-2 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <span className="col-span-3 sm:col-span-3">Operating Period</span>
                <span className="col-span-8 sm:col-span-8">Estimated Processing Capacity</span>
                <span className="col-span-1 text-right">Action</span>
              </div>

              {(impactData.environmental.trajectory || []).map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-3 items-center bg-stone-50 p-2 rounded-[4px] border border-stone-200"
                >
                  <div className="col-span-3 sm:col-span-3">
                    <input
                      type="text"
                      value={row.year}
                      onChange={(e) => updateTrajectoryRow(idx, "year", e.target.value)}
                      className="admin-input !rounded-[4px] text-xs w-full"
                      placeholder="e.g. Year 1"
                    />
                  </div>
                  <div className="col-span-8 sm:col-span-8">
                    <input
                      type="text"
                      value={row.capacity}
                      onChange={(e) => updateTrajectoryRow(idx, "capacity", e.target.value)}
                      className="admin-input !rounded-[4px] text-xs w-full"
                      placeholder="e.g. 15,000 MT"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeTrajectoryRow(idx)}
                      className="text-stone-400 hover:text-red-600 p-2 rounded-[4px] hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                      title="Delete Row"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {(!impactData.environmental.trajectory || impactData.environmental.trajectory.length === 0) && (
                <div className="text-center py-4 text-xs text-stone-400">
                  No table rows. Click &quot;Add Row&quot; to add capacity targets.
                </div>
              )}
            </div>
          </div>

          {/* Environmental Pillar Sections List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-brand uppercase tracking-wider">
                  Environmental Pillar Sections
                </h4>
                <p className="text-xs text-stone-500">
                  Manage sections like Metric-Driven Diversion, Ecosystem Protection, and Closed-Loop Feedstock with custom icons.
                </p>
              </div>
              <button
                type="button"
                onClick={addEnvSection}
                className="admin-btn-primary text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <FaPlus className="w-2.5 h-2.5" /> Add New Section
              </button>
            </div>

            <div className="space-y-4">
              {(impactData.environmental.sections || []).map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="bg-stone-50 p-5 rounded-[4px] border border-stone-200 space-y-4 relative shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                        Section #{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-medium">Icon:</span>
                        <IconPicker
                          value={sec.icon || "FaLeaf"}
                          onChange={(iconKey) => updateEnvSection(idx, "icon", iconKey)}
                          label="Pick Icon"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEnvSection(idx)}
                        className="text-stone-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Section"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Section Heading / Title
                    </label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => updateEnvSection(idx, "title", e.target.value)}
                      placeholder="e.g. 1. Metric-Driven Diversion & 5-Year Trajectory"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Section Content / Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={sec.description}
                      onChange={(e) => updateEnvSection(idx, "description", e.target.value)}
                      placeholder="Describe the environmental impact or intervention..."
                      className="admin-input resize-y"
                    />
                  </div>
                </div>
              ))}

              {(impactData.environmental.sections || []).length === 0 && (
                <div className="text-center py-8 bg-stone-50 border border-dashed border-stone-300 rounded-[4px] text-stone-500 text-xs">
                  No environmental sections found. Click &quot;Add New Section&quot; to create one.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: SOCIAL INCLUSION & LIVELIHOOD ─────────────────── */}
      {activeTab === "social" && (
        <div className="space-y-6">
          <div className="bg-stone-50 p-5 rounded-[4px] border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-brand font-serif flex items-center gap-2">
              <FaUsers className="text-amber-600" /> Section Title & Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={impactData.social.title}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      social: { ...prev.social, title: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Section Intro Text
                </label>
                <textarea
                  rows={2}
                  value={impactData.social.intro}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      social: { ...prev.social, intro: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>

              {/* Section Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                  Social Section Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {impactData.social.imageUrl && (
                    <div className="w-32 h-24 rounded border border-stone-300 overflow-hidden relative shadow-xs shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={impactData.social.imageUrl}
                        alt="Social preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <AdminUploadButton
                      onFileSelect={(file) => handleImageUpload(file, "social")}
                      isLoading={uploadingField === "social"}
                      label="Upload Social Section Image"
                      roundedClassName="rounded-[4px]"
                    />
                    <p className="text-[10px] text-stone-400">Recommended: JPG, PNG or WEBP.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Inclusion Pillar Sections List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-brand uppercase tracking-wider">
                  Social Inclusion Pillar Sections
                </h4>
                <p className="text-xs text-stone-500">
                  Manage sections like Women&apos;s Empowerment, Informal Integration, and Worker Welfare with custom icons.
                </p>
              </div>
              <button
                type="button"
                onClick={addSocialSection}
                className="admin-btn-primary text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <FaPlus className="w-2.5 h-2.5" /> Add New Section
              </button>
            </div>

            <div className="space-y-4">
              {(impactData.social.sections || []).map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="bg-stone-50 p-5 rounded-[4px] border border-stone-200 space-y-4 relative shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                        Section #{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-medium">Icon:</span>
                        <IconPicker
                          value={sec.icon || "FaUsers"}
                          onChange={(iconKey) => updateSocialSection(idx, "icon", iconKey)}
                          label="Pick Icon"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSocialSection(idx)}
                        className="text-stone-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Section"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Section Heading / Title
                    </label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => updateSocialSection(idx, "title", e.target.value)}
                      placeholder="e.g. Women's Empowerment"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Section Content / Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={sec.description}
                      onChange={(e) => updateSocialSection(idx, "description", e.target.value)}
                      placeholder="Describe the social inclusion initiative or impact..."
                      className="admin-input resize-y"
                    />
                  </div>
                </div>
              ))}

              {(impactData.social.sections || []).length === 0 && (
                <div className="text-center py-8 bg-stone-50 border border-dashed border-stone-300 rounded-[4px] text-stone-500 text-xs">
                  No social inclusion sections found. Click &quot;Add New Section&quot; to create one.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: UN SDG ALIGNMENT ──────────────────────────────── */}
      {activeTab === "sdgs" && (
        <div className="space-y-6">
          <div className="bg-stone-50 p-5 rounded-[4px] border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-brand font-serif flex items-center gap-2">
              <FaAward className="text-gold" /> SDG Section Overview
            </h3>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={impactData.sdgs.title}
                onChange={(e) =>
                  setImpactData((prev) => ({
                    ...prev,
                    sdgs: { ...prev.sdgs, title: e.target.value },
                  }))
                }
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Section Intro
              </label>
              <textarea
                rows={2}
                value={impactData.sdgs.intro}
                onChange={(e) =>
                  setImpactData((prev) => ({
                    ...prev,
                    sdgs: { ...prev.sdgs, intro: e.target.value },
                  }))
                }
                className="admin-input"
              />
            </div>
          </div>

          <div className="space-y-6">
            {impactData.sdgs.items.map((sdg, idx) => (
              <div
                key={sdg.id}
                className="bg-stone-50 p-5 rounded-[4px] border border-stone-200 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full inline-block"
                      style={{ backgroundColor: sdg.badgeColor }}
                    />
                    <span className="font-serif font-bold text-brand text-base">
                      {sdg.sdgNumbers}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-stone-500">Badge Color:</label>
                    <input
                      type="color"
                      value={sdg.badgeColor}
                      onChange={(e) => updateSdgItem(idx, "badgeColor", e.target.value)}
                      className="w-7 h-7 p-0 rounded border border-stone-300 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                      SDG Numbers
                    </label>
                    <input
                      type="text"
                      value={sdg.sdgNumbers}
                      onChange={(e) => updateSdgItem(idx, "sdgNumbers", e.target.value)}
                      className="admin-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                      SDG Target Titles
                    </label>
                    <input
                      type="text"
                      value={sdg.sdgTitles}
                      onChange={(e) => updateSdgItem(idx, "sdgTitles", e.target.value)}
                      className="admin-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                    The Narrative
                  </label>
                  <input
                    type="text"
                    value={sdg.narrative}
                    onChange={(e) => updateSdgItem(idx, "narrative", e.target.value)}
                    className="admin-input text-sm font-medium"
                    placeholder="e.g. Formalizing the informal economy."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                    The Proof Point
                  </label>
                  <textarea
                    rows={4}
                    value={sdg.proofPoint}
                    onChange={(e) => updateSdgItem(idx, "proofPoint", e.target.value)}
                    className="admin-input text-sm"
                    placeholder="Detailed evidence and operations proof point..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* Bottom Save Bar */}
      <div className="mt-8 pt-4 border-t border-stone-200 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn-primary !rounded-[4px] flex items-center gap-2 cursor-pointer px-6 py-2.5"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
        </button>
      </div>
    </div>
  );
}
