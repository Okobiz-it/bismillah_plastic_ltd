import PageBannerAdminContent from "@/components/admin/PageBannerAdminContent";
import { PAGE_BANNER_CONFIGS } from "@/lib/pageBanners";

export const metadata = {
  title: "Admin - Mission & Vision Banner",
};

export default function MissionVisionBannerPage() {
  return <PageBannerAdminContent config={PAGE_BANNER_CONFIGS["about/mission-vision"]} />;
}
