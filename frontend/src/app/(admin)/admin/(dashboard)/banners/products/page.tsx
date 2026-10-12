import PageBannerAdminContent from "@/components/admin/PageBannerAdminContent";
import { PAGE_BANNER_CONFIGS } from "@/lib/pageBanners";

export const metadata = {
  title: "Admin - Products Banner",
};

export default function ProductsBannerPage() {
  return <PageBannerAdminContent config={PAGE_BANNER_CONFIGS["products"]} />;
}
