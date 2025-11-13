import { kv } from "@vercel/kv";
import { defaultContent, KV_KEY } from "@/lib/constants";
import EnrollToCourseClient from "./EnrollToCourseClient";
import JsonLd from "@/app/components/SEO/JsonLd";
import { buildEnrollJsonLd } from "@/lib/jsonld";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EnrollToCoursePage() {
  let content = null;
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      content = await kv.get(KV_KEY);
    } catch (error) {
      console.error("KV error:", error);
    }
  }

  const finalContent = content || defaultContent;
  const dynamicCycles = finalContent?.programOverview?.bootcampCycles;
  const fallbackCycles = defaultContent.programOverview.bootcampCycles;
  const bootcampCycles =
    Array.isArray(dynamicCycles) && dynamicCycles.length > 0
      ? dynamicCycles
      : fallbackCycles;

  const jsonLd = buildEnrollJsonLd(finalContent, bootcampCycles);

  return (
    <>
      <JsonLd data={jsonLd} />
      <EnrollToCourseClient bootcampCycles={bootcampCycles} />
    </>
  );
}
