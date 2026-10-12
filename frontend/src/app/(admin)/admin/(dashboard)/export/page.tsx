import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin - Impact",
};

export default function AdminExportPage() {
  redirect("/admin/impact");
}

