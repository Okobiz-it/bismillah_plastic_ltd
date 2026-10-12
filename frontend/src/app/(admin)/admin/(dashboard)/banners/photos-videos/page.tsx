import PageBannerAdminContent from "@/components/admin/PageBannerAdminContent";
import { PAGE_BANNER_CONFIGS } from "@/lib/pageBanners";

export const metadata = {
  title: "Admin - Photos & Videos Banner",
};

export default function PhotosVideosBannerPage() {
  return <PageBannerAdminContent config={PAGE_BANNER_CONFIGS["photos-videos"]} />;
}
