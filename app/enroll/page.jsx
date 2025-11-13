import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import EnrollToCourse from "@/app/Pages/EnrollToCourse/page";

export const metadata = {
    title: "Enroll in IT Job Now Bootcamp",
    description: "Reserve your seat in the upcoming IT Job Now bootcamp cohort and secure your place in our 5-week intensive program.",
};

export default function EnrollPage() {
    return (
        <main className="min-h-screen">
            <Header />
            <EnrollToCourse />
            <Footer />
        </main>
    );
}
