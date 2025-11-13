import { kv } from "@vercel/kv";
import FAQSection from "@/app/components/ProgramSection/FAQ";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import JsonLd from "@/app/components/SEO/JsonLd";
import { buildFaqJsonLd } from "@/lib/jsonld";
import { defaultContent, KV_KEY } from "@/lib/constants";

export const metadata = {
  title: "IT Job Now Bootcamp FAQ",
  description: "Find answers to common questions about IT Job Now’s 5-week bootcamp, schedule, pricing, and outcomes.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FaqPage() {
  let content = null;
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      content = await kv.get(KV_KEY);
    } catch (error) {
      console.error("KV error:", error);
    }
  }

  const finalContent = content || defaultContent;
  const faqContent = finalContent?.faq || defaultContent.faq;
  const jsonLd = buildFaqJsonLd(finalContent);

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="pt-20">
        <Header content={finalContent} />
        <section
          className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(10, 31, 68, 0.85), rgba(10, 31, 68, 0.65)), url('/images/faq-hero.jpg')",
          }}
        >
          <div className="mx-auto flex min-h-[320px] w-full max-w-5xl flex-col items-center justify-center px-6 py-20 text-center text-white">
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              {faqContent?.heroHeading || defaultContent.faq.heroHeading}
            </h1>
            <p className="mt-4 max-w-3xl text-base text-white/80 md:text-lg">
              {faqContent?.heroDescription || defaultContent.faq.heroDescription}
            </p>
          </div>
        </section>
        <FAQSection
          key={`${faqContent?.items?.length || 0}-${faqContent?.initialOpenCount || 0}`}
          faq={faqContent}
        />
        <Footer content={finalContent} />
      </main>
    </>
  );
}

