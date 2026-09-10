import { longtailCard, longtailParams } from "@/lib/og-longtail";

export const dynamic = "force-static";

export function generateStaticParams() {
  return longtailParams(2);
}

export async function GET(_req: Request, { params }: { params: Promise<{ a: string; b: string }> }) {
  const { a, b } = await params;
  return longtailCard([a, b]);
}
