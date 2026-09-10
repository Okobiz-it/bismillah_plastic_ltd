"use client";

import { useState, useEffect } from "react";
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
} from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";
import { ImpactData, defaultImpactData } from "@/data/impactData";

interface ExportRegion {
  name: string;
  countries: string;
  keyProducts: string;
  stats: string;
}

type TabType = "hero" | "environmental" | "social" | "sdgs" | "regions";

export default function ExportAdminContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("hero");

  // State
  const [impactData, setImpactData] = useState<ImpactData>(defaultImpactData);
  const [regions, setRegions] = useState<ExportRegion[]>([]);

  // Uploading state
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const toast = useToast();

  const loadData = async () => {
    try {
      const [impactRes, regionsRes] = await Promise.allSettled([
        fetchApi("/settings/impact_content"),
        fetchApi("/settings/export_regions"),
      ]);

      if (impactRes.status === "fulfilled" && impactRes.value?.data) {
        setImpactData({
          ...defaultImpactData,
          ...impactRes.value.data,
          hero: { ...defaultImpactData.hero, ...impactRes.value.data.hero },
          stats: impactRes.value.data.stats || defaultImpactData.stats,
          environmental: {
            ...defaultImpactData.environmental,
            ...impactRes.value.data.environmental,
            trajectory:
              impactRes.value.data.environmental?.trajectory ||
              defaultImpactData.environmental.trajectory,
          },
          social: {
            ...defaultImpactData.social,
            ...impactRes.value.data.social,
          },
          sdgs: {
            ...defaultImpactData.sdgs,
            ...impactRes.value.data.sdgs,
            items:
              impactRes.value.data.sdgs?.items || defaultImpactData.sdgs.items,
          },
        });
      }

      if (regionsRes.status === "fulfilled" && regionsRes.value?.data) {
        setRegions(regionsRes.value.data || []);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
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
      await Promise.all([
        fetchApi("/settings/impact_content", {
          method: "PUT",
          body: JSON.stringify(impactData),
        }),
        fetchApi("/settings/export_regions", {
          method: "PUT",
          body: JSON.stringify(regions),
        }),
      ]);
      toast.success("Impact content and export regions saved successfully!");
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
    const updated = [...impactData.environmental.trajectory];
    updated[index][field] = value;
    setImpactData((prev) => ({
      ...prev,
      environmental: { ...prev.environmental, trajectory: updated },
    }));
  };

  const addTrajectoryRow = () => {
    setImpactData((prev) => ({
      ...prev,
      environmental: {
        ...prev.environmental,
        trajectory: [
          ...prev.environmental.trajectory,
          { year: `Year ${prev.environmental.trajectory.length + 1}`, capacity: "" },
        ],
      },
    }));
  };

  const removeTrajectoryRow = (index: number) => {
    setImpactData((prev) => ({
      ...prev,
      environmental: {
        ...prev.environmental,
        trajectory: prev.environmental.trajectory.filter((_, i) => i !== index),
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

  // Region handlers
  const addRegion = () => {
    setRegions([...regions, { name: "", countries: "", keyProducts: "", stats: "" }]);
  };

  const removeRegion = (index: number) => {
    const newRegions = [...regions];
    newRegions.splice(index, 1);
    setRegions(newRegions);
  };

  const updateRegion = (index: number, field: keyof ExportRegion, value: string) => {
    const newRegions = [...regions];
    newRegions[index][field] = value;
    setRegions(newRegions);
  };

  if (loading) {
    return (
      <div className="admin-card p-12 text-center text-stone-500">
        <FaSpinner className="animate-spin text-2xl mx-auto mb-2 text-brand" />
        <p>Loading Impact & Export settings...</p>
      </div>
    );
  }

  return (
    <div className="admin-card">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <FaLeaf /> Impact & ESG Management
          </div>
          <h2 className="text-xl font-serif font-bold text-brand flex items-center gap-2">
            Impact & Global Export Content
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Manage public contents, images, metrics, and narratives for the <span className="font-semibold text-brand">/impact</span> page.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn-primary w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3 mb-6">
        {[
          { key: "hero", label: "Hero & Overview", icon: FaGlobe },
          { key: "environmental", label: "Environmental & Circular", icon: FaRecycle },
          { key: "social", label: "Social Inclusion", icon: FaUsers },
          { key: "sdgs", label: "SDG Alignment", icon: FaAward },
          { key: "regions", label: "Export & Distribution", icon: FaGlobe },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as TabType)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-brand text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
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
          <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-4">
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
                <div className="flex-1 w-full space-y-2">
                  <AdminUploadButton
                    onFileSelect={(file) => handleImageUpload(file, "hero")}
                    isLoading={uploadingField === "hero"}
                    label="Upload Hero Image"
                  />
                  <input
                    type="text"
                    value={impactData.hero.imageUrl || ""}
                    onChange={(e) =>
                      setImpactData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, imageUrl: e.target.value },
                      }))
                    }
                    className="admin-input text-xs"
                    placeholder="Or paste direct image URL..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Highlights */}
          <div className="bg-stone-50 p-5 rounded-lg border border-stone-200">
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
          <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-4">
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
                  <div className="flex-1 w-full space-y-2">
                    <AdminUploadButton
                      onFileSelect={(file) => handleImageUpload(file, "environmental")}
                      isLoading={uploadingField === "environmental"}
                      label="Upload Environmental Image"
                    />
                    <input
                      type="text"
                      value={impactData.environmental.imageUrl}
                      onChange={(e) =>
                        setImpactData((prev) => ({
                          ...prev,
                          environmental: { ...prev.environmental, imageUrl: e.target.value },
                        }))
                      }
                      className="admin-input text-xs"
                      placeholder="Or paste direct image URL..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metric-Driven Diversion & Trajectory Table */}
          <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-4">
            <h4 className="text-sm font-bold text-brand uppercase tracking-wider">
              1. Metric-Driven Diversion & 5-Year Trajectory
            </h4>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Sub-Heading Title
              </label>
              <input
                type="text"
                value={impactData.environmental.metricDiversionTitle}
                onChange={(e) =>
                  setImpactData((prev) => ({
                    ...prev,
                    environmental: { ...prev.environmental, metricDiversionTitle: e.target.value },
                  }))
                }
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={impactData.environmental.metricDiversionDescription}
                onChange={(e) =>
                  setImpactData((prev) => ({
                    ...prev,
                    environmental: {
                      ...prev.environmental,
                      metricDiversionDescription: e.target.value,
                    },
                  }))
                }
                className="admin-input"
              />
            </div>

            {/* Trajectory Table Rows */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  5-Year Capacity Trajectory Rows
                </label>
                <button
                  type="button"
                  onClick={addTrajectoryRow}
                  className="text-xs font-bold text-gold hover:text-gold-dark flex items-center gap-1 cursor-pointer"
                >
                  <FaPlus className="w-2.5 h-2.5" /> Add Row
                </button>
              </div>

              <div className="space-y-2">
                {impactData.environmental.trajectory.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white p-2.5 rounded border border-stone-200"
                  >
                    <input
                      type="text"
                      value={row.year}
                      onChange={(e) => updateTrajectoryRow(idx, "year", e.target.value)}
                      className="admin-input text-xs w-1/3"
                      placeholder="e.g. Year 1"
                    />
                    <input
                      type="text"
                      value={row.capacity}
                      onChange={(e) => updateTrajectoryRow(idx, "capacity", e.target.value)}
                      className="admin-input text-xs flex-1"
                      placeholder="e.g. 15,000 MT"
                    />
                    <button
                      type="button"
                      onClick={() => removeTrajectoryRow(idx)}
                      className="text-stone-400 hover:text-red-600 p-1.5 cursor-pointer"
                      title="Delete Row"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ecosystem Protection */}
          <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-4">
            <h4 className="text-sm font-bold text-brand uppercase tracking-wider">
              2. Ecosystem Protection
            </h4>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Sub-Heading Title
              </label>
              <input
                type="text"
                value={impactData.environmental.ecosystemProtectionTitle}
                onChange={(e) =>
                  setImpactData((prev) => ({
                    ...prev,
                    environmental: {
                      ...prev.environmental,
                      ecosystemProtectionTitle: e.target.value,
                    },
                  }))
                }
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={impactData.environmental.ecosystemProtectionDescription}
                onChange={(e) =>
                  setImpactData((prev) => ({
                    ...prev,
                    environmental: {
                      ...prev.environmental,
                      ecosystemProtectionDescription: e.target.value,
                    },
                  }))
                }
                className="admin-input"
              />
            </div>
          </div>

          {/* Closed-Loop Feedstock */}
          <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-4">
            <h4 className="text-sm font-bold text-brand uppercase tracking-wider">
              3. Closed-Loop Feedstock
            </h4>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Sub-Heading Title
              </label>
              <input
                type="text"
                value={impactData.environmental.closedLoopTitle}
                onChange={(e) =>
                  setImpactData((prev) => ({
                    ...prev,
                    environmental: { ...prev.environmental, closedLoopTitle: e.target.value },
                  }))
                }
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={impactData.environmental.closedLoopDescription}
                onChange={(e) =>
                  setImpactData((prev) => ({
                    ...prev,
                    environmental: {
                      ...prev.environmental,
                      closedLoopDescription: e.target.value,
                    },
                  }))
                }
                className="admin-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: SOCIAL INCLUSION & LIVELIHOOD ─────────────────── */}
      {activeTab === "social" && (
        <div className="space-y-6">
          <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-4">
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
                  <div className="flex-1 w-full space-y-2">
                    <AdminUploadButton
                      onFileSelect={(file) => handleImageUpload(file, "social")}
                      isLoading={uploadingField === "social"}
                      label="Upload Social Section Image"
                    />
                    <input
                      type="text"
                      value={impactData.social.imageUrl}
                      onChange={(e) =>
                        setImpactData((prev) => ({
                          ...prev,
                          social: { ...prev.social, imageUrl: e.target.value },
                        }))
                      }
                      className="admin-input text-xs"
                      placeholder="Or paste direct image URL..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Social Pillars */}
          <div className="space-y-4">
            {/* 1. Women's Empowerment */}
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-3">
              <span className="text-xs font-bold text-rose-700 uppercase">
                Pillar 1: Women’s Empowerment
              </span>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={impactData.social.womensEmpowermentTitle}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      social: { ...prev.social, womensEmpowermentTitle: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={impactData.social.womensEmpowermentDescription}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      social: {
                        ...prev.social,
                        womensEmpowermentDescription: e.target.value,
                      },
                    }))
                  }
                  className="admin-input"
                />
              </div>
            </div>

            {/* 2. Informal Sector Integration */}
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-3">
              <span className="text-xs font-bold text-amber-700 uppercase">
                Pillar 2: Informal Sector Integration
              </span>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={impactData.social.informalIntegrationTitle}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      social: { ...prev.social, informalIntegrationTitle: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={impactData.social.informalIntegrationDescription}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      social: {
                        ...prev.social,
                        informalIntegrationDescription: e.target.value,
                      },
                    }))
                  }
                  className="admin-input"
                />
              </div>
            </div>

            {/* 3. Worker Welfare & Safety */}
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase">
                Pillar 3: Worker Welfare & Safety (OHS)
              </span>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={impactData.social.workerWelfareTitle}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      social: { ...prev.social, workerWelfareTitle: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={impactData.social.workerWelfareDescription}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      social: { ...prev.social, workerWelfareDescription: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>
            </div>

            {/* 4. Labor Rights Compliance */}
            <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-3">
              <span className="text-xs font-bold text-blue-700 uppercase">
                Pillar 4: Labor Rights Compliance
              </span>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={impactData.social.laborRightsTitle}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      social: { ...prev.social, laborRightsTitle: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={impactData.social.laborRightsDescription}
                  onChange={(e) =>
                    setImpactData((prev) => ({
                      ...prev,
                      social: { ...prev.social, laborRightsDescription: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: UN SDG ALIGNMENT ──────────────────────────────── */}
      {activeTab === "sdgs" && (
        <div className="space-y-6">
          <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-4">
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
                className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-4 shadow-xs"
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

      {/* ─── TAB 5: DISTRIBUTION & EXPORT REGIONS ─────────────────── */}
      {activeTab === "regions" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-stone-50 p-4 rounded-lg border border-stone-200">
            <div>
              <h3 className="text-base font-bold text-brand font-serif">
                Configured Export & Distribution Regions
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Downstream manufacturer supply reach and regional market data.
              </p>
            </div>
            <button
              type="button"
              onClick={addRegion}
              className="admin-btn-secondary text-xs flex items-center gap-1 cursor-pointer"
            >
              <FaPlus className="w-3 h-3" /> Add Region
            </button>
          </div>

          <div className="space-y-4">
            {regions.map((region, i) => (
              <div
                key={i}
                className="bg-stone-50 p-4 rounded-lg border border-stone-200 shadow-xs relative"
              >
                <button
                  type="button"
                  onClick={() => removeRegion(i)}
                  className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Remove Region"
                >
                  <FaTrash />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Region Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Europe"
                      value={region.name}
                      onChange={(e) => updateRegion(i, "name", e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Reach / Stats
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15 countries served"
                      value={region.stats}
                      onChange={(e) => updateRegion(i, "stats", e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Countries
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Germany, Italy, Spain, UK, Netherlands, France"
                      value={region.countries}
                      onChange={(e) => updateRegion(i, "countries", e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Products Exported
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Clear PET Flakes, PP Chips"
                      value={region.keyProducts}
                      onChange={(e) => updateRegion(i, "keyProducts", e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>
            ))}
            {regions.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed border-stone-200 rounded-lg text-stone-500">
                <p>No export regions added yet.</p>
                <button
                  type="button"
                  onClick={addRegion}
                  className="mt-2 text-brand font-semibold hover:underline cursor-pointer"
                >
                  Add your first region
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="mt-8 pt-4 border-t border-stone-200 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn-primary flex items-center gap-2 cursor-pointer px-6 py-2.5"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
        </button>
      </div>
    </div>
  );
}
