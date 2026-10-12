import PageBannerAdminContent from "@/components/admin/PageBannerAdminContent";
import { PAGE_BANNER_CONFIGS } from "@/lib/pageBanners";

export const metadata = {
  title: "Admin - About Us Banner",
};

export default function AboutBannerPage() {
  return <PageBannerAdminContent config={PAGE_BANNER_CONFIGS["about"]} />;
}
