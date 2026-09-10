import { longtailCard, longtailParams } from "@/lib/og-longtail";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return longtailParams(2, "cat");
}

export async function GET(_req: Request, { params }: { params: Promise<{ a: string; b: string }> }) {
  const { a, b } = await params;
  return longtailCard([a, b], "cat");
}
