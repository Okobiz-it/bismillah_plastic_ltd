"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchApi, uploadFile } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import {
  AboutOverviewData,
  defaultAboutOverviewData,
  FacilityUnit,
  SafetyCard,
} from "@/data/aboutData";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";
import RichTextEditor from "@/components/shared/RichTextEditor";
import {
  FaSave,
  FaUndo,
  FaExternalLinkAlt,
  FaPlus,
  FaTrash,
  FaBuilding,
  FaBookOpen,
  FaHandsHelping,
  FaShieldAlt,
  FaQuoteRight,
} from "react-icons/fa";

export default function CompanyOverviewAdminContent() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [data, setData] = useState<AboutOverviewData>(defaultAboutOverviewData);

  // Pending file uploads for sections
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [facilitiesFile, setFacilitiesFile] = useState<File | null>(null);
  const [socialFile, setSocialFile] = useState<File | null>(null);
  const [cardFiles, setCardFiles] = useState<Record<number, File>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/settings/about_overview");
      if (res && res.data) {
        setData({
          story: { ...defaultAboutOverviewData.story, ...res.data.story },
          facilities: {
            ...defaultAboutOverviewData.facilities,
            ...res.data.facilities,
            units: res.data.facilities?.units || defaultAboutOverviewData.facilities.units,
          },
          socialImpact: { ...defaultAboutOverviewData.socialImpact, ...res.data.socialImpact },
          safetyFocus: {
            ...defaultAboutOverviewData.safetyFocus,
            ...res.data.safetyFocus,
            cards: res.data.safetyFocus?.cards || defaultAboutOverviewData.safetyFocus.cards,
          },
          conclusion: { ...defaultAboutOverviewData.conclusion, ...res.data.conclusion },
        });
      }
    } catch {
      setData(defaultAboutOverviewData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper to upload a single file if chosen
  const uploadIfPresent = async (file: File | null): Promise<string | null> => {
    if (!file) return null;
    const fd = new FormData();
    fd.append("image", file);
    const res = await uploadFile("/settings/upload", fd);
    return res.data?.imageUrl || null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedData: AboutOverviewData = JSON.parse(JSON.stringify(data));

      // Upload section images if new files were selected
      const storyUrl = await uploadIfPresent(storyFile);
      if (storyUrl) updatedData.story.imageUrl = storyUrl;

      const facilitiesUrl = await uploadIfPresent(facilitiesFile);
      if (facilitiesUrl) updatedData.facilities.imageUrl = facilitiesUrl;

      const socialUrl = await uploadIfPresent(socialFile);
      if (socialUrl) updatedData.socialImpact.imageUrl = socialUrl;

      // Upload any new safety card images
      for (const [idxStr, file] of Object.entries(cardFiles)) {
        const idx = parseInt(idxStr, 10);
        if (updatedData.safetyFocus.cards[idx]) {
          const cardUrl = await uploadIfPresent(file);
          if (cardUrl) updatedData.safetyFocus.cards[idx].imageUrl = cardUrl;
        }
      }

      await fetchApi("/settings/about_overview", {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      setData(updatedData);
      setStoryFile(null);
      setFacilitiesFile(null);
      setSocialFile(null);
      setCardFiles({});

      toast.success("Company Overview updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save Company Overview");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset Company Overview back to system defaults? All custom text and table changes will be reverted."
    );
    if (!confirmed) return;

    setResetting(true);
    try {
      await fetchApi("/settings/about_overview", {
        method: "PUT",
        body: JSON.stringify(defaultAboutOverviewData),
      });

      setData(defaultAboutOverviewData);
      setStoryFile(null);
      setFacilitiesFile(null);
      setSocialFile(null);
      setCardFiles({});

      toast.success("Company Overview reset to default!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to reset content.");
    } finally {
      setResetting(false);
    }
  };

  // Facilities table handlers
  const handleAddUnit = () => {
    setData((prev) => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        units: [
          ...prev.facilities.units,
          { unit: `Unit ${prev.facilities.units.length + 1}`, location: "" },
        ],
      },
    }));
  };

  const handleRemoveUnit = (index: number) => {
    setData((prev) => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        units: prev.facilities.units.filter((_, i) => i !== index),
      },
    }));
  };

  const handleUnitChange = (index: number, field: keyof FacilityUnit, val: string) => {
    setData((prev) => {
      const units = [...prev.facilities.units];
      units[index] = { ...units[index], [field]: val };
      return {
        ...prev,
        facilities: { ...prev.facilities, units },
      };
    });
  };

  // Safety Cards handlers
  const handleAddCard = () => {
    setData((prev) => ({
      ...prev,
      safetyFocus: {
        ...prev.safetyFocus,
        cards: [
          ...prev.safetyFocus.cards,
          {
            title: "New Protocol",
            description: "Enter protocol details...",
            imageUrl: defaultAboutOverviewData.safetyFocus.cards[0]?.imageUrl || "",
          },
        ],
      },
    }));
  };

  const handleRemoveCard = (index: number) => {
    setData((prev) => ({
      ...prev,
      safetyFocus: {
        ...prev.safetyFocus,
        cards: prev.safetyFocus.cards.filter((_, i) => i !== index),
      },
    }));
  };

  const handleCardChange = (index: number, field: keyof SafetyCard, val: string) => {
    setData((prev) => {
      const cards = [...prev.safetyFocus.cards];
      cards[index] = { ...cards[index], [field]: val };
      return {
        ...prev,
        safetyFocus: { ...prev.safetyFocus, cards },
      };
    });
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16">
      {/* ── Page Header with Top Save Button matching /business-operations ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <FaBuilding /> About Management
          </div>
          <h1 className="text-2xl font-serif font-bold text-brand leading-tight">Company Overview</h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage the content for Our Story, Facilities &amp; Operating Units, Social Impact, Safety &amp;
            Welfare, and Conclusion on the /about page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/about"
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
            form="companyOverviewForm"
            disabled={saving || loading}
            className="admin-btn-primary !rounded-[4px] text-xs flex items-center gap-1.5 cursor-pointer"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaSave className="text-xs" />
            )}
            <span>{saving ? "Saving Changes..." : "Save Company Overview"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-stone-200 border-t-brand rounded-full animate-spin" />
          <p className="text-xs text-stone-500 font-medium">Loading Company Overview...</p>
        </div>
      ) : (
        <form id="companyOverviewForm" onSubmit={handleSave} className="space-y-6">
          {/* ─────────────────────────────────────────────────────────────
              1. OUR STORY SECTION
          ───────────────────────────────────────────────────────────── */}
          <div className="admin-card p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-3 pb-2.5 border-b border-stone-100">
              <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-brand flex items-center justify-center">
                <FaBookOpen />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-brand">1. Our Story Section</h2>
                <p className="text-xs text-stone-500">
                  Header badge, main title, narrative rich text content, and facility side image.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Section Badge / Eyebrow
                </label>
                <input
                  type="text"
                  value={data.story.badge}
                  onChange={(e) =>
                    setData({ ...data, story: { ...data.story, badge: e.target.value } })
                  }
                  placeholder="Our Story"
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Story Heading
                </label>
                <input
                  type="text"
                  value={data.story.heading}
                  onChange={(e) =>
                    setData({ ...data, story: { ...data.story, heading: e.target.value } })
                  }
                  placeholder="Addressing Regional Waste Management Challenges"
                  className="w-full px-3 py-1.5 text-xs sm:text-sm font-semibold bg-stone-50 border border-stone-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
              <div className="lg:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Story Narrative Content (Rich Text)
                </label>
                <RichTextEditor
                  value={data.story.paragraph || data.story.paragraph1 || ""}
                  onChange={(val) =>
                    setData({ ...data, story: { ...data.story, paragraph: val } })
                  }
                  placeholder="Write the full narrative for Our Story section..."
                />
              </div>

              {/* Story Image */}
              <div className="space-y-2 bg-stone-50 p-3 rounded-[4px] border border-stone-200">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Story Section Image
                </label>
                <div className="relative aspect-[4/3] w-full rounded-[4px] overflow-hidden border border-stone-200 bg-stone-100 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      storyFile
                        ? URL.createObjectURL(storyFile)
                        : data.story.imageUrl || defaultAboutOverviewData.story.imageUrl
                    }
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                </div>
                <AdminUploadButton
                  onFileSelect={(file) => setStoryFile(file)}
                  selectedFile={storyFile}
                  label={storyFile ? "Change Story Image" : "Upload Story Image"}
                  roundedClassName="rounded-[4px]"
                />
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              2. FACILITIES & OPERATING UNITS
          ───────────────────────────────────────────────────────────── */}
          <div className="admin-card p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-3 pb-2.5 border-b border-stone-100">
              <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-brand flex items-center justify-center">
                <FaBuilding />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-brand">
                  2. Facilities &amp; Operating Units Section
                </h2>
                <p className="text-xs text-stone-500">
                  Facility heading, overview rich text narrative, image, and editable Unit Designation &amp;
                  Operational Location table.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left 2 Cols: Texts & Table */}
              <div className="lg:col-span-2 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={data.facilities.heading}
                    onChange={(e) =>
                      setData({
                        ...data,
                        facilities: { ...data.facilities, heading: e.target.value },
                      })
                    }
                    placeholder="Facilities & Operating Units"
                    className="w-full px-3 py-1.5 text-xs sm:text-sm font-semibold bg-stone-50 border border-stone-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Facility Overview Paragraph (Rich Text)
                  </label>
                  <RichTextEditor
                    value={data.facilities.paragraph || ""}
                    onChange={(val) =>
                      setData({ ...data, facilities: { ...data.facilities, paragraph: val } })
                    }
                    placeholder="Describe facilities and processing units..."
                  />
                </div>

                {/* Operating Units Table */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                        Operating Units Table
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        Admin can add, remove, and edit processing unit locations.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddUnit}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand text-white rounded-[4px] hover:bg-[#0B2942] transition-colors cursor-pointer shadow-xs"
                    >
                      <FaPlus size={10} /> Add Unit
                    </button>
                  </div>

                  <div className="border border-stone-200 rounded-[4px] overflow-hidden shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-brand text-white">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold w-1/3">Unit Designation</th>
                          <th className="py-2.5 px-3 font-semibold">Operational Location</th>
                          <th className="py-2.5 px-3 font-semibold text-right w-16">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 bg-white">
                        {data.facilities.units.map((unit, idx) => (
                          <tr key={idx} className="hover:bg-stone-50/50">
                            <td className="p-2.5">
                              <input
                                type="text"
                                value={unit.unit}
                                onChange={(e) => handleUnitChange(idx, "unit", e.target.value)}
                                placeholder="Unit 1"
                                className="w-full px-2.5 py-1.5 border border-stone-200 rounded-[4px] bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand font-medium text-xs"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                value={unit.location}
                                onChange={(e) => handleUnitChange(idx, "location", e.target.value)}
                                placeholder="Address / Location"
                                className="w-full px-2.5 py-1.5 border border-stone-200 rounded-[4px] bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand text-xs"
                              />
                            </td>
                            <td className="p-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveUnit(idx)}
                                className="text-red-500 hover:text-red-700 p-1.5 rounded-[4px] hover:bg-red-50 transition-colors cursor-pointer"
                                title="Remove Unit"
                              >
                                <FaTrash size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {data.facilities.units.length === 0 && (
                          <tr>
                            <td colSpan={3} className="py-6 text-center text-stone-400 italic">
                              No operating units added. Click "+ Add Unit" to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right: Facilities Image */}
              <div className="space-y-2 bg-stone-50 p-3 rounded-[4px] border border-stone-200">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Facilities Image
                </label>
                <div className="relative aspect-[4/3] w-full rounded-[4px] overflow-hidden border border-stone-200 bg-stone-100 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      facilitiesFile
                        ? URL.createObjectURL(facilitiesFile)
                        : data.facilities.imageUrl || defaultAboutOverviewData.facilities.imageUrl
                    }
                    alt="Facilities"
                    className="w-full h-full object-cover"
                  />
                </div>
                <AdminUploadButton
                  onFileSelect={(file) => setFacilitiesFile(file)}
                  selectedFile={facilitiesFile}
                  label={facilitiesFile ? "Change Facility Image" : "Upload Facility Image"}
                  roundedClassName="rounded-[4px]"
                />
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3. SOCIAL IMPACT & WORKER WELFARE
          ───────────────────────────────────────────────────────────── */}
          <div className="admin-card p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-3 pb-2.5 border-b border-stone-100">
              <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-brand flex items-center justify-center">
                <FaHandsHelping />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-brand">
                  3. Social Impact &amp; Worker Welfare Section
                </h2>
                <p className="text-xs text-stone-500">
                  Section heading, narrative rich text content, and community impact image.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={data.socialImpact.heading}
                    onChange={(e) =>
                      setData({
                        ...data,
                        socialImpact: { ...data.socialImpact, heading: e.target.value },
                      })
                    }
                    placeholder="Social Impact & Worker Welfare"
                    className="w-full px-3 py-1.5 text-xs sm:text-sm font-semibold bg-stone-50 border border-stone-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Social Impact &amp; Worker Welfare Narrative (Rich Text)
                  </label>
                  <RichTextEditor
                    value={data.socialImpact.paragraph || data.socialImpact.paragraph1 || ""}
                    onChange={(val) =>
                      setData({
                        ...data,
                        socialImpact: { ...data.socialImpact, paragraph: val },
                      })
                    }
                    placeholder="Describe socio-economic impact, informal sector inclusion, and safety commitments..."
                  />
                </div>
              </div>

              {/* Social Impact Image */}
              <div className="space-y-2 bg-stone-50 p-3 rounded-[4px] border border-stone-200">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Social Impact Image
                </label>
                <div className="relative aspect-[4/3] w-full rounded-[4px] overflow-hidden border border-stone-200 bg-stone-100 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      socialFile
                        ? URL.createObjectURL(socialFile)
                        : data.socialImpact.imageUrl ||
                          defaultAboutOverviewData.socialImpact.imageUrl
                    }
                    alt="Social Impact"
                    className="w-full h-full object-cover"
                  />
                </div>
                <AdminUploadButton
                  onFileSelect={(file) => setSocialFile(file)}
                  selectedFile={socialFile}
                  label={socialFile ? "Change Social Image" : "Upload Social Image"}
                  roundedClassName="rounded-[4px]"
                />
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. SAFETY & WELFARE FOCUS (CARDS)
          ───────────────────────────────────────────────────────────── */}
          <div className="admin-card p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-brand flex items-center justify-center">
                  <FaShieldAlt />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-brand">
                    4. Safety &amp; Welfare Focus (Cards)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Edit heading, subtext, and cards with image, title, and paragraph.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand text-white rounded-[4px] hover:bg-[#0B2942] transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <FaPlus size={10} /> Add Safety Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={data.safetyFocus.heading}
                  onChange={(e) =>
                    setData({
                      ...data,
                      safetyFocus: { ...data.safetyFocus, heading: e.target.value },
                    })
                  }
                  placeholder="Safety & Welfare Focus"
                  className="w-full px-3 py-2 text-sm font-semibold bg-stone-50 border border-stone-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Section Subtitle / Description
                </label>
                <input
                  type="text"
                  value={data.safetyFocus.description}
                  onChange={(e) =>
                    setData({
                      ...data,
                      safetyFocus: { ...data.safetyFocus, description: e.target.value },
                    })
                  }
                  placeholder="Comprehensive protocols ensuring the health..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand text-stone-800"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {data.safetyFocus.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-[4px] border border-stone-200 bg-stone-50/70 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-[4px] border border-stone-200">
                      Card #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(idx)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-[4px] hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Card"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Card Heading
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleCardChange(idx, "title", e.target.value)}
                      placeholder="e.g. Occupational Training"
                      className="w-full px-3 py-1.5 text-sm font-semibold bg-white border border-stone-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand text-stone-900"
                    />
                  </div>

                  {/* Card Image */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Card Image
                    </label>
                    <div className="relative aspect-[16/9] w-full rounded-[4px] overflow-hidden border border-stone-200 bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          cardFiles[idx]
                            ? URL.createObjectURL(cardFiles[idx])
                            : card.imageUrl || defaultAboutOverviewData.safetyFocus.cards[0]?.imageUrl
                        }
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <AdminUploadButton
                      onFileSelect={(file) => {
                        if (file) setCardFiles((prev) => ({ ...prev, [idx]: file }));
                      }}
                      selectedFile={cardFiles[idx] || null}
                      label={cardFiles[idx] ? "Change Card Image" : "Upload Card Image"}
                      roundedClassName="rounded-[4px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Card Description
                    </label>
                    <textarea
                      rows={3}
                      value={card.description}
                      onChange={(e) => handleCardChange(idx, "description", e.target.value)}
                      placeholder="Detailed description of protocol..."
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand text-stone-700 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              5. CONCLUSION SECTION
          ───────────────────────────────────────────────────────────── */}
          <div className="admin-card p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <div className="w-8 h-8 rounded-[4px] bg-emerald-50 text-brand flex items-center justify-center">
                <FaQuoteRight />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-brand">5. Conclusion Section</h2>
                <p className="text-xs text-stone-500">
                  Heading and concluding statement paragraph at the bottom of the About page.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Conclusion Heading
              </label>
              <input
                type="text"
                value={data.conclusion.heading}
                onChange={(e) =>
                  setData({
                    ...data,
                    conclusion: { ...data.conclusion, heading: e.target.value },
                  })
                }
                placeholder="Conclusion"
                className="w-full px-3 py-2 text-sm font-semibold bg-stone-50 border border-stone-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Conclusion Paragraph (Rich Text Editor)
              </label>
              <RichTextEditor
                value={data.conclusion.paragraph}
                onChange={(html) =>
                  setData({
                    ...data,
                    conclusion: { ...data.conclusion, paragraph: html },
                  })
                }
                minHeight="140px"
              />
            </div>
          </div>

          {/* ── Submit Bar ── */}
          <div className="admin-card p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-stone-500">
              All changes will immediately reflect on the live{" "}
              <code className="text-brand font-semibold">/about</code> page.
            </p>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 bg-brand hover:bg-[#0B2942] text-white font-semibold text-sm rounded-[4px] shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FaSave />
              <span>{saving ? "Saving Changes..." : "Save Company Overview"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
