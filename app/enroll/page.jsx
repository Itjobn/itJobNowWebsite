import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import EnrollToCourse from "@/app/Pages/EnrollToCourse/page";

export default function EnrollPage() {
    return (
        <main className="min-h-screen">
            <Header />
            <EnrollToCourse />
            <Footer />
        </main>
    );
}
