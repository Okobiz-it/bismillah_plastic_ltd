"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, API_BASE } from "@/lib/api";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";
import SafeImage from "@/components/shared/SafeImage";
import { IMAGES } from "@/constants/images";

type ViewState = "login" | "verify_otp" | "reset_password";

export default function AdminLoginContent() {
  const [view, setView] = useState<ViewState>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { companyName } = useGlobalSettings();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      router.replace("/admin/products");
    }
  }, [router]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("admin_token", data.data.token);
      localStorage.setItem("adminToken", data.data.token);
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to request OTP");

      setSuccess("A verification OTP has been sent to the administrator email.");
      setCooldown(data.data?.cooldownSeconds || 60);
      setView("verify_otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to verify OTP");

      setResetToken(data.data.resetToken);
      setSuccess("OTP verified successfully. Set your new password below.");
      setView("reset_password");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please ensure both passwords match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setSuccess("Password updated successfully! Please sign in with your new password.");
      setView("login");
      setPassword("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-ivory font-sans selection:bg-gold selection:text-brand">
      {/* LEFT PANEL – Branding & Visuals (Hidden on Mobile & Tablet, visible on Desktop lg+) */}
      <div className="hidden lg:flex lg:flex-col lg:w-[45%] xl:w-[42%] bg-brand relative overflow-hidden justify-between p-8 sm:p-12 lg:p-16 text-white min-h-screen">
        {/* Soft Abstract Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B2942] via-[#0F4C81] to-[#0B2942] pointer-events-none" />

        {/* Soft Glowing Accents */}
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-brand/30 rounded-full blur-[100px] pointer-events-none" />

        {/* Subtle Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Logistics & World Network Minimal Line Art Illustration */}
        <svg className="absolute right-0 top-1/3 w-[120%] opacity-15 pointer-events-none stroke-white/40" viewBox="0 0 600 400" fill="none">
          <path d="M50 200 Q 150 100, 300 200 T 550 200" strokeWidth="1.5" strokeDasharray="6 6" />
          <path d="M100 280 Q 250 180, 400 280 T 580 180" strokeWidth="1.5" />
          <circle cx="300" cy="200" r="4" fill="#16A34A" />
          <circle cx="150" cy="150" r="3" fill="#16A34A" />
          <circle cx="450" cy="240" r="3" fill="#16A34A" />
        </svg>

        {/* Header: Logo & Company Name */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-8 h-8 md:w-12 md:h-12 relative bg-white/95 backdrop-blur-md border border-white/40 rounded-2xl p-1 flex items-center justify-center shadow-xl shrink-0">
            <SafeImage
              src={IMAGES.MAPLE_LOGO}
              alt={`${companyName} Logo`}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest block mb-0.5">
              Corporate Portal
            </span>
            <h2 className="font-serif text-lg md:text-xl font-bold text-white tracking-wide">
              {companyName}
            </h2>
          </div>
        </div>

        {/* Welcome Content */}
        <div className="relative z-10 my-auto py-12 lg:py-0 space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            ADMIN LOGIN
          </h1>

          <p className="text-white/75 text-sm md:text-base max-w-md leading-relaxed font-normal">
            Secure access to the administration dashboard.
          </p>
        </div>

        {/* Footer Sub-info */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <span>© {new Date().getFullYear()} {companyName}</span>
        </div>
      </div>

      {/* RIGHT PANEL – Login Form (Full width on Mobile & Tablet, ~55% on Desktop) */}
      <div className="w-full lg:w-[55%] xl:w-[58%] min-h-screen flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 bg-ivory">
        <div className="w-full max-w-[612px] mx-auto bg-white rounded-2xl border border-stone-200/80 shadow-xl p-6 sm:p-8 md:p-10 relative">

          {/* Form Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-brand tracking-tight">
              {view === "login" && "Welcome Back"}
              {view === "verify_otp" && "Verify Security OTP"}
              {view === "reset_password" && "Reset Password"}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 sm:mt-1.5 font-normal leading-relaxed">
              {view === "login" && "Sign in to continue to the Admin Dashboard."}
              {view === "verify_otp" && "Enter the 6-digit OTP sent to administrator email."}
              {view === "reset_password" && "Create a new secure password for your administrator account."}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 bg-red-50 text-red-700 text-xs font-semibold rounded-md border border-red-200/80 leading-relaxed flex items-start gap-2.5">
              <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200/80 leading-relaxed flex items-start gap-2.5">
              <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* LOGIN VIEW */}
          {view === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 sm:mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 sm:py-3 border border-stone-300 rounded-md text-xs sm:text-sm text-stone-900 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-200"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 sm:mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 sm:py-3 border border-stone-300 rounded-md text-xs sm:text-sm text-stone-900 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 bg-brand hover:bg-gold text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 cursor-pointer shadow-md disabled:opacity-50 mt-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* Forgot Password Link Below Login Button */}
              <div className="pt-2 sm:pt-3 text-center">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="text-xs font-semibold text-stone-500 hover:text-brand transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          )}

          {/* VERIFY OTP VIEW */}
          {view === "verify_otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-gold bg-stone-50/50 text-brand text-center tracking-[0.4em] font-mono text-2xl font-bold transition-all outline-none"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-2.5 bg-brand hover:bg-gold text-white text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="pt-3 space-y-2 text-center">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading || cooldown > 0}
                  className="w-full py-2.5 bg-stone-100 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-stone-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError("");
                    setSuccess("");
                    setOtp("");
                  }}
                  className="text-xs font-semibold text-stone-500 hover:text-brand transition-colors cursor-pointer block mx-auto pt-1"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* RESET PASSWORD VIEW */}
          {view === "reset_password" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-md text-sm text-stone-900 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-200"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-md text-sm text-stone-900 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all duration-200"
                  placeholder="Re-enter new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gold hover:bg-brand text-white text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError("");
                    setSuccess("");
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-xs font-semibold text-stone-500 hover:text-brand transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
