"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaHeading, FaImage } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import SafeImage from "@/components/shared/SafeImage";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";

interface ServiceStat {
  _id: string;
  category: "import" | "export" | "supply";
  value: string;
  label: string;
}

interface ServiceHeaderData {
  _id?: string;
  category: "import" | "export" | "supply";
  headline: string;
  description: string;
}

interface ServicePartnerData {
  _id: string;
  category: "import" | "export" | "supply";
  name: string;
  imageUrl: string;
}

const CATEGORIES: Record<"import" | "export" | "supply", { title: string; desc: string }> = {
  import: { title: "Import Services Section", desc: "Heading, subheading, stats & partners for Import" },
  export: { title: "Export Services Section", desc: "Heading, subheading, stats & partners for Export" },
  supply: { title: "Supply Services Section", desc: "Heading, subheading, stats & partners for Supply" },
};

export default function ServicesAdminContent() {
  const [activeTab, setActiveTab] = useState<"import" | "export" | "supply">("import");
  
  const [stats, setStats] = useState<ServiceStat[]>([]);
  const [headers, setHeaders] = useState<ServiceHeaderData[]>([]);
  const [partners, setPartners] = useState<ServicePartnerData[]>([]);

  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Stat Modal State
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [submittingStat, setSubmittingStat] = useState(false);
  const [statFormData, setStatFormData] = useState({ value: "", label: "" });

  // Header Modal State
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [submittingHeader, setSubmittingHeader] = useState(false);
  const [headerFormData, setHeaderFormData] = useState({ headline: "", description: "" });

  // Partner Modal State
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [submittingPartner, setSubmittingPartner] = useState(false);
  const [partnerFormData, setPartnerFormData] = useState({ name: "" });
  const [partnerImageFile, setPartnerImageFile] = useState<File | null>(null);



  const loadData = async () => {
    try {
      const [statsRes, headersRes, partnersRes] = await Promise.all([
        fetchApi("/services"),
        fetchApi("/services/headers"),
        fetchApi("/services/partners"),
      ]);
      setStats(statsRes.data || []);
      setHeaders(headersRes.data || []);
      setPartners(partnersRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load services data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeStats = stats.filter((s) => s.category === activeTab);
  const activeHeader = headers.find((h) => h.category === activeTab) || {
    category: activeTab,
    headline: "",
    description: "",
  };
  const activePartners = partners.filter((p) => p.category === activeTab);

  const activeCategoryDetails = CATEGORIES[activeTab];

  // Stat Handlers
  const openStatModal = (stat?: ServiceStat) => {
    if (!stat && activeStats.length >= 4) {
      toast.error(`Maximum 4 stats allowed for ${activeTab} category.`);
      return;
    }
    if (stat) {
      setEditingStatId(stat._id);
      setStatFormData({ value: stat.value, label: stat.label });
    } else {
      setEditingStatId(null);
      setStatFormData({ value: "", label: "" });
    }
    setIsStatModalOpen(true);
  };

  const closeStatModal = () => {
    setIsStatModalOpen(false);
    setEditingStatId(null);
  };

  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingStat(true);

    try {
      if (editingStatId) {
        await fetchApi(`/services/${editingStatId}`, {
          method: "PUT",
          body: JSON.stringify({ ...statFormData, category: activeTab }),
        });
        toast.success("Stat updated successfully.");
      } else {
        await fetchApi("/services", {
          method: "POST",
          body: JSON.stringify({ ...statFormData, category: activeTab }),
        });
        toast.success("Stat added successfully.");
      }
      closeStatModal();
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save stat.");
    } finally {
      setSubmittingStat(false);
    }
  };

  const handleStatDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this stat?")) {
      try {
        await fetchApi(`/services/${id}`, { method: "DELETE" });
        toast.success("Stat deleted successfully.");
        loadData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete stat.");
      }
    }
  };

  // Header Handlers
  const openHeaderModal = () => {
    setHeaderFormData({
      headline: activeHeader.headline,
      description: activeHeader.description,
    });
    setIsHeaderModalOpen(true);
  };

  const closeHeaderModal = () => {
    setIsHeaderModalOpen(false);
  };

  const handleHeaderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingHeader(true);

    try {
      await fetchApi(`/services/headers/${activeTab}`, {
        method: "PUT",
        body: JSON.stringify(headerFormData),
      });
      toast.success("Section heading & subheading updated successfully.");
      closeHeaderModal();
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update section header.");
    } finally {
      setSubmittingHeader(false);
    }
  };

  // Partner Handlers
  const openPartnerModal = (partner?: ServicePartnerData) => {
    if (partner) {
      setEditingPartnerId(partner._id);
      setPartnerFormData({ name: partner.name });
    } else {
      setEditingPartnerId(null);
      setPartnerFormData({ name: "" });
    }
    setPartnerImageFile(null);
    setIsPartnerModalOpen(true);
  };

  const closePartnerModal = () => {
    setIsPartnerModalOpen(false);
    setEditingPartnerId(null);
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPartner(true);

    try {
      const fd = new FormData();
      fd.append("name", partnerFormData.name);
      fd.append("category", activeTab);
      if (partnerImageFile) fd.append("image", partnerImageFile);

      if (editingPartnerId) {
        await fetchApi(`/services/partners/${editingPartnerId}`, { method: "PUT", body: fd });
        toast.success("Partner updated successfully");
      } else {
        await fetchApi("/services/partners", { method: "POST", body: fd });
        toast.success("Partner added successfully");
      }

      closePartnerModal();
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save partner.");
    } finally {
      setSubmittingPartner(false);
    }
  };

  const handlePartnerDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this partner?")) {
      try {
        await fetchApi(`/services/partners/${id}`, { method: "DELETE" });
        toast.success("Partner deleted successfully");
        loadData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete partner.");
      }
    }
  };



  if (loading) return <div className="p-8 text-stone-500">Loading service data...</div>;

  const partnerSectionTitle = activeTab === "import" 
    ? "Who we import from" 
    : activeTab === "export" 
      ? "Who do we export to" 
      : "Where we supply";

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-serif text-brand font-bold mb-2">Service Section Settings</h1>
        <p className="text-sm text-stone-500">
          Manage headings, stats, and partner logos displayed under Import, Export, and Supply sections on the public /services page. Category cards are managed from Products → Categories.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto whitespace-nowrap border-b border-stone-200">
        {['import', 'export', 'supply'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-sm tracking-widest uppercase transition-colors border-b-2 ${
              activeTab === tab 
                ? "border-brand text-brand bg-stone-50" 
                : "border-transparent text-stone-400 hover:text-stone-600 hover:bg-stone-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="admin-card space-y-8">
        
        {/* Category Header Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-4 mb-4">
            <div>
              <h2 className="font-serif text-xl font-semibold text-brand">{activeCategoryDetails.title}</h2>
              <p className="text-xs text-text-muted mt-0.5">{activeCategoryDetails.desc}</p>
            </div>
            <button
              onClick={openHeaderModal}
              className="admin-btn-secondary w-full sm:w-auto"
            >
              <FaEdit />
              Edit Heading & Subheading
            </button>
          </div>

          <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-4">
            <h3 className="font-serif text-lg font-semibold text-brand mt-1">
              {activeHeader.headline || <span className="italic text-stone-400">No heading set</span>}
            </h3>
            <p className="text-sm text-stone-600 mt-1 leading-relaxed">
              {activeHeader.description || <span className="italic text-stone-400">No subheading set</span>}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
            <h2 className="font-serif text-xl font-semibold text-brand">Category Stats ({activeStats.length}/4 Max)</h2>
            <button
              onClick={() => openStatModal()}
              disabled={activeStats.length >= 4}
              className="admin-btn-primary"
            >
              <FaPlus />
              Add Stat
            </button>
          </div>

          {activeStats.length === 0 ? (
            <div className="text-center py-6 text-stone-400 text-sm italic bg-stone-50 rounded border border-dashed border-stone-200">
              No stats added for this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeStats.map((stat) => (
                <div
                  key={stat._id}
                  className="bg-ivory border border-stone-200 rounded-lg p-4 relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl font-serif font-bold text-brand">{stat.value}</span>
                      <div className="flex gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openStatModal(stat)} className="admin-btn-icon bg-transparent hover:bg-white">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => handleStatDelete(stat._id)} className="admin-btn-icon-danger bg-transparent hover:bg-white">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-text-muted font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>



        {/* Partners Section */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
            <div>
              <h2 className="font-serif text-xl font-semibold text-brand">Partners ({partnerSectionTitle})</h2>
              <p className="text-xs text-text-muted mt-0.5">Manage logos shown in the {activeTab} section.</p>
            </div>
            <button
              onClick={() => openPartnerModal()}
              className="admin-btn-primary"
            >
              <FaPlus />
              Add Partner
            </button>
          </div>

          {activePartners.length === 0 ? (
            <div className="text-center py-6 text-stone-400 text-sm italic bg-stone-50 rounded border border-dashed border-stone-200">
              No partners added for this category yet.
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Name</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {activePartners.map((partner) => (
                    <tr key={partner._id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-24 h-12 relative bg-white flex items-center justify-center p-2 rounded-sm border border-stone-200 shadow-sm">
                          <SafeImage src={partner.imageUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-brand">{partner.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openPartnerModal(partner)} className="admin-btn-icon">
                            <FaEdit size={14} />
                          </button>
                          <button onClick={() => handlePartnerDelete(partner._id)} className="admin-btn-icon-danger">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Edit Header Modal */}
      {isHeaderModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-lg">
            <div className="admin-modal-header">
              <h3 className="font-serif font-semibold text-brand text-lg">
                Edit Heading & Subheading ({activeTab.toUpperCase()})
              </h3>
              <button onClick={closeHeaderModal} className="text-stone-400 hover:text-stone-700 p-1">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleHeaderSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="admin-modal-body space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Section Heading / Headline *</label>
                  <input required type="text" value={headerFormData.headline} onChange={(e) => setHeaderFormData({ ...headerFormData, headline: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Section Subheading / Description *</label>
                  <textarea required rows={4} value={headerFormData.description} onChange={(e) => setHeaderFormData({ ...headerFormData, description: e.target.value })} className="admin-input resize-none" />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={closeHeaderModal} className="admin-btn-secondary w-full sm:w-auto">Cancel</button>
                <button type="submit" disabled={submittingHeader} className="admin-btn-primary w-full sm:w-auto">
                  {submittingHeader ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Stat Modal */}
      {isStatModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-md">
            <div className="admin-modal-header">
              <h3 className="font-serif font-semibold text-brand text-lg">{editingStatId ? "Edit Service Stat" : "Add Service Stat"}</h3>
              <button onClick={closeStatModal} className="text-stone-400 hover:text-stone-700 p-1">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleStatSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="admin-modal-body space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Header / Value *</label>
                  <input required type="text" value={statFormData.value} onChange={(e) => setStatFormData({ ...statFormData, value: e.target.value })} placeholder="e.g., 12+ or 5,000+" className="admin-input" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Description / Label *</label>
                  <input required type="text" value={statFormData.label} onChange={(e) => setStatFormData({ ...statFormData, label: e.target.value })} placeholder="e.g., Source Countries" className="admin-input" />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={closeStatModal} className="admin-btn-secondary w-full sm:w-auto">Cancel</button>
                <button type="submit" disabled={submittingStat} className="admin-btn-primary w-full sm:w-auto">
                  {submittingStat ? "Saving..." : editingStatId ? "Update Stat" : "Add Stat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Partner Modal */}
      {isPartnerModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-md">
            <div className="admin-modal-header">
              <h2 className="text-xl font-serif font-bold text-brand">
                {editingPartnerId ? 'Edit Partner' : 'Add New Partner'}
              </h2>
              <button onClick={closePartnerModal} className="text-stone-400 hover:text-stone-700 transition-colors p-2">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="admin-modal-body">
              <form id="partnerForm" onSubmit={handlePartnerSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Partner Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={partnerFormData.name}
                    onChange={e => setPartnerFormData({ ...partnerFormData, name: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. Bismillah Logistics Ltd"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Logo {editingPartnerId ? '(Optional)' : <span className="text-red-500">*</span>}
                  </label>
                  <AdminUploadButton
                    onFileSelect={file => setPartnerImageFile(file)}
                    selectedFile={partnerImageFile}
                    label="Upload Logo"
                  />
                  <p className="text-xs text-stone-500 mt-1.5">Please upload a high-quality logo with a transparent background (PNG or SVG preferred).</p>
                </div>
              </form>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                onClick={closePartnerModal}
                className="admin-btn-secondary w-full sm:w-auto"
                disabled={submittingPartner}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="partnerForm"
                disabled={submittingPartner}
                className="admin-btn-primary w-full sm:w-auto"
              >
                {submittingPartner ? 'Saving...' : 'Save Partner'}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
