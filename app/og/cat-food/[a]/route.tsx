import { longtailCard, longtailParams } from "@/lib/og-longtail";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return longtailParams(1, "cat");
}

export async function GET(_req: Request, { params }: { params: Promise<{ a: string }> }) {
  const { a } = await params;
  return longtailCard([a], "cat");
}
