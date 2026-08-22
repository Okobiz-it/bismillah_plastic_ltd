"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaStar,
  FaBoxOpen,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaThList,
  FaThLarge,
  FaImage
} from "react-icons/fa";
import { getAuthToken, API_BASE } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import SafeImage from "@/components/shared/SafeImage";
import RichTextEditor from "@/components/shared/RichTextEditor";
import AdminUploadButton from "@/components/admin/shared/AdminUploadButton";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  images?: string[];
  featured: boolean;
  origin: string;
  materialType?: string;
  color?: string;
  processingType?: string;
  chipSize?: string;
  gradeQuality?: string;
  technicalSpecs?: {
    iv?: string;
    moisture?: string;
    pvc?: string;
    fines?: string;
    contamination?: string;
    bulkDensity?: string;
    meltFlowIndex?: string;
    otherParams?: string;
  };
  sku?: string;
  moq?: string;
  leadTime?: string;
  stockStatus?: string;
  packaging?: string;
  paymentTerms?: string;
  shippingTerms?: string;
  monthlyProductionCapacity?: string;
  availableCapacity?: string;
  exportMarkets?: string;
  applications?: string;
  hsCode?: string;
  certifications?: string;
  specifications?: string;
  tdsUrl?: string;
}

interface NewImageItem {
  id: string;
  file: File;
  preview: string;
}

