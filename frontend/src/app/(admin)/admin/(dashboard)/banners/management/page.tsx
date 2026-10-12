import { redirect } from "next/navigation";

export default function ManagementRedirectPage() {
  redirect("/admin/banners/about/management");
}
