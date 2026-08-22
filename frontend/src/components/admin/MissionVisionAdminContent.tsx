"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaMapSigns } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
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
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    stepNo: 1,
    year: "",
    subject: "",
    description: "",
  });

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
          headers: { "Content-Type": "application/json" }
        });
        toast.success("Journey milestone updated successfully");
      } else {
        await fetchApi("/journey", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" }
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
    <div className="space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-brand">Mission, Vision & History</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage the timeline, partners, and credentials that define your company.
          </p>
        </div>
      </div>

      <div className="space-y-5">

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


      </div>

      {/* JOURNEY MILESTONE MODAL */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-lg">
            <div className="admin-modal-header">
              <h2 className="text-xl font-serif font-bold text-brand">
                {editingId ? 'Edit Milestone' : 'Add New Milestone'}
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
                      onChange={e => setFormData({ ...formData, stepNo: parseInt(e.target.value) || 0 })}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Year <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g. 2009"
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
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="E.g. Company Founded"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                {submitting ? 'Saving...' : 'Save Milestone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
