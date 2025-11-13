import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import PaymentClient from "./PaymentClient";

const COURSE_NAME = "UI/UX Designer Professional";

// Bootcamp cycles data - should match the data in EnrollToCourse
const bootcampCycles = [
    {
        id: "current",
        title: "Current Bootcamp Cycle",
        recommended: true,
        price: "$220.00",
        priceLabel: "one-time",
        startDate: "March 15, 2025",
        endDate: "April 19, 2025",
        duration: "5-Week Intensive",
    },
    {
        id: "next",
        title: "Next Bootcamp Cycle",
        recommended: false,
        price: "$220.00",
        priceLabel: "one-time",
        startDate: "May 15, 2025",
        endDate: "June 19, 2025",
        duration: "5-Week Intensive",
    },
];

export default async function PaymentPage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const cycleId = resolvedSearchParams?.cycle || "current";

    const selectedCycleData =
        bootcampCycles.find((cycle) => cycle.id === cycleId) || bootcampCycles[0];

    return (
        <main className="min-h-screen">
            <Header />
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

                    <PaymentClient courseName={COURSE_NAME} selectedCycleData={selectedCycleData} />
                </div>
            </div>
            <Footer />
        </main>
    );
}
