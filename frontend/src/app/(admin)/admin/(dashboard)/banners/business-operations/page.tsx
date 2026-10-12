import PageBannerAdminContent from "@/components/admin/PageBannerAdminContent";
import { PAGE_BANNER_CONFIGS } from "@/lib/pageBanners";

export const metadata = {
  title: "Admin - Business Operations Banner",
};

export default function BusinessOperationsBannerPage() {
  return <PageBannerAdminContent config={PAGE_BANNER_CONFIGS["business-operations"]} />;
}
