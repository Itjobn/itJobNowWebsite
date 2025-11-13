import { kv } from "@vercel/kv";
import { defaultContent, KV_KEY } from "@/lib/constants";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import FAQSection from "@/app/components/ProgramSection/FAQ";
import JsonLd from "@/app/components/SEO/JsonLd";
import { buildContactJsonLd } from "@/lib/jsonld";
import ContactUsHeroSection from "./ContactUsHeroSection";

export default async function ContactUs() {
    // Fetch content for background video/image
    let content = null;
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
            content = await kv.get(KV_KEY);
        } catch (error) {
            console.error("KV error:", error);
        }
    }
    const finalContent = content || defaultContent;
    const hero = finalContent.hero || defaultContent.hero;
    const { backgroundImage, backgroundVideo } = hero || {};

    const jsonLd = buildContactJsonLd(finalContent);

    return (
        <>
            <JsonLd data={jsonLd} />
            <main className="min-h-screen">
                <Header content={finalContent} />
                <ContactUsHeroSection
                    backgroundImage={backgroundImage}
                    backgroundVideo={backgroundVideo}
                />
                <FAQSection faq={finalContent.faq} />
                <Footer content={finalContent} />
            </main>
        </>
    );
}


