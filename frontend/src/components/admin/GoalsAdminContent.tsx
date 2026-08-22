"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBullseye } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";

interface Goal {
  _id: string;
  stepNo: number;
  year: string;
  title: string;
  description: string;
}

export default function GoalsAdminContent() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    stepNo: 1,
    year: "",
    title: "",
    description: "",
  });

  const loadGoals = async () => {
    try {
      const res = await fetchApi("/goals");
      setGoals(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const openModal = (goal?: Goal) => {
    if (goal) {
      setEditingId(goal._id);
      setFormData({
        stepNo: goal.stepNo || 1,
        year: goal.year,
        title: goal.title,
        description: goal.description,
      });
    } else {
      setEditingId(null);
      setFormData({
        stepNo: Math.min(goals.length + 1, 4),
        year: "",
        title: "",
        description: ""
      });
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
        await fetchApi(`/goals/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" }
        });
        toast.success("Future goal updated successfully");
      } else {
        await fetchApi("/goals", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" }
        });
        toast.success("Future goal added successfully");
      }

      closeModal();
      loadGoals();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save future goal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this future goal?")) {
      try {
        await fetchApi(`/goals/${id}`, { method: "DELETE" });
        toast.success("Future goal deleted successfully");
        loadGoals();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete future goal.");
      }
    }
  };

  return (
    <div className="p-4 md:p-5 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-brand">Our Future Goals</h3>
          <p className="text-sm text-stone-500 mt-1">Manage up to 4 strategic future goals for your company roadmap.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="admin-btn-primary w-full sm:w-auto"
        >
          <FaPlus /> Add Goal
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
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Step No</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Year</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Goal Name</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600">Description</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-stone-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {goals.map((goal) => (
                <tr key={goal._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-brand text-xs flex items-center justify-center font-bold">
                      {goal.stepNo || "-"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gold">{goal.year}</td>
                  <td className="py-3.5 px-4 font-medium text-brand">{goal.title}</td>
                  <td className="py-3.5 px-4 text-sm text-stone-600 max-w-xs truncate">{goal.description}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openModal(goal)} className="admin-btn-icon" title="Edit">
                        <FaEdit size={14} />
                      </button>
                      <button onClick={() => handleDelete(goal._id)} className="admin-btn-icon-danger" title="Delete">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {goals.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-500 bg-stone-50/50">
                    <FaBullseye className="w-8 h-8 mx-auto text-stone-300 mb-3" />
                    No future goals found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-lg">
            <div className="admin-modal-header">
              <h2 className="text-xl font-serif font-bold text-brand">{editingId ? 'Edit Goal' : 'Add New Future Goal'}</h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-700 transition-colors p-2 cursor-pointer">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <form id="goalForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Step Number (1-4) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      required
                      value={formData.stepNo}
                      onChange={e => setFormData({ ...formData, stepNo: parseInt(e.target.value) || 1 })}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Target Year <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g. 2026"
                      className="admin-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Goal Name / Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="E.g. Carbon Neutrality"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Goal Description <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this milestone target..."
                    className="admin-input h-28 resize-none"
                  />
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
                form="goalForm"
                disabled={submitting}
                className="admin-btn-primary w-full sm:w-auto"
              >
                {submitting ? 'Saving...' : 'Save Goal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
