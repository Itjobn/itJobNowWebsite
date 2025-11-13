import { kv } from "@vercel/kv";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import PaymentClient from "./PaymentClient";
import { defaultContent, KV_KEY } from "@/lib/constants";
import JsonLd from "@/app/components/SEO/JsonLd";
import { buildPaymentJsonLd } from "@/lib/jsonld";

export const metadata = {
    title: "Secure Bootcamp Payment | IT Job Now",
    description:
        "Complete your IT Job Now bootcamp enrollment payment securely and confirm your spot in the upcoming cohort.",
};

const COURSE_NAME = "UI/UX Designer Professional";

export default async function PaymentPage({ searchParams }) {
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
    const cycles =
        Array.isArray(dynamicCycles) && dynamicCycles.length > 0
            ? dynamicCycles
            : fallbackCycles;

    const resolvedSearchParams =
        searchParams && typeof searchParams.then === "function"
            ? await searchParams
            : searchParams;

    const cycleId = resolvedSearchParams?.cycle || cycles[0]?.id || "current";

    const selectedCycleData =
        cycles.find((cycle) => cycle.id === cycleId) || cycles[0];

    const jsonLd = buildPaymentJsonLd(finalContent, selectedCycleData);

    return (
        <>
            <JsonLd data={jsonLd} />
            <main className="min-h-screen">
                <Header content={finalContent} />
                <div className="mt-20 py-16 px-4 bg-white">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black font-switzer">
                                Secure Payment
                            </h2>
                            <p className="text-lg text-gray-600">
                                Complete your booking securely. Your details are protected.
                            </p>
                        </div>

                        <PaymentClient
                            courseName={COURSE_NAME}
                            selectedCycleData={selectedCycleData}
                        />
                    </div>
                </div>
                <Footer content={finalContent} />
            </main>
        </>
    );
}
