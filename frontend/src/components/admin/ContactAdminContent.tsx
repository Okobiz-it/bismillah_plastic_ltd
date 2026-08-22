"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";

export default function ContactAdminContent() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    offices: {
      headOffice: { name: "Head Office", address: "" },
      corporateOffice: { name: "Corporate Office", address: "" },
      portOffice: { name: "Port Office", address: "" },
    },
    contactDetails: {
      directLinesTitle: "Direct Lines",
      phones: [""],
      emails: [""],
    },
    socialMedia: {
      facebook: "",
      linkedin: "",
      youtube: "",
      whatsapp: "",
    },
    location: {
      googleMapsUrl: "",
    },
  });

  const loadData = async () => {
    try {
      const res = await fetchApi("/contact");
      if (res.data) {
        setFormData({
          offices: {
            headOffice: res.data.offices?.headOffice || { name: "Head Office", address: "" },
            corporateOffice: res.data.offices?.corporateOffice || { name: "Corporate Office", address: "" },
            portOffice: res.data.offices?.portOffice || { name: "Port Office", address: "" },
          },
          contactDetails: {
            directLinesTitle: res.data.contactDetails?.directLinesTitle || "Direct Lines",
            phones: res.data.contactDetails?.phones?.length ? res.data.contactDetails.phones : [""],
            emails: res.data.contactDetails?.emails?.length ? res.data.contactDetails.emails : [""],
          },
          socialMedia: {
            facebook: res.data.socialMedia?.facebook || "",
            linkedin: res.data.socialMedia?.linkedin || "",
            youtube: res.data.socialMedia?.youtube || "",
            whatsapp: res.data.socialMedia?.whatsapp || "",
          },
          location: {
            googleMapsUrl: res.data.location?.googleMapsUrl || "",
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load contact data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const cleanUrl = (url: string) => {
    return url.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        socialMedia: {
          facebook: cleanUrl(formData.socialMedia.facebook),
          linkedin: cleanUrl(formData.socialMedia.linkedin),
          youtube: cleanUrl(formData.socialMedia.youtube),
          whatsapp: cleanUrl(formData.socialMedia.whatsapp),
        }
      };
      await fetchApi("/contact", {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      });
      toast.success("Contact details updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update contact details");
    } finally {
      setSubmitting(false);
    }
  };

  const handleArrayChange = (field: 'phones' | 'emails', index: number, value: string) => {
    const newArray = [...formData.contactDetails[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      contactDetails: {
        ...formData.contactDetails,
        [field]: newArray
      }
    });
  };

  const addArrayItem = (field: 'phones' | 'emails') => {
    setFormData({
      ...formData,
      contactDetails: {
        ...formData.contactDetails,
        [field]: [...formData.contactDetails[field], ""]
      }
    });
  };

  const removeArrayItem = (field: 'phones' | 'emails', index: number) => {
    const newArray = formData.contactDetails[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      contactDetails: {
        ...formData.contactDetails,
        [field]: newArray
      }
    });
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-brand">Contact Management</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage the centralized contact information displayed globally across your website.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="admin-btn-primary w-full sm:w-auto mt-4 md:mt-0"
        >
          <FaSave /> {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Office Locations */}
        <section className="admin-card space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-lg font-semibold text-brand">Office Locations</h2>
            <p className="text-xs text-stone-500 mt-1">Addresses displayed on the contact page and footer.</p>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Head Office Name</label>
                <input
                  type="text"
                  value={formData.offices.headOffice.name}
                  onChange={e => setFormData({
                    ...formData,
                    offices: { ...formData.offices, headOffice: { ...formData.offices.headOffice, name: e.target.value } }
                  })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Head Office Address</label>
                <textarea
                  value={formData.offices.headOffice.address}
                  onChange={e => setFormData({
                    ...formData,
                    offices: { ...formData.offices, headOffice: { ...formData.offices.headOffice, address: e.target.value } }
                  })}
                  rows={1}
                  className="admin-input resize-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Corporate Office Name</label>
                <input
                  type="text"
                  value={formData.offices.corporateOffice.name}
                  onChange={e => setFormData({
                    ...formData,
                    offices: { ...formData.offices, corporateOffice: { ...formData.offices.corporateOffice, name: e.target.value } }
                  })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Corporate Office Address</label>
                <textarea
                  value={formData.offices.corporateOffice.address}
                  onChange={e => setFormData({
                    ...formData,
                    offices: { ...formData.offices, corporateOffice: { ...formData.offices.corporateOffice, address: e.target.value } }
                  })}
                  rows={1}
                  className="admin-input resize-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Port Office Name</label>
                <input
                  type="text"
                  value={formData.offices.portOffice.name}
                  onChange={e => setFormData({
                    ...formData,
                    offices: { ...formData.offices, portOffice: { ...formData.offices.portOffice, name: e.target.value } }
                  })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Port Office Address</label>
                <textarea
                  value={formData.offices.portOffice.address}
                  onChange={e => setFormData({
                    ...formData,
                    offices: { ...formData.offices, portOffice: { ...formData.offices.portOffice, address: e.target.value } }
                  })}
                  rows={1}
                  className="admin-input resize-none"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          {/* Contact Details */}
          <section className="admin-card space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-lg font-semibold text-brand">Direct Lines & Contact Info</h2>
              <p className="text-xs text-stone-500 mt-1">Manage public phone numbers, emails, and section title.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">"Direct Lines" Section Title</label>
              <input
                type="text"
                value={formData.contactDetails.directLinesTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  contactDetails: {
                    ...formData.contactDetails,
                    directLinesTitle: e.target.value
                  }
                })}
                placeholder="Direct Lines"
                className="admin-input"
              />
            </div>

            {/* Phones */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Phone Numbers</label>
              {formData.contactDetails.phones.map((phone, idx) => (
                <div key={`phone-${idx}`} className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => handleArrayChange('phones', idx, e.target.value)}
                    placeholder="e.g. +1 234 567 890"
                    className="admin-input flex-1"
                  />
                  {formData.contactDetails.phones.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('phones', idx)} className="w-9 h-9 rounded bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 cursor-pointer">
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('phones')} className="text-xs font-semibold text-brand hover:text-gold flex items-center gap-1 mt-1 cursor-pointer">
                <FaPlus size={10} /> Add Phone Number
              </button>
            </div>

            {/* Emails */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Email Addresses</label>
              {formData.contactDetails.emails.map((email, idx) => (
                <div key={`email-${idx}`} className="flex items-center gap-2 mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleArrayChange('emails', idx, e.target.value)}
                    placeholder="e.g. contact@example.com"
                    className="admin-input flex-1"
                  />
                  {formData.contactDetails.emails.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('emails', idx)} className="w-9 h-9 rounded bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 cursor-pointer">
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('emails')} className="text-xs font-semibold text-brand hover:text-gold flex items-center gap-1 mt-1 cursor-pointer">
                <FaPlus size={10} /> Add Email Address
              </button>
            </div>
          </section>

          {/* Social Media */}
          <section className="admin-card space-y-4">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-semibold text-brand">Social Media Links</h2>
              <p className="text-xs text-stone-500 mt-1">Manage public social media channel URLs.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Facebook URL</label>
                <input
                  type="text"
                  value={formData.socialMedia.facebook}
                  placeholder="e.g. facebook.com/yourpage"
                  onChange={e => setFormData({
                    ...formData, socialMedia: { ...formData.socialMedia, facebook: cleanUrl(e.target.value) }
                  })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">LinkedIn URL</label>
                <input
                  type="text"
                  value={formData.socialMedia.linkedin}
                  placeholder="e.g. linkedin.com/company/yourpage"
                  onChange={e => setFormData({
                    ...formData, socialMedia: { ...formData.socialMedia, linkedin: cleanUrl(e.target.value) }
                  })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">YouTube URL</label>
                <input
                  type="text"
                  value={formData.socialMedia.youtube}
                  placeholder="e.g. youtube.com/@yourchannel"
                  onChange={e => setFormData({
                    ...formData, socialMedia: { ...formData.socialMedia, youtube: cleanUrl(e.target.value) }
                  })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">WhatsApp URL (wa.me/...)</label>
                <input
                  type="text"
                  value={formData.socialMedia.whatsapp}
                  placeholder="e.g. wa.me/1234567890"
                  onChange={e => setFormData({
                    ...formData, socialMedia: { ...formData.socialMedia, whatsapp: cleanUrl(e.target.value) }
                  })}
                  className="admin-input"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

