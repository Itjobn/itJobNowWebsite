import { kv } from "@vercel/kv";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import EnrollToCourse from "@/app/Pages/EnrollToCourse/page";
import { defaultContent, KV_KEY } from "@/lib/constants";
import JsonLd from "@/app/components/SEO/JsonLd";
import { buildEnrollJsonLd } from "@/lib/jsonld";

export const metadata = {
    title: "Enroll in IT Job Now Bootcamp",
    description: "Reserve your seat in the upcoming IT Job Now bootcamp cohort and secure your place in our 5-week intensive program.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EnrollPage() {
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
            <Header content={finalContent} />
            <EnrollToCourse bootcampCycles={bootcampCycles} />
            <Footer content={finalContent} />
        </>
    );
}
