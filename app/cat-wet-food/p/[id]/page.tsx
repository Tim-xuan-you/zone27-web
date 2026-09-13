import ProductPage, { productMetadata, productParams } from "@/components/ProductPage";

// 商品頁。內容全部在 components/ProductPage.tsx，這裡只決定是哪一個類目
export const dynamicParams = false;

export function generateStaticParams() {
  return productParams("cat", "wet");
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return productMetadata((await params).id);
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ProductPage id={(await params).id} species="cat" form="wet" />;
}
