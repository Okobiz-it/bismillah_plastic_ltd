"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUsers } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import SafeImage from "@/components/shared/SafeImage";
import RichTextEditor from "@/components/shared/RichTextEditor";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  description: string;
  email?: string;
  linkedin?: string;
  whatsapp?: string;
  twitter?: string;
  imageUrl: string;
}

export default function ManagementAdminContent() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    description: "",
    email: "",
    linkedin: "",
    whatsapp: "",
    twitter: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadTeam = async () => {
    try {
      const res = await fetchApi("/team");
      setTeam(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const openModal = (member?: TeamMember) => {
    if (member) {
      setEditingId(member._id);
      setFormData({ 
        name: member.name, 
        position: member.position,
        description: member.description,
        email: member.email || "",
        linkedin: member.linkedin || "",
        whatsapp: member.whatsapp || "",
        twitter: member.twitter || "",
      });
    } else {
      setEditingId(null);
      setFormData({ 
        name: "", 
        position: "",
        description: "",
        email: "",
        linkedin: "",
        whatsapp: "",
        twitter: "",
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const descCharCount = (formData.description || "").replace(/<[^>]+>/g, "").trim().length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("position", formData.position);
      fd.append("description", formData.description);
      if (formData.email) fd.append("email", formData.email);
      if (formData.linkedin) fd.append("linkedin", formData.linkedin);
      if (formData.whatsapp) fd.append("whatsapp", formData.whatsapp);
      if (formData.twitter) fd.append("twitter", formData.twitter);
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await fetchApi(`/team/${editingId}`, { method: "PUT", body: fd });
        toast.success("Team member updated successfully");
      } else {
        await fetchApi("/team", { method: "POST", body: fd });
        toast.success("Team member added successfully");
      }

      closeModal();
      loadTeam();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save team member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        await fetchApi(`/team/${id}`, { method: "DELETE" });
        toast.success("Team member deleted successfully");
        loadTeam();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete team member.");
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="admin-card">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-brand">Management Team</h2>
          <p className="text-sm text-stone-500 mt-1">Manage the leadership and core team members.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="admin-btn-primary w-full sm:w-auto"
        >
          <FaPlus /> Add Member
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Position</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member._id} className="border-b border-stone-100 hover:bg-stone-50/60 transition-colors">
                <td className="py-3.5 px-4 w-28">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-stone-200/80 bg-stone-100 shadow-2xs shrink-0 relative group">
                    <SafeImage src={member.imageUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-brand">{member.name}</td>
                <td className="py-3 px-4 text-sm text-stone-600">{member.position}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openModal(member)} className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(member._id)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {team.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-stone-500 bg-stone-50/50">
                  <FaUsers className="w-8 h-8 mx-auto text-stone-300 mb-3" />
                  No team members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-2xl">
            <div className="admin-modal-header">
              <h3 className="text-lg font-bold text-brand">{editingId ? 'Edit' : 'Add'} Management Member</h3>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors">
                <FaTimes />
              </button>
            </div>

            <div className="admin-modal-body">
              <form id="team-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Position</label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={e => setFormData({ ...formData, position: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide">Description (Bio)</label>
                  </div>
                  <RichTextEditor
                    value={formData.description}
                    onChange={val => setFormData({ ...formData, description: val })}
                    placeholder="Enter management bio..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-100 pt-5">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">LinkedIn (Optional)</label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">WhatsApp (Optional)</label>
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="e.g. +8801700000000"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Twitter / X (Optional)</label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="e.g. twitter.com/username"
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-5">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Image {editingId ? '(Optional)' : '*'}</label>
                  <AdminUploadButton
                    onFileSelect={file => setImageFile(file)}
                    selectedFile={imageFile}
                    label="Upload Photo"
                  />
                </div>
              </form>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                onClick={closeModal}
                className="admin-btn-secondary w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="team-form"
                disabled={submitting}
                className="admin-btn-primary w-full sm:w-auto"
              >
                {submitting ? 'Saving...' : 'Save Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
