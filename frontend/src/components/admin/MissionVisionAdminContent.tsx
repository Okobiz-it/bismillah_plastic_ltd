"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaMapSigns,
  FaSave,
  FaUndo,
  FaBullseye,
  FaEye,
  FaStream,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import {
  AboutMissionVisionData,
  defaultAboutMissionVisionData,
} from "@/data/aboutData";
import RichTextEditor from "@/components/shared/RichTextEditor";
import CertificationsAdminContent from "./CertificationsAdminContent";
import ClientsAdminContent from "./ClientsAdminContent";
import GoalsAdminContent from "./GoalsAdminContent";

interface Journey {
  _id: string;
  stepNo: number;
  year: string;
  subject: string;
  description: string;
}

export default function MissionVisionAdminContent() {
  const toast = useToast();

  // Mission, Vision, and Integrated Value Chain state
  const [mvData, setMvData] = useState<AboutMissionVisionData>(defaultAboutMissionVisionData);
  const [mvLoading, setMvLoading] = useState(true);
  const [mvSaving, setMvSaving] = useState(false);
  const [mvResetting, setMvResetting] = useState(false);

  // Journeys state
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    stepNo: 1,
    year: "",
    subject: "",
    description: "",
  });

  const loadMissionVisionData = async () => {
    setMvLoading(true);
    try {
      const res = await fetchApi("/settings/about_mission_vision");
      if (res && res.data) {
        setMvData({
          mission: { ...defaultAboutMissionVisionData.mission, ...res.data.mission },
          vision: { ...defaultAboutMissionVisionData.vision, ...res.data.vision },
          valueChain: { ...defaultAboutMissionVisionData.valueChain, ...res.data.valueChain },
        });
      }
    } catch {
      setMvData(defaultAboutMissionVisionData);
    } finally {
      setMvLoading(false);
    }
  };

  const handleSaveMissionVision = async (e: React.FormEvent) => {
    e.preventDefault();
    setMvSaving(true);
    try {
      await fetchApi("/settings/about_mission_vision", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: mvData }),
      });
      toast.success("Mission, Vision & Value Chain updated successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update Mission & Vision content");
    } finally {
      setMvSaving(false);
    }
  };

  const handleResetMissionVision = async () => {
    if (!window.confirm("Reset Mission, Vision & Integrated Value Chain to default content?")) {
      return;
    }
    setMvResetting(true);
    try {
      await fetchApi("/settings/about_mission_vision", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: defaultAboutMissionVisionData }),
      });
      setMvData(defaultAboutMissionVisionData);
      toast.success("Reset to default values successfully");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to reset to default");
    } finally {
      setMvResetting(false);
    }
  };

  const loadJourneys = async () => {
    try {
      const res = await fetchApi("/journey");
      setJourneys(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMissionVisionData();
    loadJourneys();
  }, []);

  const openModal = (journey?: Journey) => {
    if (journey) {
      setEditingId(journey._id);
      setFormData({
        stepNo: journey.stepNo,
        year: journey.year,
        subject: journey.subject,
        description: journey.description,
      });
    } else {
      setEditingId(null);
      setFormData({ stepNo: journeys.length + 1, year: "", subject: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await fetchApi(`/journey/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Journey milestone updated successfully");
      } else {
        await fetchApi("/journey", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Journey milestone added successfully");
      }

      closeModal();
      loadJourneys();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save journey milestone.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this journey milestone?")) {
      try {
        await fetchApi(`/journey/${id}`, { method: "DELETE" });
        toast.success("Journey milestone deleted successfully");
        loadJourneys();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete journey milestone.");
      }
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16">
      {/* ── Top Header matching /business-operations ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <FaBullseye /> Corporate Philosophy
          </div>
          <h1 className="text-2xl font-serif font-bold text-brand leading-tight">Mission &amp; Vision</h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage your mission, vision, integrated value chain, and company journey timeline.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/about/mission-vision"
            target="_blank"
            className="admin-btn-secondary !rounded-[4px] text-xs flex items-center gap-1.5"
          >
            <FaExternalLinkAlt className="text-xs" />
            <span>View Public Page</span>
          </Link>
          <button
            type="submit"
            form="missionVisionForm"
            disabled={mvSaving}
            className="admin-btn-primary !rounded-[4px] text-xs flex items-center gap-1.5 cursor-pointer"
          >
            {mvSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaSave className="text-xs" />
            )}
            <span>{mvSaving ? "Saving Changes..." : "Save Mission & Vision"}</span>
          </button>
        </div>
      </div>

      {/* MISSION, VISION & INTEGRATED VALUE CHAIN FORM */}
      <form id="missionVisionForm" onSubmit={handleSaveMissionVision} className="space-y-6">
        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Mission Card */}
          <div className="admin-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 mb-3.5">
              <div className="w-8 h-8 rounded-[4px] bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
                <FaBullseye />
              </div>
              <div>
                <h3 className="font-semibold text-brand text-base">Our Mission</h3>
                <p className="text-xs text-stone-500">Core purpose and regional objectives</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Card Heading / Title
                </label>
                <input
                  type="text"
                  value={mvData.mission.title}
                  onChange={(e) =>
                    setMvData({
                      ...mvData,
                      mission: { ...mvData.mission, title: e.target.value },
                    })
                  }
                  placeholder="e.g. Our Mission"
                  className="admin-input rounded-[4px]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Mission Content (Rich Text Editor)
                </label>
                <RichTextEditor
                  value={mvData.mission.description}
                  onChange={(html) =>
                    setMvData({
                      ...mvData,
                      mission: { ...mvData.mission, description: html },
                    })
                  }
                  minHeight="150px"
                />
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="admin-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 mb-3.5">
              <div className="w-8 h-8 rounded-[4px] bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                <FaEye />
              </div>
              <div>
                <h3 className="font-semibold text-brand text-base">Our Vision</h3>
                <p className="text-xs text-stone-500">Long-term vision and industry aspirations</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Card Heading / Title
                </label>
                <input
                  type="text"
                  value={mvData.vision.title}
                  onChange={(e) =>
                    setMvData({
                      ...mvData,
                      vision: { ...mvData.vision, title: e.target.value },
                    })
                  }
                  placeholder="e.g. Our Vision"
                  className="admin-input rounded-[4px]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Vision Content (Rich Text Editor)
                </label>
                <RichTextEditor
                  value={mvData.vision.description}
                  onChange={(html) =>
                    setMvData({
                      ...mvData,
                      vision: { ...mvData.vision, description: html },
                    })
                  }
                  minHeight="150px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Value Chain Section */}
        <div className="admin-card p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 mb-3.5">
            <div className="w-8 h-8 rounded-[4px] bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm">
              <FaStream />
            </div>
            <div>
              <h3 className="font-semibold text-brand text-base">Integrated Value Chain</h3>
              <p className="text-xs text-stone-500">
                Business philosophy and end-to-end recycling process
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Eyebrow / Badge Text
                </label>
                <input
                  type="text"
                  value={mvData.valueChain.badge}
                  onChange={(e) =>
                    setMvData({
                      ...mvData,
                      valueChain: { ...mvData.valueChain, badge: e.target.value },
                    })
                  }
                  placeholder="e.g. BUSINESS PHILOSOPHY"
                  className="admin-input rounded-[4px]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={mvData.valueChain.heading}
                  onChange={(e) =>
                    setMvData({
                      ...mvData,
                      valueChain: { ...mvData.valueChain, heading: e.target.value },
                    })
                  }
                  placeholder="e.g. Integrated Value Chain"
                  className="admin-input rounded-[4px]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Value Chain Narrative (Rich Text Editor)
              </label>
              <RichTextEditor
                value={
                  mvData.valueChain.description ||
                  (mvData.valueChain.paragraph1
                    ? `<p>${mvData.valueChain.paragraph1}</p>${
                        mvData.valueChain.paragraph2 ? `<p>${mvData.valueChain.paragraph2}</p>` : ""
                      }`
                    : "")
                }
                onChange={(html) =>
                  setMvData({
                    ...mvData,
                    valueChain: {
                      ...mvData.valueChain,
                      description: html,
                      paragraph1: html,
                      paragraph2: "",
                    },
                  })
                }
                minHeight="170px"
              />
            </div>
          </div>
        </div>

        {/* Action Button for Mission, Vision & Value Chain */}
        <div className="admin-card p-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={mvSaving}
            className="admin-btn-primary inline-flex items-center gap-2 rounded-[4px]"
          >
            <FaSave />
            <span>{mvSaving ? "Saving Changes..." : "Save Mission, Vision & Value Chain"}</span>
          </button>
        </div>
      </form>

      {/* JOURNEY MILESTONES SECTION */}
      <section className="admin-card !p-0 overflow-hidden relative">
        <div className="p-4 md:p-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-brand">Journey Milestones</h3>
              <p className="text-sm text-stone-500 mt-1">Organize the chronological milestones of your company.</p>
            </div>
            <button
              onClick={() => openModal()}
              className="admin-btn-primary self-start sm:self-auto w-full sm:w-auto"
            >
              <FaPlus /> Add Milestone
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-stone-200 border-t-gold rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Step No</th>
                    <th>Year</th>
                    <th>Subject</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {journeys.map((journey) => (
                    <tr key={journey._id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 text-xs flex items-center justify-center font-bold">
                          {journey.stepNo}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gold">{journey.year}</td>
                      <td className="py-3.5 px-4 font-medium text-brand">{journey.subject}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openModal(journey)} className="admin-btn-icon" title="Edit">
                            <FaEdit size={14} />
                          </button>
                          <button onClick={() => handleDelete(journey._id)} className="admin-btn-icon-danger" title="Delete">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {journeys.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-stone-500 bg-stone-50/50">
                        <FaMapSigns className="w-8 h-8 mx-auto text-stone-300 mb-3" />
                        No journey milestones found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* FUTURE GOALS SECTION */}
      <section className="admin-card !p-0 overflow-hidden relative">
        <GoalsAdminContent />
      </section>

      {/* CLIENTS SECTION */}
      <section className="admin-card !p-0 overflow-hidden relative">
        <ClientsAdminContent />
      </section>

      {/* CERTIFICATIONS SECTION */}
      <section className="admin-card !p-0 overflow-hidden relative">
        <CertificationsAdminContent />
      </section>

      {/* JOURNEY MILESTONE MODAL */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-lg">
            <div className="admin-modal-header">
              <h2 className="text-xl font-serif font-bold text-brand">
                {editingId ? "Edit Milestone" : "Add New Milestone"}
              </h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-700 transition-colors p-2 cursor-pointer">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <form id="journeyForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Step Number <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      value={formData.stepNo}
                      onChange={(e) => setFormData({ ...formData, stepNo: parseInt(e.target.value) || 0 })}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Year <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g. 2016"
                      className="admin-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Subject / Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="E.g. Company Founded"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide details about this milestone..."
                    className="admin-input h-28 resize-none"
                  />
                </div>
              </form>
            </div>

            <div className="admin-modal-footer">
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
                form="journeyForm"
                disabled={submitting}
                className="admin-btn-primary w-full sm:w-auto"
              >
                {submitting ? "Saving..." : "Save Milestone"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
