"use client";

import React, { useState } from "react";



export default function PaymentClient({ courseName, selectedCycleData }) {


    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [country, setCountry] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");

    // Pricing parsing kept in case of future use

    const handleNext = async (e) => {
        e.preventDefault();
        if (!fullName || !phone || !country || !email || !address || !city) {
            alert("Please fill all fields before continuing.");
            return;
        }

        // Redirect directly to the Stripe product link
        window.location.href = "https://book.stripe.com/test_eVq5kE4lP162elj3Yi9R600";
    };

    // For hosted Checkout, redirect occurs via session URL; keeping this for potential in-page flow.

    const formatShortDate = (dateString) => {
        const date = new Date(dateString);
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    };



    return (
        <div className="bg-white">
            <div className="max-w-4xl mx-auto">
                {/* Course Details Box */}
                <div className="bg-primary rounded-lg p-6 md:p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Left: Course Info */}
                        <div className="text-white">
                            <p className="text-sm mb-2 opacity-90">Course</p>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">{courseName}</h3>
                            <p className="text-sm mb-2 opacity-90">Course Cycle</p>
                            <p className="text-lg">
                                {selectedCycleData?.title} (
                                {formatShortDate(selectedCycleData?.startDate)} - {formatShortDate(selectedCycleData?.endDate)})
                            </p>
                        </div>

                        {/* Right: Payment Info */}
                        <div className="text-white flex flex-col justify-center">
                            <p className="text-sm mb-2 opacity-90">One-time Payment</p>
                            <p className="text-3xl md:text-4xl font-bold">{selectedCycleData?.price}</p>
                        </div>
                    </div>
                </div>

                {/* User Information Form */}
                <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 text-black">User Information:</h3>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleNext}>
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-black font-semibold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-black font-semibold mb-2">Phone number</label>
                                <input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-black font-semibold mb-2">Country</label>
                                <input
                                    type="text"
                                    placeholder="Enter country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-black font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-black font-semibold mb-2">Address</label>
                                <input
                                    type="text"
                                    placeholder="Enter Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-black font-semibold mb-2">City</label>
                                <input
                                    type="text"
                                    placeholder="Enter City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 text-center">
                            <button className="w-full bg-primary text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


