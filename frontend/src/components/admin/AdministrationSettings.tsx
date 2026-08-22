"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import {
  FaBuilding,
  FaEnvelope,
  FaLock,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserShield
} from "react-icons/fa";

export default function AdministrationSettings() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  // Global settings
  const [companyName, setCompanyName] = useState("");
  const [initialCompanyName, setInitialCompanyName] = useState("");
  const [submittingCompany, setSubmittingCompany] = useState(false);

  // Email update
  const [adminEmail, setAdminEmail] = useState("");
  const [initialAdminEmail, setInitialAdminEmail] = useState("");
  const [currentEmailPassword, setCurrentEmailPassword] = useState("");
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // Password update
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [adminRes, settingsRes] = await Promise.all([
        fetchApi("/auth/me"),
        fetchApi("/settings/companyName").catch(() => ({ data: "Bismillah Plastic" }))
      ]);
      if (adminRes.data) {
        setAdminEmail(adminRes.data.email);
        setInitialAdminEmail(adminRes.data.email);
      }
      if (settingsRes.data) {
        const fetchedName = settingsRes.data.companyName || settingsRes.data;
        setCompanyName(fetchedName);
        setInitialCompanyName(fetchedName);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load administration data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast.error("Company name cannot be empty");
      return;
    }
    setSubmittingCompany(true);
    try {
      await fetchApi("/settings/companyName", {
        method: "PUT",
        body: JSON.stringify({ companyName }),
        headers: { "Content-Type": "application/json" }
      });
      setInitialCompanyName(companyName);
      toast.success("Company name updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to update company name");
    } finally {
      setSubmittingCompany(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) {
      toast.error("Email address cannot be empty");
      return;
    }
    setSubmittingEmail(true);
    try {
      const res = await fetchApi("/auth/update-email", {
        method: "PUT",
        body: JSON.stringify({ email: adminEmail, currentPassword: currentEmailPassword }),
        headers: { "Content-Type": "application/json" }
      });
      setInitialAdminEmail(adminEmail);
      toast.success(res.message || "Admin email updated successfully");
      setCurrentEmailPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update email");
    } finally {
      setSubmittingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmittingPassword(true);
    try {
      const res = await fetchApi("/auth/update-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
        headers: { "Content-Type": "application/json" }
      });
      toast.success(res.message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setSubmittingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 border-3 border-stone-200 border-t-gold rounded-full animate-spin"></div>
        <p className="text-xs text-stone-400">Loading settings...</p>
      </div>
    );
  }

  const isCompanyChanged = companyName !== initialCompanyName && companyName.trim() !== "";
  const isEmailChanged = adminEmail !== initialAdminEmail && adminEmail.trim() !== "";
  const isPasswordValid = currentPassword && newPassword.length >= 6 && newPassword === confirmPassword;

  return (
    <div className="space-y-4 animate-fadeIn max-w-5xl pb-6">
      {/* Minimal Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
        <div>
          <h1 className="text-xl font-semibold text-brand tracking-tight">Administration</h1>
          <p className="text-xs text-stone-500 mt-0.5">Manage global organization settings and admin account security.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-medium border border-stone-200/70">
          <FaUserShield className="text-stone-400" />
          <span className="truncate max-w-[180px]">{initialAdminEmail || "Admin"}</span>
        </div>
      </div>

      {/* Global Site Settings Card */}
      <div className="admin-card !p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FaBuilding className="text-brand text-sm" />
            <h2 className="text-sm font-semibold text-brand">Company Name</h2>
          </div>
          {initialCompanyName && (
            <span className="text-[11px] text-stone-500 font-medium truncate max-w-[200px]">
              Current: <strong className="text-stone-700">{initialCompanyName}</strong>
            </span>
          )}
        </div>

        <div className="p-4">
          <form onSubmit={handleUpdateCompany} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Bismillah Plastic"
                className="admin-input !bg-stone-50/30 focus:!bg-white"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Updates logo alt text, headers, footers, hero section, and metadata site-wide.
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={submittingCompany || !isCompanyChanged}
                className="admin-btn-primary"
              >
                {submittingCompany ? (
                  <>
                    <FaSpinner className="animate-spin w-3 h-3" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="w-3 h-3" />
                    <span>Save Company Name</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Security Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Update Email Card */}
        <div className="admin-card !p-0 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/50 flex items-center gap-2.5">
              <FaEnvelope className="text-amber-600 text-sm" />
              <h2 className="text-sm font-semibold text-brand">Admin Email Address</h2>
            </div>

            <div className="p-4">
              <form onSubmit={handleUpdateEmail} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    New Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="admin-input !bg-stone-50/30 focus:!bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showEmailPassword ? "text" : "password"}
                      required
                      placeholder="Current password"
                      value={currentEmailPassword}
                      onChange={(e) => setCurrentEmailPassword(e.target.value)}
                      className="admin-input !pl-3 !pr-9 !bg-stone-50/30 focus:!bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmailPassword(!showEmailPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                    >
                      {showEmailPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingEmail || !currentEmailPassword || !isEmailChanged}
                    className="admin-btn-primary"
                  >
                    {submittingEmail ? (
                      <>
                        <FaSpinner className="animate-spin w-3 h-3" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="w-3 h-3" />
                        <span>Update Email</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Update Password Card */}
        <div className="admin-card !p-0 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/50 flex items-center gap-2.5">
              <FaLock className="text-blue-600 text-sm" />
              <h2 className="text-sm font-semibold text-brand">Change Password</h2>
            </div>

            <div className="p-4">
              <form onSubmit={handleUpdatePassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="admin-input !pl-3 !pr-9 !bg-stone-50/30 focus:!bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                    >
                      {showCurrentPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="admin-input !pl-3 !pr-9 !bg-stone-50/30 focus:!bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                    >
                      {showNewPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="admin-input !pl-3 !pr-9 !bg-stone-50/30 focus:!bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {newPassword && confirmPassword && (
                    <div className="mt-1 text-[11px] font-medium">
                      {newPassword === confirmPassword ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <FaCheckCircle className="w-3 h-3" /> Passwords match
                        </span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">
                          <FaExclamationTriangle className="w-3 h-3" /> Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingPassword || !isPasswordValid}
                    className="admin-btn-primary"
                  >
                    {submittingPassword ? (
                      <>
                        <FaSpinner className="animate-spin w-3 h-3" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="w-3 h-3" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
