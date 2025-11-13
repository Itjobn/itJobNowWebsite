import { kv } from "@vercel/kv";
import ContactUs from "@/app/Pages/ContactUs/ContactUs";
import { defaultContent, KV_KEY } from "@/lib/constants";
import JsonLd from "@/app/components/SEO/JsonLd";
import { buildContactJsonLd } from "@/lib/jsonld";

export const metadata = {
    title: "Contact IT Job Now",
    description: "Get in touch with the IT Job Now team for questions about our bootcamp, enrollment, or support.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage() {
    let content = null;
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
            content = await kv.get(KV_KEY);
        } catch (error) {
            console.error("KV error:", error);
        }
    }

    const finalContent = content || defaultContent;
    const jsonLd = buildContactJsonLd(finalContent);

    return (
        <>
            <JsonLd data={jsonLd} />
            <ContactUs content={finalContent} />
        </>
    );
}
