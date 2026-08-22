import AdminDashboardLayoutContent from "@/components/admin/layout/AdminDashboardLayoutContent";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardLayoutContent>{children}</AdminDashboardLayoutContent>;
}
