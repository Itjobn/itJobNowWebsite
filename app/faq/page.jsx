"use client";

import { useEffect, useState } from "react";
import FAQSection from "@/app/components/ProgramSection/FAQ";
import { defaultContent } from "@/lib/constants";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";

export default function FaqPage() {
  const [faq, setFaq] = useState(defaultContent.faq);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/content");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = json?.data || json?.content || defaultContent;
        if (!ignore) setFaq(data.faq || defaultContent.faq);
      } catch {
        if (!ignore) setFaq(defaultContent.faq);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Keep same UX as on home by reusing FAQSection
  return (
    <main className="pt-20">
      <Header />
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(10, 31, 68, 0.85), rgba(10, 31, 68, 0.65)), url('/images/faq-hero.jpg')",
        }}
      >
        <div className="mx-auto flex min-h-[320px] w-full max-w-5xl flex-col items-center justify-center px-6 py-20 text-center text-white">
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            {faq?.heroHeading || defaultContent.faq.heroHeading}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-white/80 md:text-lg">
            {faq?.heroDescription || defaultContent.faq.heroDescription}
          </p>
        </div>
      </section>
      <FAQSection key={`${faq?.items?.length || 0}-${faq?.initialOpenCount || 0}`} faq={faq} />
      <Footer />
    </main>
  );
}

