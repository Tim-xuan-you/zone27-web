import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LongTail, { longTailMetadata } from "@/components/LongTail";
import { isLive } from "@/lib/catalog";
import { allPaths, resolve } from "@/lib/slugs";

/**
 * 貓飼料長尾頁。內容在 components/LongTail，跟狗飼料共用同一份。
 *
 * 類目還沒開張（能推薦的不到 MIN_LIVE 款）就一頁都不產生。
 * 產生出來只會是幾十頁「還在上架」，Google 會把整個 /cat-food 記成空殼。
 * 連結補齊、重新 build，這些頁自己就長出來了。
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return isLive("cat") ? allPaths("cat").map((slug) => ({ slug })) : [];
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string[] }> }
): Promise<Metadata> {
  const { slug } = await params;
  return longTailMetadata("cat", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (!isLive("cat") || !resolve(slug, "cat")) notFound();
  return <LongTail sp="cat" slug={slug} />;
}
