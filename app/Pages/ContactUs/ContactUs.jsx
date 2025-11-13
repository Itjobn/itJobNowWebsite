import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import FAQSection from "@/app/components/ProgramSection/FAQ";
import { defaultContent } from "@/lib/constants";
import ContactUsHeroSection from "./ContactUsHeroSection";

export default function ContactUs({ content }) {
    const finalContent = content || defaultContent;
    const hero = finalContent.hero || defaultContent.hero;
    const { backgroundImage, backgroundVideo } = hero || {};

    return (
        <main className="min-h-screen">
            <Header content={finalContent} />
            <ContactUsHeroSection
                backgroundImage={backgroundImage}
                backgroundVideo={backgroundVideo}
            />
            <FAQSection faq={finalContent.faq} />
            <Footer content={finalContent} />
        </main>
    );
}
