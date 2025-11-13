import { kv } from "@vercel/kv";
import { defaultContent, KV_KEY } from "@/lib/constants";
import Header from "@/app/components/Header/Header";
import HeroSection from "@/app/components/HeroSection/HeroSection";
import ProgramOverview from "@/app/components/ProgramSection/ProgramOverview";
import Footer from "@/app/components/Footer/Footer";
import JsonLd from "@/app/components/SEO/JsonLd";
import { buildHomeJsonLd } from "@/lib/jsonld";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
    title: "IT Job Now | Launch Your Tech Career in 5 Weeks",
    description:
        "Join IT Job Now’s immersive 5-week bootcamp and gain real-world tech skills, career coaching, and hiring support.",
};

export default async function Home() {
    let content = null;
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
            content = await kv.get(KV_KEY);
        } catch (error) {
            console.error("KV error:", error);
        }
    }
    const finalContent = content || defaultContent;
    console.log(finalContent, "finalContentfinalContent");
    const hero = finalContent.hero || defaultContent.hero;

    const jsonLd = buildHomeJsonLd(finalContent);

    return (
        <>
            <JsonLd data={jsonLd} />
            <main className="min-h-screen">
                <Header content={finalContent} />
                <HeroSection hero={hero} />
                <ProgramOverview content={finalContent} />
                <Footer content={finalContent} />
            </main>
        </>
    );
}

