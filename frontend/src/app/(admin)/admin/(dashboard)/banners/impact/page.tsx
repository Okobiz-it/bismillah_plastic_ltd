import PageBannerAdminContent from "@/components/admin/PageBannerAdminContent";
import { PAGE_BANNER_CONFIGS } from "@/lib/pageBanners";

export const metadata = {
  title: "Admin - Impact Banner",
};

export default function ImpactBannerPage() {
  return <PageBannerAdminContent config={PAGE_BANNER_CONFIGS["impact"]} />;
}
