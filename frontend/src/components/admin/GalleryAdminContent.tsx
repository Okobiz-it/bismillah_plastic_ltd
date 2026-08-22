"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import InfrastructureAdminContent from "./InfrastructureAdminContent";
import { FaImages, FaSave, FaEdit } from "react-icons/fa";

interface GallerySettings {
  heading: string;
  subheading: string;
}

const DEFAULT_SETTINGS: GallerySettings = {
  heading: "Our Company Gallery",
  subheading: "A visual journey through our operations, facilities, and global partnerships.",
};

export default function GalleryAdminContent() {
  const [settings, setSettings] = useState<GallerySettings>(DEFAULT_SETTINGS);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GallerySettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const loadSettings = async () => {
    try {
      const res = await fetchApi("/settings/gallery");
      if (res.data) {
        setSettings(res.data);
        setDraft(res.data);
      }
    } catch {
      // No settings yet, use defaults
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchApi("/settings/gallery", {
        method: "PUT",
        body: JSON.stringify(draft),
      });
      setSettings(draft);
      setEditing(false);
      toast.success("Gallery settings saved.");
    } catch {
      toast.error("Failed to save gallery settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(settings);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
        <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
          <FaImages className="text-gold text-lg" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand">Company Gallery</h1>
          <p className="text-sm text-stone-500">Manage gallery heading and photos displayed on <span className="font-semibold text-brand">/gallery</span></p>
        </div>
      </div>

      {/* Gallery Page Settings */}
      <section className="admin-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-brand flex items-center gap-2">
              <FaEdit className="text-gold" />
              Gallery Page Settings
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Control the heading and subheading on the public gallery page.
            </p>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="admin-btn-secondary">
              <FaEdit size={12} /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Gallery Heading</label>
              <input
                type="text"
                value={draft.heading}
                onChange={(e) => setDraft({ ...draft, heading: e.target.value })}
                className="admin-input"
                placeholder="e.g. Our Company Gallery"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Gallery Subheading</label>
              <textarea
                value={draft.subheading}
                onChange={(e) => setDraft({ ...draft, subheading: e.target.value })}
                className="admin-input h-24 resize-none"
                placeholder="e.g. A visual journey through our operations..."
                maxLength={300}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="admin-btn-primary">
                <FaSave size={12} />
                {saving ? "Saving..." : "Save Settings"}
              </button>
              <button onClick={handleCancel} className="admin-btn-secondary" disabled={saving}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 bg-stone-50 rounded-lg p-4 border border-stone-100">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">Heading</p>
              <p className="text-lg font-serif font-semibold text-brand">{settings.heading}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">Subheading</p>
              <p className="text-sm text-stone-600 leading-relaxed">{settings.subheading}</p>
            </div>
          </div>
        )}
      </section>

      {/* Infrastructure / Gallery Photos */}
      <section className="admin-card !p-0 overflow-hidden">
        <InfrastructureAdminContent />
      </section>
    </div>
  );
}
