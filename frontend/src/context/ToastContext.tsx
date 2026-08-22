"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaTimes, FaInfoCircle } from "react-icons/fa";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const success = useCallback((message: string) => toast(message, "success"), [toast]);
  const error = useCallback((message: string) => toast(message, "error"), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 w-80 p-4 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] bg-white border border-stone-200`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {t.type === "success" ? (
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                ) : t.type === "error" ? (
                  <FaExclamationCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <FaInfoCircle className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex-1 text-[13px] font-medium text-slate-700 leading-snug pt-0.5">
                {t.message}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 text-slate-300 hover:text-slate-500 hover:bg-slate-100 p-1 rounded-sm transition-colors mt-[-2px] mr-[-4px]"
                aria-label="Close"
              >
                <FaTimes className="w-3 h-3" />
              </button>

              {/* Progress Bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-[3px] ${
                  t.type === "success"
                    ? "bg-green-500"
                    : t.type === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
