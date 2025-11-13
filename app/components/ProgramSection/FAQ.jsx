"use client";
import Footer from "@/app/components/Footer/Footer";
import { useMemo, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { defaultContent } from "@/lib/constants";


export default function FAQSection({ faq }) {
    const fallbackFaq = defaultContent.faq;
    const faqContent = useMemo(() => {
        if (!faq) {
            return fallbackFaq;
        }
        const items = Array.isArray(faq.items) && faq.items.length > 0 ? faq.items : fallbackFaq.items;
        const initialOpenCount =
            typeof faq.initialOpenCount === "number" && faq.initialOpenCount >= 0
                ? faq.initialOpenCount
                : fallbackFaq.initialOpenCount;
        return {
            ...fallbackFaq,
            ...faq,
            items,
            initialOpenCount,
        };
    }, [faq, fallbackFaq]);

    const items = faqContent.items || [];
    const openCount = Math.max(0, Math.min(faqContent.initialOpenCount ?? 0, items.length));

    const [openIndices, setOpenIndices] = useState(() =>
        Array.from({ length: openCount }, (_, index) => index)
    );

    const toggleFAQ = (index) => {
        setOpenIndices((prev) => {
            const filtered = prev.filter((i) => i < items.length);
            return filtered.includes(index)
                ? filtered.filter((i) => i !== index)
                : [...filtered, index];
        });
    };

    return (
        <>

            <section className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-4 text-black font-switzer">
                            {faqContent.title || fallbackFaq.title}
                        </h2>
                        <p className="text-lg text-black/70  mx-auto">
                            {faqContent.description || fallbackFaq.description}
                        </p>
                    </div>

                    {/* FAQ Accordion Container */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                            {items.map((item, index) => {
                                const isOpen = openIndices.includes(index);
                                return (
                                    <div key={index}>
                                        {/* FAQ Item */}
                                        <button
                                            onClick={() => toggleFAQ(index)}
                                            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-lg md:text-xl font-bold text-black pr-4">
                                                {item.question}
                                            </span>
                                            <div className="shrink-0">
                                                <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-lg">
                                                    {isOpen ? (
                                                        <FaMinus className="text-white text-sm" />
                                                    ) : (
                                                        <FaPlus className="text-white text-sm" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>

                                        {/* Answer */}
                                        {isOpen && (
                                            <div className="px-6 pb-5">
                                                <p className="text-lg text-black/70">{item.answer}</p>
                                            </div>
                                        )}

                                        {/* Divider */}
                                        {index < items.length - 1 && (
                                            <div className="border-t border-gray-200"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}

