"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export default function EnrollToCourseClient({ bootcampCycles = [] }) {
  const router = useRouter();
  const cycles = useMemo(() => {
    if (!Array.isArray(bootcampCycles)) {
      return [];
    }
    return bootcampCycles
      .map((cycle) => ({
        id: cycle?.id ?? "",
        title: cycle?.title ?? "",
        recommended: !!cycle?.recommended,
        price: cycle?.price ?? "",
        priceLabel: cycle?.priceLabel ?? "",
        startDate: cycle?.startDate ?? "",
        endDate: cycle?.endDate ?? "",
        duration: cycle?.duration ?? "",
      }))
      .filter((cycle) => cycle.id || cycle.title);
  }, [bootcampCycles]);

  const [selectedCycle, setSelectedCycle] = useState(() => cycles[0]?.id || "");

  useEffect(() => {
    setSelectedCycle(cycles[0]?.id || "");
  }, [cycles]);

  const handleSelectCycle = (cycleId) => {
    if (!cycleId) return;
    setSelectedCycle(cycleId);
    router.push(`/payment?cycle=${cycleId}`);
  };

  return (
    <main className="min-h-screen">
      <div className="mt-20 py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-black font-switzer">
              Enroll In our IT Bootcamp
            </h1>
            <p className="text-lg text-gray-600">
              Choose your bootcamp cycle and get started today.
            </p>
          </div>

          {/* Bootcamp Cycle Cards */}
          {cycles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
              {cycles.map((cycle) => (
                <div
                  key={cycle.id || cycle.title}
                  className="relative bg-gray-100 rounded-lg p-6 md:p-8"
                >
                  {/* Recommended Badge */}
                  {cycle.recommended && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Recommended
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-black mb-4">
                    {cycle.title || "Bootcamp Cycle"}
                  </h3>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-black">
                      {cycle.price || "TBD"}
                    </span>
                    {cycle.priceLabel && (
                      <span className="text-black ml-2">{cycle.priceLabel}</span>
                    )}
                  </div>

                  {/* Selection Button */}
                  <button
                    onClick={() => handleSelectCycle(cycle.id)}
                    className={`w-full py-3 rounded-lg font-semibold mb-6 transition-colors ${
                      selectedCycle === cycle.id
                        ? "bg-primary text-white"
                        : "bg-gray-300 text-white border border-gray-400"
                    }`}
                  >
                    {selectedCycle === cycle.id ? "Selected" : "Select Cycle"}
                  </button>

                  {/* Details */}
                  <div className="space-y-3">
                    {(cycle.startDate || cycle.endDate || cycle.duration) ? (
                      <>
                        {cycle.startDate && (
                          <div className="flex items-center gap-3">
                            <IoIosCheckmarkCircleOutline
                              size={20}
                              color="#6B7280"
                              opacity={0.7}
                            />
                            <span className="text-gray-700">
                              Start Date: {cycle.startDate}
                            </span>
                          </div>
                        )}
                        {cycle.endDate && (
                          <div className="flex items-center gap-3">
                            <IoIosCheckmarkCircleOutline
                              size={20}
                              color="#6B7280"
                              opacity={0.7}
                            />
                            <span className="text-gray-700">
                              End Date: {cycle.endDate}
                            </span>
                          </div>
                        )}
                        {cycle.duration && (
                          <div className="flex items-center gap-3">
                            <IoIosCheckmarkCircleOutline
                              size={20}
                              color="#6B7280"
                              opacity={0.7}
                            />
                            <span className="text-gray-700">
                              {cycle.duration}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-600">
                        Check back soon for updated schedule details.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto mb-8 rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <h2 className="text-2xl font-semibold text-black mb-4">
                Bootcamp cycles coming soon
              </h2>
              <p className="text-gray-600">
                Our next cohort details are being finalized. Please check back
                shortly or contact us for more information.
              </p>
            </div>
          )}

          {/* Footer Text */}
          <div className="text-center">
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              One-time payment. Includes all course material and access to our
              learning platform.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

