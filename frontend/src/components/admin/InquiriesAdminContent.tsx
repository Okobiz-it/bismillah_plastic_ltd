"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import RichTextEditor from "@/components/shared/RichTextEditor";
import RichTextRenderer from "@/components/shared/RichTextRenderer";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaTrash,
  FaEnvelope,
  FaClock,
  FaTimes,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaPaperPlane,
  FaPaperclip,
  FaDownload,
  FaShip
} from "react-icons/fa";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  companyWebsite?: string;
  companyAddress?: string;
  deliveryAddress?: string;
  country?: string;
  designation?: string;
  whatsapp?: string;
  wechat?: string;
  message: string;
  category: "export" | "general";
  product?: string;
  quantity?: string;
  requiredSpecification?: string;
  targetDelivery?: string;
  destinationPort?: string;
  details?: Record<string, any>;
  brochureUrl?: string;
  brochureName?: string;
  type: "general" | "quote";
  inquiryType?: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export default function InquiriesAdminContent() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const toast = useToast();

  const loadInquiries = async () => {
    try {
      const res = await fetchApi("/inquiries");
      setInquiries(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyMessage.trim()) return;
    setSendingReply(true);
    try {
      await fetchApi(`/inquiries/${selectedInquiry._id}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: replyMessage }),
      });
      toast.success(`Reply email sent to ${selectedInquiry.email} successfully!`);
      setReplyMessage("");
      setSelectedInquiry({ ...selectedInquiry, status: "replied" });
      setInquiries((prev) =>
        prev.map((item) => (item._id === selectedInquiry._id ? { ...item, status: "replied" } : item))
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send email reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const handleSelectInquiry = async (item: Inquiry) => {
    if (item.status === "new") {
      const updatedItem: Inquiry = { ...item, status: "read" };
      setSelectedInquiry(updatedItem);
      setInquiries((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, status: "read" } : i))
      );
      try {
        await fetchApi(`/inquiries/${item._id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: "read" }),
        });
      } catch (error) {
        console.error("Failed to automatically update inquiry status to read:", error);
      }
    } else {
      setSelectedInquiry(item);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "new" | "read" | "replied") => {
    setUpdatingId(id);
    try {
      await fetchApi(`/inquiries/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Inquiry marked as ${newStatus}`);
      setInquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await fetchApi(`/inquiries/${id}`, { method: "DELETE" });
      toast.success("Inquiry deleted successfully");
      setInquiries((prev) => prev.filter((item) => item._id !== id));
      if (selectedInquiry && selectedInquiry._id === id) setSelectedInquiry(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete inquiry.");
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesTab = activeTab === "all" || (item.category || "general").toLowerCase() === activeTab;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      (item.company || "").toLowerCase().includes(query) ||
      (item.product || "").toLowerCase().includes(query);

    return matchesTab && matchesStatus && matchesSearch;
  });

  useEffect(() => setCurrentPage(1), [activeTab, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage);

  const counts = {
    all: inquiries.length,
    export: inquiries.filter((i) => (i.category || "general").toLowerCase() === "export").length,
    general: inquiries.filter((i) => (i.category || "general").toLowerCase() === "general").length,
    new: inquiries.filter((i) => i.status === "new").length,
  };

  const getCategoryBadgeClass = (item: Inquiry) => {
    const key = item.category || "general";
    if (key === "export") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-stone-100 text-stone-800 border-stone-200";
  };

  const getCategoryIcon = (item: Inquiry) => {
    const key = item.category || "general";
    if (key === "export") return <FaShip className="text-blue-600" />;
    return <FaEnvelope className="text-stone-600" />;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "new": return "bg-rose-100 text-rose-700 font-bold border-rose-200";
      case "replied": return "bg-green-100 text-green-700 font-semibold border-green-200";
      default: return "bg-stone-100 text-stone-600 border-stone-200";
    }
  };

  if (loading) return <div className="p-8 text-stone-500">Loading inquiries...</div>;

  return (
    <div className="space-y-4">
      {/* Top Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-brand">Customer Inquiries & Quotes</h2>
          <p className="text-sm text-stone-500 mt-1">
            Manage incoming trade quote requests and general inquiries.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <div className="admin-card !p-2.5 sm:!p-3.5 flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <FaEnvelope className="text-xs sm:text-base" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg sm:text-2xl font-bold text-brand">{counts.all}</div>
            <div className="text-[10px] sm:text-xs text-stone-500 font-medium truncate">Total</div>
          </div>
        </div>
        <div className="admin-card !p-2.5 sm:!p-3.5 flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <FaClock className="text-xs sm:text-base" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg sm:text-2xl font-bold text-rose-600">{counts.new}</div>
            <div className="text-[10px] sm:text-xs text-stone-500 font-medium truncate">New Unread</div>
          </div>
        </div>
        <div className="admin-card !p-2.5 sm:!p-3.5 flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FaShip className="text-xs sm:text-base" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg sm:text-2xl font-bold text-blue-700">{counts.export}</div>
            <div className="text-[10px] sm:text-xs text-stone-500 font-medium truncate">Export Quotes</div>
          </div>
        </div>
        <div className="admin-card !p-2.5 sm:!p-3.5 flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
            <FaEnvelope className="text-xs sm:text-base" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg sm:text-2xl font-bold text-stone-700">{counts.general}</div>
            <div className="text-[10px] sm:text-xs text-stone-500 font-medium truncate">General Contact</div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="admin-table-container animate-fadeIn bg-white !p-0">
        <div className="p-2.5 sm:p-4 border-b border-stone-200 flex flex-col md:flex-row justify-between gap-2.5 sm:gap-4">
          <div className="flex gap-1.5 sm:gap-2">
            {["all", "export", "general"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold uppercase rounded transition-colors ${activeTab === tab ? "bg-brand text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search inquiries..." className="admin-input !pl-8 !py-1.5 text-xs sm:text-sm" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-input !py-1.5 text-xs sm:text-sm">
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 text-[11px] font-bold text-stone-500 uppercase">Category</th>
                <th className="py-3 px-4 text-[11px] font-bold text-stone-500 uppercase">Customer</th>
                <th className="py-3 px-4 text-[11px] font-bold text-stone-500 uppercase">Product / Subject</th>
                <th className="py-3 px-4 text-[11px] font-bold text-stone-500 uppercase">Date</th>
                <th className="py-3 px-4 text-[11px] font-bold text-stone-500 uppercase">Status</th>
                <th className="py-3 px-4 text-[11px] font-bold text-stone-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {paginatedInquiries.map((item) => (
                <tr key={item._id} className={`hover:bg-stone-50 cursor-pointer ${item.status === "new" ? "bg-amber-50/20 font-medium" : ""}`} onClick={() => handleSelectInquiry(item)}>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${getCategoryBadgeClass(item)}`}>
                      {getCategoryIcon(item)} {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-brand">{item.name}</div>
                    <div className="text-xs text-stone-500">{item.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-800">{item.product || "General Inquiry"}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-stone-500 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 text-[10px] uppercase rounded-full border ${getStatusBadgeClass(item.status)}`}>{item.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleSelectInquiry(item)} className="admin-btn-icon"><FaEye size={14} /></button>
                      <button onClick={() => handleDelete(item._id)} className="admin-btn-icon-danger"><FaTrash size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">No inquiries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedInquiry && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-3xl">
            <div className="admin-modal-header sm:justify-between items-center shrink-0 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded border ${getCategoryBadgeClass(selectedInquiry)}`}>
                  {getCategoryIcon(selectedInquiry)} {selectedInquiry.category}
                </span>
                <span className={`px-2.5 py-0.5 text-[11px] uppercase font-semibold rounded-full border ${getStatusBadgeClass(selectedInquiry.status)}`}>
                  Status: {selectedInquiry.status}
                </span>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="text-stone-400 hover:text-stone-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors">
                <FaTimes />
              </button>
            </div>

            <div className="admin-modal-body space-y-6 flex-1 text-sm">
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand border-b pb-2 mb-3 flex items-center gap-2"><FaUser className="text-gold" /> Customer Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><span className="text-xs text-stone-400 block">Name</span><strong className="text-brand">{selectedInquiry.name}</strong></div>
                  <div><span className="text-xs text-stone-400 block">Email</span><a href={`mailto:${selectedInquiry.email}`} className="text-blue-600">{selectedInquiry.email}</a></div>
                  <div><span className="text-xs text-stone-400 block">Phone</span>{selectedInquiry.phone || "-"}</div>
                  <div><span className="text-xs text-stone-400 block">Company</span>{selectedInquiry.company || "-"}</div>
                  <div><span className="text-xs text-stone-400 block">Country</span>{selectedInquiry.country || "-"}</div>
                  <div><span className="text-xs text-stone-400 block">Designation</span>{selectedInquiry.designation || "-"}</div>
                  <div><span className="text-xs text-stone-400 block">WhatsApp</span>{selectedInquiry.whatsapp || "-"}</div>
                  <div><span className="text-xs text-stone-400 block">WeChat</span>{selectedInquiry.wechat || "-"}</div>
                </div>
              </div>

              {selectedInquiry.category === "export" && (
                <div className="p-4 bg-white rounded-lg border border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand border-b pb-2 mb-3">Quote Requirements</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><span className="text-xs text-stone-400 block">Target Product</span><strong>{selectedInquiry.product}</strong></div>
                    <div><span className="text-xs text-stone-400 block">Required Quantity</span><strong>{selectedInquiry.quantity}</strong></div>
                    <div><span className="text-xs text-stone-400 block">Destination Port</span>{selectedInquiry.destinationPort || "-"}</div>
                    <div><span className="text-xs text-stone-400 block">Target Delivery</span>{selectedInquiry.targetDelivery || "-"}</div>
                    <div className="sm:col-span-2">
                      <span className="text-xs text-stone-400 block mb-1">Required Specifications</span>
                      {selectedInquiry.requiredSpecification ? (
                        <div className="text-stone-800">
                          <RichTextRenderer content={selectedInquiry.requiredSpecification} />
                        </div>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedInquiry.brochureUrl && (
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FaPaperclip className="text-stone-400 text-lg" />
                    <span className="font-medium text-stone-700">{selectedInquiry.brochureName || "Attachment"}</span>
                  </div>
                  <a href={selectedInquiry.brochureUrl} target="_blank" rel="noopener noreferrer" className="admin-btn-secondary text-xs"><FaDownload /> Download</a>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Message Content</h4>
                <div className="p-4 bg-white border border-stone-200 rounded-lg text-stone-700">
                  <RichTextRenderer content={selectedInquiry.message} />
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Send Email Reply</h4>
                <RichTextEditor value={replyMessage} onChange={setReplyMessage} />
                <div className="mt-3 flex justify-end">
                  <button type="button" onClick={handleSendReply} disabled={sendingReply || !replyMessage.trim()} className="admin-btn-primary">
                    <FaPaperPlane /> {sendingReply ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer sm:justify-between flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">Mark Status:</span>
                <select value={selectedInquiry.status} onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value as any)} className="admin-input !bg-white">
                  <option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option>
                </select>
              </div>
              <button onClick={() => handleDelete(selectedInquiry._id)} className="admin-btn-secondary !text-red-600 !border-red-200">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
