"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { FaSave, FaPlus, FaTrash, FaGlobe } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";

interface ExportRegion {
  name: string;
  countries: string;
  keyProducts: string;
  stats: string;
}

export default function ExportAdminContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regions, setRegions] = useState<ExportRegion[]>([]);
  const toast = useToast();

  const loadSettings = async () => {
    try {
      const res = await fetchApi("/settings/export_regions");
      setRegions(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchApi("/settings/export_regions", {
        method: "PUT",
        body: JSON.stringify(regions)
      });
      toast.success("Export regions saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save export regions");
    } finally {
      setSaving(false);
    }
  };

  const addRegion = () => {
    setRegions([...regions, { name: "", countries: "", keyProducts: "", stats: "" }]);
  };

  const removeRegion = (index: number) => {
    const newRegions = [...regions];
    newRegions.splice(index, 1);
    setRegions(newRegions);
  };

  const updateRegion = (index: number, field: keyof ExportRegion, value: string) => {
    const newRegions = [...regions];
    newRegions[index][field] = value;
    setRegions(newRegions);
  };

  if (loading) return <div className="p-6 text-stone-500">Loading...</div>;

  return (
    <div className="admin-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-brand flex items-center gap-2">
            <FaGlobe className="text-stone-400" /> Export Regions
          </h2>
          <p className="text-sm text-stone-500 mt-1">Manage the regions and countries where you export products.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn-primary w-full sm:w-auto"
        >
          <FaSave /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-stone-700">Configured Regions</label>
          <button type="button" onClick={addRegion} className="text-gold hover:text-gold-dark text-sm flex items-center gap-1 font-semibold">
            <FaPlus className="w-3 h-3" /> Add Region
          </button>
        </div>

        <div className="space-y-4">
          {regions.map((region, i) => (
            <div key={i} className="bg-stone-50 p-4 rounded-lg border border-stone-200 shadow-sm relative">
              <button 
                type="button" 
                onClick={() => removeRegion(i)} 
                className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors"
                title="Remove Region"
              >
                <FaTrash />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Region Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Europe"
                    value={region.name}
                    onChange={(e) => updateRegion(i, 'name', e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Reach / Stats</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 countries served"
                    value={region.stats}
                    onChange={(e) => updateRegion(i, 'stats', e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Countries</label>
                  <input
                    type="text"
                    placeholder="e.g. Germany, Italy, Spain, UK, Netherlands, France"
                    value={region.countries}
                    onChange={(e) => updateRegion(i, 'countries', e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Products Exported</label>
                  <input
                    type="text"
                    placeholder="e.g. Clear PET Flakes, PP Chips"
                    value={region.keyProducts}
                    onChange={(e) => updateRegion(i, 'keyProducts', e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>
          ))}
          {regions.length === 0 && (
            <div className="text-center p-8 border-2 border-dashed border-stone-200 rounded-lg text-stone-500">
              <p>No export regions added yet.</p>
              <button onClick={addRegion} className="mt-2 text-brand font-semibold hover:underline">Add your first region</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
