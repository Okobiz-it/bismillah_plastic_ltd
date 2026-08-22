"use client";

import { useState, useEffect, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaSpinner, FaMapMarkerAlt, FaGlobe, FaImage, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { fetchApi, uploadFile } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";
import Image from "next/image";

interface IMarker {
  _id: string;
  name: string;
  type: string;
  description: string;
  topProducts: string;
}

interface ICountry {
  _id: string;
  name: string;
  keyProducts?: string;
  region?: string;
  markers: IMarker[];
}

interface INetworkCategory {
  _id: string;
  name: string;
  mapImage: string;
  countries: ICountry[];
}

export default function NetworkAdminContent() {
  const [categories, setCategories] = useState<INetworkCategory[]>([]);
  const [activeTab, setActiveTab] = useState<'Export' | 'Import' | 'Supply'>('Export');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>(null);
  
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals state
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<ICountry | null>(null);
  const [countryForm, setCountryForm] = useState({ name: "", region: "", keyProducts: "" });

  const [markerModalOpen, setMarkerModalOpen] = useState(false);
  const [editingMarker, setEditingMarker] = useState<IMarker | null>(null);
  const [targetCountryId, setTargetCountryId] = useState<string | null>(null);
  const [markerForm, setMarkerForm] = useState({ name: "", type: "", description: "", topProducts: "" });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/network");
      setCategories(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load network categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const activeCategory = categories.find(c => c.name === activeTab);

  const handleMapImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeCategory) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append("mapImage", file);

    try {
      await uploadFile(`/network/${activeTab}/map`, formData, 'PUT');
      toast.success("Map image updated successfully!");
      loadCategories();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload map image");
    } finally {
      setSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Country Form Handlers
  const openCountryModal = (country?: ICountry) => {
    if (country) {
      setEditingCountry(country);
      setCountryForm({ name: country.name, region: country.region || "", keyProducts: country.keyProducts || "" });
    } else {
      setEditingCountry(null);
      setCountryForm({ name: "", region: "", keyProducts: "" });
    }
    setCountryModalOpen(true);
  };

  const submitCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCountry) {
        await fetchApi(`/network/${activeTab}/countries/${editingCountry._id}`, {
          method: "PUT",
          body: JSON.stringify(countryForm)
        });
        toast.success("Country updated successfully");
      } else {
        await fetchApi(`/network/${activeTab}/countries`, {
          method: "POST",
          body: JSON.stringify(countryForm)
        });
        toast.success("Country added successfully");
      }
      setCountryModalOpen(false);
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to save country");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCountry = async (countryId: string) => {
    if (!confirm("Are you sure you want to delete this country and all its markers?")) return;
    try {
      await fetchApi(`/network/${activeTab}/countries/${countryId}`, { method: "DELETE" });
      toast.success("Country deleted");
      loadCategories();
    } catch (error) {
      toast.error("Failed to delete country");
    }
  };

  // Marker Form Handlers
  const openMarkerModal = (countryId: string, marker?: IMarker) => {
    setTargetCountryId(countryId);
    if (marker) {
      setEditingMarker(marker);
      setMarkerForm({
        name: marker.name,
        type: marker.type,
        description: marker.description || "",
        topProducts: marker.topProducts || ""
      });
    } else {
      setEditingMarker(null);
      setMarkerForm({ name: "", type: "Port", description: "", topProducts: "" });
    }
    setMarkerModalOpen(true);
  };

  const submitMarker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCountryId) return;
    
    setSubmitting(true);
    try {
      if (editingMarker) {
        await fetchApi(`/network/${activeTab}/countries/${targetCountryId}/markers/${editingMarker._id}`, {
          method: "PUT",
          body: JSON.stringify(markerForm)
        });
        toast.success("Marker updated");
      } else {
        await fetchApi(`/network/${activeTab}/countries/${targetCountryId}/markers`, {
          method: "POST",
          body: JSON.stringify(markerForm)
        });
        toast.success("Marker added");
      }
      setMarkerModalOpen(false);
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to save marker");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMarker = async (countryId: string, markerId: string) => {
    if (!confirm("Delete this marker?")) return;
    try {
      await fetchApi(`/network/${activeTab}/countries/${countryId}/markers/${markerId}`, { method: "DELETE" });
      toast.success("Marker deleted");
      loadCategories();
    } catch (error) {
      toast.error("Failed to delete marker");
    }
  };

  if (loading && categories.length === 0) return <div className="p-8 text-stone-500">Loading network data...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-serif text-brand font-bold mb-2">Global Network Categories</h1>
        <p className="text-sm text-stone-500">Manage interactive maps, countries, and markers for Export, Import, and Supply independently.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto whitespace-nowrap border-b border-stone-200">
        {['Export', 'Import', 'Supply'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-xs md:text-sm tracking-widest uppercase transition-colors border-b-2 ${
              activeTab === tab 
                ? "border-brand text-brand bg-stone-50" 
                : "border-transparent text-stone-400 hover:text-stone-600 hover:bg-stone-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeCategory && (
        <div className="space-y-6">
          {/* Category Map Image */}
          <div className="admin-card flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3">
              <h2 className="text-lg font-bold text-brand flex items-center gap-2 mb-2">
                <FaGlobe className="text-gold" /> {activeCategory.name} Map Image
              </h2>
              <p className="text-xs text-stone-500 mb-4">
                Upload a static map or infographic for this category. This will be displayed in the public pages without any dynamic overlay.
              </p>
              <AdminUploadButton
                label="Upload New Map"
                isLoading={submitting}
                onFileSelect={(file) => {
                  if (file && activeCategory) {
                    const fd = new FormData();
                    fd.append("mapImage", file);
                    setSubmitting(true);
                    fetchApi(`/network/category/${activeCategory.name}/map`, { method: "PUT", body: fd })
                      .then(() => {
                        toast.success("Map image updated successfully");
                        loadCategories();
                      })
                      .catch(err => {
                        console.error(err);
                        toast.error("Failed to upload map image");
                      })
                      .finally(() => setSubmitting(false));
                  }
                }}
              />
            </div>
            <div className="w-full md:w-2/3 bg-stone-50 border border-stone-200 rounded flex items-center justify-center overflow-hidden aspect-[21/9] p-2">
              {activeCategory.mapImage ? (
                <Image src={activeCategory.mapImage} alt="Map" width={800} height={400} className="w-full h-full object-contain block" unoptimized />
              ) : (
                <span className="text-stone-400 text-sm font-bold uppercase tracking-widest">No Image Uploaded</span>
              )}
            </div>
          </div>

          {/* Countries List */}
          <div className="admin-card !p-0 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-stone-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-stone-50/50">
              <h2 className="text-lg font-bold text-brand flex items-center gap-2">
                <FaMapMarkerAlt className="text-gold" /> {activeTab === "Supply" ? "Places & Locations" : "Countries & Markers"} ({activeCategory.countries.length})
              </h2>
              <button
                onClick={() => openCountryModal()}
                className="admin-btn-primary w-full sm:w-auto"
              >
                <FaPlus /> {activeTab === "Supply" ? "Add Place" : "Add Country"}
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {activeCategory.countries.length === 0 ? (
                <div className="p-8 text-center text-stone-500">No {activeTab === "Supply" ? "locations" : "countries"} added to {activeCategory.name} yet.</div>
              ) : (
                activeCategory.countries.map(country => (
                  <div key={country._id} className="p-4 hover:bg-stone-50/30 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="cursor-pointer flex-1" onClick={() => setExpandedCountryId(expandedCountryId === country._id ? null : country._id)}>
                        <h3 className="font-bold text-brand text-lg flex items-center gap-2">
                          {expandedCountryId === country._id ? <FaChevronUp className="text-xs text-stone-400" /> : <FaChevronDown className="text-xs text-stone-400" />}
                          {country.name}
                          {country.region && <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-0.5 rounded ml-2">{country.region}</span>}
                        </h3>
                        {country.keyProducts && (
                          <p className="text-sm text-stone-500 mt-1 pl-6 line-clamp-1">
                            <span className="font-semibold text-stone-400 uppercase tracking-widest text-[10px]">
                              {activeTab === "Import" ? "Key Imports:" : activeTab === "Export" ? "Key Exports:" : "Key Products:"}
                            </span>{" "}
                            {country.keyProducts}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 items-center pl-4 border-l border-stone-200">
                        <button onClick={() => openCountryModal(country)} className="admin-btn-icon" title={activeTab === "Supply" ? "Edit Place" : "Edit Country"}>
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => deleteCountry(country._id)} className="admin-btn-icon-danger" title={activeTab === "Supply" ? "Delete Place" : "Delete Country"}>
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>

                    {expandedCountryId === country._id && (
                      <div className="mt-4 pl-6 ml-1.5 border-l-2 border-stone-100">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Markers in {country.name}</h4>
                          <button onClick={() => openMarkerModal(country._id)} className="text-xs font-bold text-brand hover:text-gold flex items-center gap-1 uppercase tracking-wider">
                            <FaPlus className="text-[10px]" /> Add Marker
                          </button>
                        </div>
                        
                        {country.markers.length === 0 ? (
                          <div className="text-xs text-stone-400 italic">No markers defined.</div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {country.markers.map(marker => (
                              <div key={marker._id} className="bg-white border border-stone-200 p-3 rounded flex justify-between items-start shadow-sm">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-brand text-sm">{marker.name}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">{marker.type}</span>
                                  </div>
                                  {marker.description && <p className="text-xs text-stone-500 mb-1">{marker.description}</p>}
                                  {marker.topProducts && <p className="text-[10px] text-stone-400 font-semibold">Products: {marker.topProducts}</p>}
                                </div>
                                <div className="flex gap-1">
                                  <button onClick={() => openMarkerModal(country._id, marker)} className="admin-btn-icon" title="Edit"><FaEdit size={12} /></button>
                                  <button onClick={() => deleteMarker(country._id, marker._id)} className="admin-btn-icon-danger" title="Delete"><FaTrash size={12} /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Country / Place Modal */}
      {countryModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-md">
            <div className="admin-modal-header">
              <h2 className="text-lg font-serif font-bold text-brand">
                {activeTab === "Supply"
                  ? (editingCountry ? "Edit Location" : "Add Place")
                  : (editingCountry ? "Edit Country" : "Add Country")}
              </h2>
            </div>
            <form id="country-form" onSubmit={submitCountry} className="flex flex-col flex-1 overflow-hidden">
              <div className="admin-modal-body space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  {activeTab === "Supply" ? "Place Name *" : "Country Name *"}
                </label>
                <input
                  required
                  type="text"
                  placeholder={
                    activeTab === "Supply"
                      ? "e.g. Dhaka, Chittagong, Sylhet"
                      : activeTab === "Import"
                        ? "e.g. Germany, China, India"
                        : "e.g. United States, Germany, UAE"
                  }
                  value={countryForm.name}
                  onChange={e => setCountryForm({...countryForm, name: e.target.value})}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Region (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Asia, Europe"
                  value={countryForm.region}
                  onChange={e => setCountryForm({...countryForm, region: e.target.value})}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  {activeTab === "Import" ? "Key Imports" : activeTab === "Export" ? "Key Exports" : "Key Products"}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    activeTab === "Import"
                      ? "e.g. Industrial Chemicals, Plastic Resins"
                      : activeTab === "Export"
                        ? "e.g. Ready-Made Garments, Jute Goods"
                        : "e.g. Raw Jute, Cotton Yarn, Denim Fabrics"
                  }
                  value={countryForm.keyProducts}
                  onChange={e => setCountryForm({...countryForm, keyProducts: e.target.value})}
                  className="admin-input resize-none"
                />
              </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => setCountryModalOpen(false)} className="admin-btn-secondary w-full sm:w-auto">Cancel</button>
                <button type="submit" form="country-form" disabled={submitting} className="admin-btn-primary w-full sm:w-auto">
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaCheck />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Marker Modal */}
      {markerModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-md">
            <div className="admin-modal-header">
              <h2 className="text-xl font-serif font-bold text-brand">{editingMarker ? "Edit Marker" : "Add Marker"}</h2>
            </div>
            <form id="marker-form" onSubmit={submitMarker} className="flex flex-col flex-1 overflow-hidden">
              <div className="admin-modal-body space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Marker Name (e.g. City/Port) *</label>
                  <input required type="text" value={markerForm.name} onChange={e => setMarkerForm({...markerForm, name: e.target.value})} className="admin-input" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Marker Type *</label>
                  <input required type="text" placeholder="e.g. Port, Warehouse, HQ" value={markerForm.type} onChange={e => setMarkerForm({...markerForm, type: e.target.value})} className="admin-input" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Top Products (Optional)</label>
                  <input type="text" value={markerForm.topProducts} onChange={e => setMarkerForm({...markerForm, topProducts: e.target.value})} className="admin-input" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Description (Optional)</label>
                  <textarea rows={2} value={markerForm.description} onChange={e => setMarkerForm({...markerForm, description: e.target.value})} className="admin-input resize-none" />
                </div>
              </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" onClick={() => setMarkerModalOpen(false)} className="admin-btn-secondary w-full sm:w-auto">Cancel</button>
                <button type="submit" form="marker-form" disabled={submitting} className="admin-btn-primary w-full sm:w-auto">
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaCheck />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
