import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LongTail, { longTailMetadata } from "@/components/LongTail";
import { allPaths, resolve } from "@/lib/slugs";

/** 狗飼料長尾頁。內容在 components/LongTail，跟貓飼料共用同一份。 */

export const dynamicParams = false;

export function generateStaticParams() {
  return allPaths("dog").map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string[] }> }
): Promise<Metadata> {
  const { slug } = await params;
  return longTailMetadata("dog", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (!resolve(slug, "dog")) notFound();
  return <LongTail sp="dog" slug={slug} />;
}
