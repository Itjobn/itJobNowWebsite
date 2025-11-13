"use client";

import { useState } from "react";
import Input from "./Input";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        subject: "",
        description: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: null, message: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: "" });

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok || data.success !== true) {
                throw new Error(
                    data?.error || "We couldn't send your message. Please try again."
                );
            }

            setStatus({
                type: "success",
                message:
                    "Thanks for reaching out! Your message has been sent and we'll get back to you soon.",
            });

            setFormData({
                fullName: "",
                email: "",
                phoneNumber: "",
                subject: "",
                description: "",
            });
        } catch (error) {
            setStatus({
                type: "error",
                message:
                    error?.message ||
                    "Something went wrong while sending your message. Please try again later.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-16 px-4 bg-[#F6F9FC]">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl mx-auto">
                    {/* Form Card */}
                    <div className="bg-white rounded-lg shadow-sm p-8 md:p-10">
                        {/* Form Header */}
                        <h2 className="text-3xl md:text-[40px] font-bold text-center mb-10 text-black font-switzer">
                            Have Questions? Send us a Message
                        </h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
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
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
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

                            <Input
                                label="Subject"
                                type="text"
                                name="subject"
                                placeholder="How can we help?"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Description"
                                type="textarea"
                                name="description"
                                placeholder="Write here."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>

                            {status.message && (
                                <p
                                    className={`mt-4 text-center text-sm ${status.type === "success"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {status.message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

