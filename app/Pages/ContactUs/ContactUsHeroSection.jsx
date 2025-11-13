"use client";

import { useState } from "react";
import Input from "@/app/components/ProgramSection/Input";

export default function ContactUsHeroSection({ backgroundImage, backgroundVideo }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        subject: "",
        description: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        setSubmitSuccess("");

        // Basic client-side validation
        if (!formData.fullName || !formData.email || !formData.subject || !formData.description) {
            setSubmitError("Please fill in Full Name, Email, Subject, and Description.");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || "Failed to send message");
            }
            setSubmitSuccess("Your message has been sent. We'll get back to you soon!");
            setFormData({
                fullName: "",
                email: "",
                phoneNumber: "",
                subject: "",
                description: "",
            });
        } catch (err) {
            setSubmitError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative flex items-center justify-center overflow-hidden mt-20 py-16 md:py-16">
            {/* Background Video/Image */}
            <div className="absolute top-0 left-0 inset-0">
                {backgroundVideo ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={backgroundVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : backgroundImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={backgroundImage}
                        alt="Contact background"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40" />
                )}
            </div>

            <div className="absolute left-0 top-0 inset-0 bg-black/50" />



            {/* Form Content */}
            <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 md:px-6 py-8">
                    {/* Form Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black font-switzer">
                            Get In Touch With Us
                        </h2>
                        <p className="text-lg text-black/70">
                            Have questions? We&apos;re here to help you before, during, and after your bootcamp journey.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Feedback messages */}
                        {submitSuccess ? (
                            <div className="mb-4 rounded-lg bg-green-100 text-green-800 px-4 py-3">
                                {submitSuccess}
                            </div>
                        ) : null}
                        {submitError ? (
                            <div className="mb-4 rounded-lg bg-red-100 text-red-800 px-4 py-3">
                                {submitError}
                            </div>
                        ) : null}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div>
                                <Input
                                    label="Full Name"
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Enter phone number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Right Column */}
                            <div>
                                <Input
                                    label="Email"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    label="Subject"
                                    type="text"
                                    name="subject"
                                    placeholder="General Inquiry"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Description - Full Width */}
                        <div className="mt-6">
                            <Input
                                label="Description"
                                type="textarea"
                                name="description"
                                placeholder="Write here."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Submit Button - Full Width */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"}`}
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

