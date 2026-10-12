import PageBannerAdminContent from "@/components/admin/PageBannerAdminContent";
import { PAGE_BANNER_CONFIGS } from "@/lib/pageBanners";

export const metadata = {
  title: "Admin - Management Banner",
};

export default function ManagementBannerPage() {
  return <PageBannerAdminContent config={PAGE_BANNER_CONFIGS["about/management"]} />;
}
