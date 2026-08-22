"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      router.replace("/admin/products");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-light">
      <div className="text-stone-500 text-sm">Redirecting to Admin Portal...</div>
    </div>
  );
}
