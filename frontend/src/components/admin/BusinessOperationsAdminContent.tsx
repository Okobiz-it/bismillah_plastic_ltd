"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchApi, uploadFile } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import {
  BusinessOperationsData,
  defaultBusinessOperationsData,
  OperationStep,
  OperationDetailSection,
} from "@/data/businessOperationsData";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";
import IconPicker from "@/components/admin/shared/IconPicker";
import {
  FaSave,
  FaUndo,
  FaPlus,
  FaTrash,
  FaIndustry,
  FaCogs,
  FaExternalLinkAlt,
  FaSpinner,
  FaTable,
  FaImage,
} from "react-icons/fa";

export default function BusinessOperationsAdminContent() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [uploadingSectionId, setUploadingSectionId] = useState<string | null>(null);

  const [data, setData] = useState<BusinessOperationsData>(defaultBusinessOperationsData);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/settings/business_operations");
      if (res && res.data) {
        setData({
          header: {
            ...defaultBusinessOperationsData.header,
            ...(res.data.header || {}),
          },
          steps:
            res.data.steps && res.data.steps.length > 0
              ? res.data.steps
              : defaultBusinessOperationsData.steps,
          sections:
            res.data.sections && res.data.sections.length > 0
              ? res.data.sections
              : defaultBusinessOperationsData.sections,
        });
      }
    } catch {
      setData(defaultBusinessOperationsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await fetchApi("/settings/business_operations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast.success("Business Operations content updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save Business Operations content");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset all Business Operations content to default presets?")) {
      return;
    }
    setResetting(true);
    try {
      await fetchApi("/settings/business_operations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultBusinessOperationsData),
      });
      setData(defaultBusinessOperationsData);
      toast.success("Reset to default values successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to reset");
    } finally {
      setResetting(false);
    }
  };

  // ── Step Handlers ──────────────────────────────────────────
  const addStep = () => {
    const nextStepNum = (data.steps?.length || 0) + 1;
    const newStep: OperationStep = {
      id: `step-${Date.now()}`,
      step: nextStepNum,
      title: `Step ${nextStepNum}`,
      description: "",
      icon: "FaCogs",
    };
    setData((prev) => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const updateStep = (index: number, field: keyof OperationStep, value: any) => {
    setData((prev) => {
      const updated = [...prev.steps];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, steps: updated };
    });
  };

  const removeStep = (index: number) => {
    setData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  // ── Section Handlers ───────────────────────────────────────
  const addSection = () => {
    const newSection: OperationDetailSection = {
      id: `sec-${Date.now()}`,
      title: "New Process Section",
      content: "",
      imageUrl: "",
      imageAlt: "Process operations",
      imageLeft: data.sections.length % 2 === 0,
      hasCapacityTable: false,
      capacityTable: [
        { year: "Year 1", capacity: "15,000 MT" },
        { year: "Year 2", capacity: "17,000 MT" },
        { year: "Year 3", capacity: "20,000 MT" },
        { year: "Year 4", capacity: "20,000 MT" },
        { year: "Year 5", capacity: "24,000 MT" },
      ],
    };
    setData((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const updateSection = (
    index: number,
    field: keyof OperationDetailSection,
    value: any
  ) => {
    setData((prev) => {
      const updated = [...prev.sections];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sections: updated };
    });
  };

  const removeSection = (index: number) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  // ── Capacity Table Row Handlers ───────────────────────────
  const addCapacityRow = (sectionIndex: number) => {
    setData((prev) => {
      const updatedSections = [...prev.sections];
      const targetSec = { ...updatedSections[sectionIndex] };
      const currentRows = targetSec.capacityTable || [];
      targetSec.capacityTable = [
        ...currentRows,
        { year: `Year ${currentRows.length + 1}`, capacity: "" },
      ];
      updatedSections[sectionIndex] = targetSec;
      return { ...prev, sections: updatedSections };
    });
  };

  const updateCapacityRow = (
    sectionIndex: number,
    rowIndex: number,
    field: "year" | "capacity",
    value: string
  ) => {
    setData((prev) => {
      const updatedSections = [...prev.sections];
      const targetSec = { ...updatedSections[sectionIndex] };
      const updatedRows = [...(targetSec.capacityTable || [])];
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: value };
      targetSec.capacityTable = updatedRows;
      updatedSections[sectionIndex] = targetSec;
      return { ...prev, sections: updatedSections };
    });
  };

  const removeCapacityRow = (sectionIndex: number, rowIndex: number) => {
    setData((prev) => {
      const updatedSections = [...prev.sections];
      const targetSec = { ...updatedSections[sectionIndex] };
      targetSec.capacityTable = (targetSec.capacityTable || []).filter(
        (_, i) => i !== rowIndex
      );
      updatedSections[sectionIndex] = targetSec;
      return { ...prev, sections: updatedSections };
    });
  };

  // ── Image Upload ──────────────────────────────────────────
  const handleSectionImageUpload = async (sectionIndex: number, file: File | null) => {
    if (!file) return;
    const secId = data.sections[sectionIndex]?.id || String(sectionIndex);
    setUploadingSectionId(secId);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadFile("/settings/upload", fd);
      if (res.data?.imageUrl) {
        updateSection(sectionIndex, "imageUrl", res.data.imageUrl);
        toast.success("Image uploaded successfully!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploadingSectionId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-card p-12 text-center text-stone-500">
        <FaSpinner className="animate-spin text-2xl mx-auto mb-2 text-brand" />
        <p>Loading Business Operations settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <FaIndustry /> Value Chain Management
          </div>
          <h1 className="text-2xl font-serif font-bold text-brand">Business Operations</h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage operation steps, recycling process details, products &amp; outputs, and processing capacity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/business-operations"
            target="_blank"
            className="admin-btn-secondary !rounded-[4px] text-xs flex items-center gap-1.5"
          >
            <FaExternalLinkAlt className="text-xs" /> View Public Page
          </Link>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving || resetting}
            className="admin-btn-primary !rounded-[4px] text-xs flex items-center gap-1.5"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* ─── SECTION 1: HEADER & INTRO NARRATIVE ────────────────────── */}
      <div className="admin-card space-y-4">
        <h3 className="text-base font-bold text-brand font-serif pb-2 border-b border-stone-100 flex items-center gap-2">
          <FaIndustry className="text-emerald-600" /> Header &amp; Introduction Narrative
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
              Eyebrow / Badge Text
            </label>
            <input
              type="text"
              value={data.header.badge}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, badge: e.target.value },
                }))
              }
              className="admin-input"
              placeholder="e.g. Business Operations"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
              Section Main Headline
            </label>
            <input
              type="text"
              value={data.header.headline}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, headline: e.target.value },
                }))
              }
              className="admin-input"
              placeholder="e.g. How Our Business Operations Works"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
              Workflow Introduction Paragraph
            </label>
            <textarea
              rows={3}
              value={data.header.description}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, description: e.target.value },
                }))
              }
              className="admin-input resize-y"
              placeholder="Describe the end-to-end operational flow..."
            />
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: SEQUENTIAL PROCESS STEPS ────────────────────── */}
      <div className="admin-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-base font-bold text-brand font-serif flex items-center gap-2">
              <FaCogs className="text-emerald-600" /> Business Operation Steps
            </h3>
            <p className="text-xs text-stone-500">
              Manage sequential operations like Collection, Sorting, Aggregation, Mechanical Processing, etc. with custom icons.
            </p>
          </div>
          <button
            type="button"
            onClick={addStep}
            className="admin-btn-primary text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <FaPlus className="w-2.5 h-2.5" /> Add Step
          </button>
        </div>

        <div className="space-y-4">
          {data.steps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="bg-stone-50 p-4 sm:p-5 rounded-[4px] border border-stone-200 space-y-3 relative shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-200/80">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Step {idx + 1}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 font-medium">Icon:</span>
                    <IconPicker
                      value={step.icon || "FaCogs"}
                      onChange={(iconKey) => updateStep(idx, "icon", iconKey)}
                      label="Pick Icon"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeStep(idx)}
                    className="text-stone-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Step"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                    Step Title
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(idx, "title", e.target.value)}
                    placeholder="e.g. Collection"
                    className="admin-input"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                    Step Description
                  </label>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => updateStep(idx, "description", e.target.value)}
                    placeholder="Describe how this step functions..."
                    className="admin-input resize-y text-xs"
                  />
                </div>
              </div>
            </div>
          ))}

          {data.steps.length === 0 && (
            <div className="text-center py-8 bg-stone-50 border border-dashed border-stone-300 rounded-[4px] text-stone-500 text-xs">
              No operation steps defined. Click &quot;Add Step&quot; to begin.
            </div>
          )}
        </div>
      </div>

      {/* ─── SECTION 3: CONTENT / PROCESS DETAIL SECTIONS ────────────── */}
      <div className="admin-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-base font-bold text-brand font-serif flex items-center gap-2">
              <FaImage className="text-emerald-600" /> Detail Content Sections
            </h3>
            <p className="text-xs text-stone-500">
              Manage full visual narrative blocks such as Recycling &amp; Processing, Products &amp; Outputs, Business &amp; Operational Impact, and Environmental Contribution.
            </p>
          </div>
          <button
            type="button"
            onClick={addSection}
            className="admin-btn-primary text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <FaPlus className="w-2.5 h-2.5" /> Add Content Section
          </button>
        </div>

        <div className="space-y-6">
          {data.sections.map((section, sIdx) => (
            <div
              key={section.id || sIdx}
              className="bg-stone-50 p-5 rounded-[4px] border border-stone-200 space-y-4 relative shadow-xs"
            >
              {/* Section Header Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
                    {sIdx + 1}
                  </span>
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Content Block #{sIdx + 1}: {section.title || "Untitled Section"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Image side toggle */}
                  <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={section.imageLeft}
                      onChange={(e) => updateSection(sIdx, "imageLeft", e.target.checked)}
                      className="rounded text-brand"
                    />
                    <span>Image on Left</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeSection(sIdx)}
                    className="text-stone-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Content Section"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Content */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                    Section Heading / Title
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(sIdx, "title", e.target.value)}
                    placeholder="e.g. Recycling & Processing"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                    Section Content Narrative
                  </label>
                  <textarea
                    rows={4}
                    value={section.content}
                    onChange={(e) => updateSection(sIdx, "content", e.target.value)}
                    placeholder="Detailed explanation of this business operations process..."
                    className="admin-input resize-y text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Image Uploader & Preview (Button only, no URL input) */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                  Section Feature Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {section.imageUrl && (
                    <div className="w-32 h-20 rounded-[4px] border border-stone-300 overflow-hidden relative shadow-xs shrink-0 bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={section.imageUrl}
                        alt={section.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <AdminUploadButton
                      onFileSelect={(file) => handleSectionImageUpload(sIdx, file)}
                      isLoading={uploadingSectionId === (section.id || String(sIdx))}
                      label={section.imageUrl ? "Change Section Image" : "Upload Section Image"}
                      roundedClassName="rounded-[4px]"
                    />
                    <p className="text-[10px] text-stone-400">High-resolution JPG, PNG or WEBP recommended.</p>
                  </div>
                </div>
              </div>

              {/* Capacity Table Toggle & Editor (Crucial for Business & Operational Impact) */}
              <div className="pt-3 border-t border-stone-200 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-brand uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={!!section.hasCapacityTable}
                    onChange={(e) => updateSection(sIdx, "hasCapacityTable", e.target.checked)}
                    className="rounded-[4px] text-brand"
                  />
                  <FaTable className="text-emerald-600" />
                  <span>Include Operating Period &amp; Estimated Processing Capacity Table</span>
                </label>

                {section.hasCapacityTable && (
                  <div className="bg-white p-4 rounded-[4px] border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                        Operating Period &amp; Capacity Table Rows
                      </span>
                      <button
                        type="button"
                        onClick={() => addCapacityRow(sIdx)}
                        className="admin-btn-secondary !rounded-[4px] text-xs flex items-center gap-1.5 cursor-pointer"
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

                      {(section.capacityTable || []).map((row, rIdx) => (
                        <div
                          key={rIdx}
                          className="grid grid-cols-12 gap-3 items-center bg-stone-50 p-2 rounded-[4px] border border-stone-200"
                        >
                          <div className="col-span-3 sm:col-span-3">
                            <input
                              type="text"
                              value={row.year}
                              onChange={(e) =>
                                updateCapacityRow(sIdx, rIdx, "year", e.target.value)
                              }
                              className="admin-input !rounded-[4px] text-xs w-full"
                              placeholder="e.g. Year 1"
                            />
                          </div>
                          <div className="col-span-8 sm:col-span-8">
                            <input
                              type="text"
                              value={row.capacity}
                              onChange={(e) =>
                                updateCapacityRow(sIdx, rIdx, "capacity", e.target.value)
                              }
                              className="admin-input !rounded-[4px] text-xs w-full"
                              placeholder="e.g. 15,000 MT / year"
                            />
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeCapacityRow(sIdx, rIdx)}
                              className="text-stone-400 hover:text-red-600 p-2 rounded-[4px] hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                              title="Delete Row"
                            >
                              <FaTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {(!section.capacityTable || section.capacityTable.length === 0) && (
                        <div className="text-center py-4 text-xs text-stone-400">
                          No table rows. Click &quot;Add Row&quot; to add capacity targets.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {data.sections.length === 0 && (
            <div className="text-center py-8 bg-stone-50 border border-dashed border-stone-300 rounded-[4px] text-stone-500 text-xs">
              No detail content sections found. Click &quot;Add Content Section&quot; to create one.
            </div>
          )}
        </div>
      </div>

      {/* Floating / Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 bg-stone-50 p-3 sm:p-4 rounded-[4px] border border-stone-200">
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving || resetting}
          className="admin-btn-primary !rounded-[4px] inline-flex items-center gap-2"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          <span>{saving ? "Saving Changes..." : "Save Business Operations Content"}</span>
        </button>
      </div>
    </div>
  );
}