export default function ProductsAdminContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters, Views & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const toast = useToast();

  const emptyTechnicalSpecs = {
    iv: "", moisture: "", pvc: "", fines: "", contamination: "", bulkDensity: "", meltFlowIndex: "", otherParams: ""
  };

  const emptyFormData = {
    name: "",
    description: "",
    category: "",
    imageUrl: "",
    origin: "Bangladesh",
    featured: false,
    materialType: "",
    color: "",
    processingType: "",
    chipSize: "",
    gradeQuality: "",
    technicalSpecs: { ...emptyTechnicalSpecs },
    sku: "",
    moq: "",
    leadTime: "",
    stockStatus: "Available",
    packaging: "",
    paymentTerms: "",
    shippingTerms: "",
    monthlyProductionCapacity: "",
    availableCapacity: "",
    exportMarkets: "",
    applications: "",
    hsCode: "",
    certifications: "",
    specifications: "",
    tdsUrl: "",
  };

  const [formData, setFormData] = useState(emptyFormData);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<NewImageItem[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        imageUrl: product.imageUrl || "",
        origin: product.origin || "Bangladesh",
        featured: product.featured || false,
        materialType: product.materialType || "",
        color: product.color || "",
        processingType: product.processingType || "",
        chipSize: product.chipSize || "",
        gradeQuality: product.gradeQuality || "",
        technicalSpecs: product.technicalSpecs ? { ...emptyTechnicalSpecs, ...product.technicalSpecs } : { ...emptyTechnicalSpecs },
        sku: product.sku || "",
        moq: product.moq || "",
        leadTime: product.leadTime || "",
        stockStatus: product.stockStatus || "Available",
        packaging: product.packaging || "",
        paymentTerms: product.paymentTerms || "",
        shippingTerms: product.shippingTerms || "",
        monthlyProductionCapacity: product.monthlyProductionCapacity || "",
        availableCapacity: product.availableCapacity || "",
        exportMarkets: product.exportMarkets || "",
        applications: product.applications || "",
        hsCode: product.hsCode || "",
        certifications: product.certifications || "",
        specifications: product.specifications || "",
        tdsUrl: product.tdsUrl || "",
      });

      // Filter only real existing image URLs (skip placeholder svgs and empty strings)
      const initialImages = Array.from(
        new Set(
          [product.imageUrl, ...(product.images || [])].filter(
            (u): u is string => Boolean(u && typeof u === 'string' && u.trim() !== '' && !u.includes('placeholder_') && !u.endsWith('.svg'))
          )
        )
      );
      setExistingImages(initialImages);
      setNewImageFiles([]);
    } else {
      setEditingId(null);
      setFormData({ ...emptyFormData });
      setExistingImages([]);
      setNewImageFiles([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setExistingImages([]);
    setNewImageFiles([]);
  };

  const handleMultipleImagesSelect = (files: File[]) => {
    const validFiles: NewImageItem[] = [];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toast.error(`"${file.name}" is not a valid format (JPG, PNG, WebP).`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 5MB size limit.`);
        continue;
      }
      validFiles.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      });
    }
    if (validFiles.length > 0) {
      setNewImageFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (id: string) => {
    setNewImageFiles(prev => prev.filter(item => item.id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
      return;
    }

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRichTextChange = (field: string, content: string) => {
    setFormData((prev) => ({ ...prev, [field]: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return toast.error("Unauthorized");

    if (!formData.name.trim() || !formData.category.trim() || !formData.description.trim()) {
      return toast.error("Please fill in all required fields.");
    }

    const totalImagesCount = existingImages.length + newImageFiles.length;
    if (totalImagesCount === 0 && !editingId) {
      return toast.error("Please upload at least one product image.");
    }

    if (formData.featured) {
      const currentEditingProduct = editingId ? products.find(p => p._id === editingId) : null;
      const isAlreadyFeatured = currentEditingProduct?.featured;
      if (!isAlreadyFeatured && featuredCount >= 3) {
        return toast.error("Maximum 3 featured products allowed. Please unfeature another product first.");
      }
    }

    setSubmitting(true);
    const url = editingId ? `${API_BASE}/products/${editingId}` : `${API_BASE}/products`;
    const method = editingId ? "PUT" : "POST";

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'imageUrl' || key === 'tdsUrl') {
          return; // Handled separately
        }
        if (key === 'technicalSpecs') {
          fd.append(key, JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          fd.append(key, String(value));
        } else {
          fd.append(key, value as string);
        }
      });

      // Retained existing images
      fd.append("bodyImages", JSON.stringify(existingImages));
      if (existingImages.length > 0) {
        fd.append("imageUrl", existingImages[0]);
      }

      // New image files
      newImageFiles.forEach((item) => {
        fd.append("images", item.file);
      });

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (res.ok) {
        toast.success(editingId ? "Product updated successfully" : "Product added successfully");
        fetchProducts();
        closeModal();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product due to a network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    const token = getAuthToken();
    if (!token) return toast.error("Unauthorized");

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleFeatured = async (product: any) => {
    const token = getAuthToken();
    if (!token) return toast.error("Unauthorized");

    if (!product.featured && featuredCount >= 3) {
      toast.error("Maximum 3 featured products allowed. Please unfeature another product first.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("featured", String(!product.featured));

      const res = await fetch(`${API_BASE}/products/${product._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (res.ok) {
        toast.success(
          !product.featured
            ? `"${product.name}" is now featured on the homepage`
            : `"${product.name}" removed from homepage featured`
        );
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update featured status");
      }
    } catch (error) {
      console.error("Toggle featured error:", error);
      toast.error("Network error while updating featured status");
    }
  };

  useEffect(() => setCurrentPage(1), [searchQuery]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (p.category?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const featuredCount = products.filter((p) => p.featured).length;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-brand">Products Catalog</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage your recycled plastic manufacturing products.
          </p>
        </div>

        <button onClick={() => openModal()} className="admin-btn-primary w-full sm:w-auto">
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-white p-2.5 sm:p-3.5 rounded-lg border border-stone-200 shadow-2xs flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 text-brand flex items-center justify-center text-sm sm:text-base shrink-0">
            <FaBoxOpen />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider truncate">Total</p>
            <p className="text-lg sm:text-xl font-serif font-bold text-brand">{products.length}</p>
          </div>
        </div>
        <div className="bg-white p-2.5 sm:p-3.5 rounded-lg border border-stone-200 shadow-2xs flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gold/10 text-gold-dark flex items-center justify-center text-sm sm:text-base shrink-0">
            <FaStar />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider truncate">Featured</p>
            <p className="text-lg sm:text-xl font-serif font-bold text-brand">
              {featuredCount} <span className="text-xs sm:text-sm font-normal text-stone-400">/ 3</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="admin-card !p-2.5 sm:!p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs sm:text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="admin-input !pl-9 sm:!pl-10 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex bg-stone-100 p-1 rounded border border-stone-200 text-stone-600">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition-colors ${viewMode === "table" ? "bg-white text-brand shadow-2xs" : "hover:text-brand"}`}
              title="Table View"
            >
              <FaThList size={13} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-white text-brand shadow-2xs" : "hover:text-brand"}`}
              title="Grid View"
            >
              <FaThLarge size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-lg border border-stone-200 p-16 text-center text-stone-500">
          <FaSpinner className="animate-spin text-3xl mx-auto mb-4" />
        </div>
      ) : viewMode === "table" ? (
        <div className="admin-table-container bg-white">
          <table className="admin-table min-w-[550px] sm:min-w-[650px]">
            <thead>
              <tr>
                <th className="w-2/5">Product Details</th>
                <th className="w-1/4">Category</th>
                <th className="text-center w-1/5">Featured (Max 3)</th>
                <th className="text-right w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {paginatedProducts.map((product) => (
                <tr key={product._id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-[180px] sm:min-w-[220px]">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded overflow-hidden shrink-0 border border-stone-200 bg-stone-50">
                        <SafeImage src={product.imageUrl} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif font-semibold text-brand text-xs sm:text-sm truncate">{product.name}</p>
                        <p className="text-[11px] sm:text-xs text-stone-500 truncate">{product.materialType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-xs sm:text-sm font-medium text-stone-700 whitespace-nowrap">
                    {product.category}
                  </td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(product)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                        product.featured
                          ? "bg-gold/20 text-gold-dark border border-gold/40 hover:bg-gold/30"
                          : featuredCount >= 3
                          ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed opacity-60"
                          : "bg-stone-100 text-stone-500 hover:bg-gold/10 hover:text-gold-dark border border-stone-200"
                      }`}
                      title={!product.featured && featuredCount >= 3 ? "Maximum 3 featured products reached" : product.featured ? "Click to unfeature" : "Click to feature"}
                    >
                      <FaStar className={product.featured ? "text-gold" : "text-stone-400"} size={11} />
                      <span>{product.featured ? "Featured" : "Feature"}</span>
                    </button>
                  </td>
                  <td className="py-2.5 px-3 sm:py-3.5 sm:px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openModal(product)} className="admin-btn-icon" title="Edit"><FaEdit size={13} /></button>
                      <button onClick={() => handleDelete(product._id)} className="admin-btn-icon-danger" title="Delete"><FaTrash size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg border border-stone-200 overflow-hidden">
              <SafeImage src={product.imageUrl} alt={product.name} width={400} height={225} className="w-full object-cover" />
              <div className="p-4">
                <h3 className="font-serif font-semibold text-brand">{product.name}</h3>
                <p className="text-xs text-stone-500 mt-1">{product.category}</p>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(product)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      product.featured
                        ? "bg-gold/20 text-gold-dark"
                        : featuredCount >= 3
                        ? "bg-stone-100 text-stone-400 opacity-60 cursor-not-allowed"
                        : "bg-stone-100 text-stone-600 hover:bg-gold/10"
                    }`}
                  >
                    <FaStar size={10} className={product.featured ? "text-gold" : "text-stone-400"} />
                    <span>{product.featured ? "Featured" : "Feature"}</span>
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(product)} className="text-brand hover:text-accent"><FaEdit /></button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-500"><FaTrash /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-stone-50 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white rounded-t-xl sticky top-0 z-10 shrink-0">
              <h2 className="text-xl font-serif font-bold text-brand">{editingId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-brand bg-stone-100 hover:bg-stone-200 p-2 rounded-full transition-colors"><FaTimes /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info */}
                <div className="bg-white p-5 rounded-lg border border-stone-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4 border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="admin-label">Product Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Category *</label>
                      <input type="text" name="category" value={formData.category} onChange={handleChange} required className="admin-input" placeholder="e.g. PET Flakes" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="admin-label">Short Description *</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="admin-input" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="admin-label">Detailed Specifications (Rich Text)</label>
                      <RichTextEditor value={formData.specifications} onChange={(val) => handleRichTextChange("specifications", val)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="admin-label">Applications (Rich Text)</label>
                      <RichTextEditor value={formData.applications} onChange={(val) => handleRichTextChange("applications", val)} />
                    </div>
                  </div>
                </div>

                {/* Material Info */}
                <div className="bg-white p-5 rounded-lg border border-stone-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4 border-b pb-2">Material Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="admin-label">Material Type (e.g. PET, PP)</label>
                      <input type="text" name="materialType" value={formData.materialType} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Color</label>
                      <input type="text" name="color" value={formData.color} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Processing Type (e.g. Hot Washed)</label>
                      <input type="text" name="processingType" value={formData.processingType} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Chip/Flake Size</label>
                      <input type="text" name="chipSize" value={formData.chipSize} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Grade Quality</label>
                      <input type="text" name="gradeQuality" value={formData.gradeQuality} onChange={handleChange} className="admin-input" />
                    </div>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="bg-white p-5 rounded-lg border border-stone-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4 border-b pb-2">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="admin-label">IV (Intrinsic Viscosity)</label>
                      <input type="text" name="technicalSpecs.iv" value={formData.technicalSpecs.iv} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Moisture Content</label>
                      <input type="text" name="technicalSpecs.moisture" value={formData.technicalSpecs.moisture} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">PVC Content</label>
                      <input type="text" name="technicalSpecs.pvc" value={formData.technicalSpecs.pvc} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Contamination / Impurity</label>
                      <input type="text" name="technicalSpecs.contamination" value={formData.technicalSpecs.contamination} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Melt Flow Index</label>
                      <input type="text" name="technicalSpecs.meltFlowIndex" value={formData.technicalSpecs.meltFlowIndex} onChange={handleChange} className="admin-input" />
                    </div>
                  </div>
                </div>

                {/* Commercial Info */}
                <div className="bg-white p-5 rounded-lg border border-stone-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4 border-b pb-2">Commercial & Export Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="admin-label">MOQ</label>
                      <input type="text" name="moq" value={formData.moq} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Monthly Production Capacity</label>
                      <input type="text" name="monthlyProductionCapacity" value={formData.monthlyProductionCapacity} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Packaging</label>
                      <input type="text" name="packaging" value={formData.packaging} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Payment Terms</label>
                      <input type="text" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Shipping Terms (FOB/CIF)</label>
                      <input type="text" name="shippingTerms" value={formData.shippingTerms} onChange={handleChange} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">HS Code</label>
                      <input type="text" name="hsCode" value={formData.hsCode} onChange={handleChange} className="admin-input" />
                    </div>
                  </div>
                </div>

                {/* Product Images Section */}
                <div className="bg-white p-5 rounded-lg border border-stone-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b pb-2">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">Product Images</h3>
                      <p className="text-xs text-stone-400 mt-0.5">Upload one or multiple high-quality product images</p>
                    </div>
                    <AdminUploadButton
                      multiple={true}
                      onMultipleFilesSelect={handleMultipleImagesSelect}
                      label="Upload Images"
                      compact={true}
                    />
                  </div>

                  {/* Gallery of Uploaded / Existing Images */}
                  {existingImages.length === 0 && newImageFiles.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-lg bg-stone-50/50">
                      <FaImage className="mx-auto h-10 w-10 text-stone-300 mb-2" />
                      <p className="text-xs font-medium text-stone-500">No images uploaded yet</p>
                      <p className="text-[11px] text-stone-400 mt-1">Click &quot;Upload Images&quot; above to select photos</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {/* Existing Images from Server */}
                      {existingImages.map((url, idx) => (
                        <div key={`existing-${idx}`} className="relative group rounded-lg overflow-hidden border border-stone-200 aspect-square bg-stone-100 shadow-2xs">
                          <SafeImage src={url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              Main
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(idx)}
                            className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Remove image"
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                      ))}

                      {/* Newly Selected Images */}
                      {newImageFiles.map((item, idx) => (
                        <div key={item.id} className="relative group rounded-lg overflow-hidden border-2 border-brand/40 aspect-square bg-stone-100 shadow-2xs">
                          <SafeImage src={item.preview} alt={`New upload ${idx + 1}`} className="w-full h-full object-cover" />
                          {existingImages.length === 0 && idx === 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              Main
                            </span>
                          )}
                          <span className="absolute bottom-1.5 left-1.5 bg-gold text-white text-[9px] font-bold px-1 py-0.5 rounded">
                            New
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(item.id)}
                            className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Remove image"
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom: Featured Setting (Compact & Small) */}
                <div className="bg-white p-3.5 rounded-lg border border-stone-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FaStar className={formData.featured ? "text-gold" : "text-stone-400"} size={14} />
                    <div className="text-xs font-semibold text-stone-700">
                      Feature on Homepage
                    </div>
                    <span className="text-[11px] text-stone-400 font-normal shrink-0">
                      ({featuredCount}/3 featured)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.featured) {
                        const currentEditingProduct = editingId ? products.find(p => p._id === editingId) : null;
                        const isAlreadyFeatured = currentEditingProduct?.featured;
                        if (!isAlreadyFeatured && featuredCount >= 3) {
                          toast.error("Maximum 3 featured products allowed. Please unfeature another product first.");
                          return;
                        }
                      }
                      setFormData(prev => ({ ...prev, featured: !prev.featured }));
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                      formData.featured
                        ? "bg-gold text-white shadow-xs hover:bg-gold-dark"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-300"
                    }`}
                  >
                    <FaStar size={10} className={formData.featured ? "text-white" : "text-stone-400"} />
                    <span>{formData.featured ? "Featured (Active)" : "Set as Featured"}</span>
                  </button>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-stone-200 bg-white rounded-b-xl flex justify-end gap-3 sticky bottom-0 shrink-0">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded">
                Cancel
              </button>
              <button type="submit" form="productForm" disabled={submitting} className="admin-btn-primary min-w-[120px]">
                {submitting ? <FaSpinner className="animate-spin mx-auto" /> : editingId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
