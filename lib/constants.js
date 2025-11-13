// Default content structure for the landing page
export const defaultContent = {
    header: {
        logo: {
            image: "/images/logo.png", // Path for public folder images (starts with /)
            text: "ITJobNow", // Fallback text if no image
            link: "/", // Logo link
        },
        menu: [
            {
                label: "Why us",
                link: "#whyUs",
            },
            {
                label: "Courses",
                link: "#courses",
            },
            {
                label: "Contact Us",
                link: "/contact",
            },
            {
                label: "FAQ's",
                link: "/faq",
            },
            // {
            //     label: "Admin",
            //     link: "/admin",
            //     className: "text-slate-500", // Optional styling
            // },
        ],
        button: {
            text: "Enroll Now",
            link: "/enroll",
            className: "bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors",
        },
    },
    hero: {
        title: "Launch Your Tech Career in 5 Weeks.",
        subtitle: "Add real content from /admin",
        ctaText: "Reserve Your Seat",
        ctaLink: "#",
        backgroundImage: "",
        backgroundVideo: "", // Video URL from Blob
        badge: "⚡ Limited seats for next cohort!",
    },
    programOverview: {
        title: "Program Overview",
        subtitle:
            "Our curriculum is meticulously crafted to provide you with the skills and support you need to thrive in the tech industry.",
        whatYouLearn: [
            "Full stack Development",
            "Agile Methodologies",
            "Version Control with Git",
            "Cloud Fundamental",
        ],
        benefits: [
            "Hands-on, project-Based",
            "Expert-Led Instruction",
            "Career Placement Support",
            "Small class sizes",
        ],
        outcomes: [
            "Job-Ready in 5 weeks",
            "Professionals Portfolio",
            "Industry Connections",
            "Certificate of completion",
        ],
        testimonials: [
            {
                name: "Marco",
                quote:
                    "Before this bootcamp, I had no IT background. After 5 weeks, I landed my first internship. Highly recommend!",
                image: "/images/person1.png",
            },
            {
                name: "John",
                quote:
                    "Very practical and easy to understand. The instructor was amazing and helped me build confidence.",
                image: "/images/person2.png",
            },
        ],
        youtube: {
            ctaUrl: "https://www.youtube.com/@yourchannel",
            embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
        instructor: {
            roleLabel: "Lead Instructor",
            name: "[Instructor Name]",
            bio: "10+ years in real IT support, on-call, and onsite troubleshooting. Hired and trained junior techs. Knows exactly what managers listen for in interviews — because they were that manager.",
            background: "Helpdesk lead, field technician, escalation engineer",
            focus: "Making beginners production-ready fast",
            teachingStyle:
                "No ego, no jargon. We demo, you do, we correct, you repeat until it's instinct.",
            image: "", // optional; if empty we show a placeholder
            tags: ["Hiring experience", "Real-world tickets", "Interview prep"],
        },
        courseDetails: {
            durationText: "5 week Intensive",
            scheduleText: "Full-Time:\nMon-Fri, 9am - 5pm",
            dates: ["October 28, 2025", "January 6, 2026"],
        },
        bootcampCycles: [
            {
                id: "current",
                title: "Current Bootcamp Cycle",
                recommended: true,
                price: "$220.00",
                priceLabel: "one-time",
                startDate: "March 15, 2025",
                endDate: "April 19, 2025",
                duration: "5-Week Intensive",
                ctaText: "Join current cycle",
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
                ctaText: "Reserve your seat",
            },
        ],
    },
    aboutSection: {},
    faq: {
        title: "Frequently Asked Questions",
        description:
            "Explore our FAQs to learn more about how we work, what we offer, and how we can help you.",
        heroHeading: "Questions and answers to things we’re often asked",
        heroDescription: "FAQs about NetSuite, ERP, and cloud technologies, and ourselves",
        initialOpenCount: 3,
        items: [
            {
                question: "Do I need prior IT knowledge?",
                answer: "No. The bootcamp is designed for complete beginners.",
            },
            {
                question: "Is this online or in-person?",
                answer: "It's fully in-person at our training center.",
            },
            {
                question: "What if I miss a class?",
                answer: "You can attend the makeup session in the next cycle.",
            },
            {
                question: "Will I get a certificate?",
                answer:
                    "Yes, upon successful completion of the bootcamp, you will receive a certificate of completion.",
            },
            {
                question: "Can I pay in installments?",
                answer:
                    "Yes, we offer flexible payment plans. Please contact us for more details.",
            },
        ],
    },
    sections: [],
    footer: {
        description:
            "ITJobNow is a 5-week training program that helps people learn IT skills and start their career in technology. Our goal is to help you gain the right skills and get ready for real IT jobs quickly.",
        legalLinks: [
            { label: "Terms & Conditions (Clients)", href: "#" },
            { label: "Terms & Conditions (ServiPros)", href: "#" },
            { label: "Privacy Policy", href: "#" },
        ],
        contact: {
            heading: "Contact Us",
            description: "Have questions or need help? We're here for you!",
            email: "support@itjobnow.com",
            location: "San Juan, Australia",
            href: "/contact",
        },
        bottomBar: {
            copyright: "© 2025 ITJobNow. All rights reserved",
            designCredit: "Designed with love for Australia.",
            language: "Spanish",
            currency: "USD",
        },
        socialLinks: [
            { platform: "facebook", url: "#" },
            { platform: "twitter", url: "#" },
            { platform: "instagram", url: "#" },
        ],
    },
    emailTemplates: {
        brand: {
            companyName: "IT Job Now",
            supportEmail: "support@itjobnow.com.au",
            fromEmail: "",
        },
        studentEnrollment: {
            subjectPrefix: "Enrolment confirmed – ",
            heroTitle: "Your enrolment is confirmed 🎉",
            heroSubtitlePrefix: "",
            heroSubtitleSuffix: "",
            greeting: "Hi",
            introLead: "Thanks for your payment. This email confirms your enrolment in ",
            introTrail: ".",
            paymentSummaryLead: "We’ve received",
            paymentSummaryMid: "on",
            paymentSummaryTrail: ".",
            summaryHeading: "Summary",
            summaryLabels: {
                bootcamp: "Bootcamp",
                studentEmail: "Student email",
                amount: "Amount",
                paymentMethod: "Payment method",
                stripeReference: "Stripe reference",
            },
            receiptText: "You can view or download your Stripe receipt here:",
            receiptCta: "View receipt",
            noReceiptText: "(We couldn’t attach a receipt link automatically for this payment yet.)",
            nextStepsHeading: "What’s next?",
            nextSteps: [
                "You’ll receive onboarding / access details shortly.",
                "Keep this email as your receipt.",
                "If something looks wrong, just reply to this email.",
            ],
            closingLine: "Cheers,",
            closingSignaturePrefix: "The ",
            closingSignatureSuffix: " Team",
            supportTextPrefix: "Need help? Contact us at ",
            footerPrefix: "© ",
            footerSuffix: ". All rights reserved.",
        },
        adminEnrollment: {
            subjectPrefix: "New enrolment:",
            title: "New enrolment received",
            intro: "A student just completed their payment. Details below:",
            summaryLabels: {
                studentName: "Student name",
                studentEmail: "Student email",
                bootcamp: "Bootcamp",
                amountPaid: "Amount paid",
                paidAt: "Paid at",
                stripeSession: "Stripe session",
                paymentMethod: "Payment method",
            },
            receiptLabel: "Receipt",
            receiptCta: "View Stripe receipt",
        },
    },
};

// Empty content structure (for admin page when creating new content)
export const emptyContent = {
    header: {
        logo: {
            image: "",
            text: "ITJobNow",
            link: "/",
        },
        menu: [
            {
                label: "",
                link: "",
            },
        ],
        button: {
            text: "",
            link: "",
            className: "",
        },
    },
    hero: {
        title: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "",
        backgroundImage: "",
        backgroundVideo: "",
        badge: "",
    },
    programOverview: {
        title: "",
        subtitle: "",
        whatYouLearn: [""],
        benefits: [""],
        outcomes: [""],
        testimonials: [
            {
                name: "",
                quote: "",
                image: "",
            },
        ],
        youtube: {
            ctaUrl: "",
            embedUrl: "",
        },
        instructor: {
            roleLabel: "Lead Instructor",
            name: "",
            bio: "",
            background: "",
            focus: "",
            teachingStyle: "",
            image: "",
            tags: ["", "", ""],
        },
        courseDetails: {
            durationText: "",
            scheduleText: "",
            dates: [""],
        },
        bootcampCycles: [
            {
                id: "current",
                title: "",
                recommended: false,
                price: "",
                priceLabel: "",
                startDate: "",
                endDate: "",
                duration: "",
                ctaText: "",
            },
        ],
    },
    faq: {
        title: "",
        description: "",
        heroHeading: "",
        heroDescription: "",
        initialOpenCount: 3,
        items: [
            {
                question: "",
                answer: "",
            },
        ],
    },
    aboutSection: {},
    sections: [],
    footer: {
        description: "",
        legalLinks: [{ label: "", href: "" }],
        contact: {
            heading: "",
            description: "",
            email: "",
            location: "",
            href: "",
        },
        bottomBar: {
            copyright: "",
            designCredit: "",
            language: "",
            currency: "",
        },
        socialLinks: [{ platform: "", url: "" }],
    },
    emailTemplates: {
        brand: {
            companyName: "",
            supportEmail: "",
            fromEmail: "",
        },
        studentEnrollment: {
            subjectPrefix: "",
            heroTitle: "",
            heroSubtitlePrefix: "",
            heroSubtitleSuffix: "",
            greeting: "",
            introLead: "",
            introTrail: "",
            paymentSummaryLead: "",
            paymentSummaryMid: "",
            paymentSummaryTrail: "",
            summaryHeading: "",
            summaryLabels: {
                bootcamp: "",
                studentEmail: "",
                amount: "",
                paymentMethod: "",
                stripeReference: "",
            },
            receiptText: "",
            receiptCta: "",
            noReceiptText: "",
            nextStepsHeading: "",
            nextSteps: [""],
            closingLine: "",
            closingSignaturePrefix: "",
            closingSignatureSuffix: "",
            supportTextPrefix: "",
            footerPrefix: "",
            footerSuffix: "",
        },
        adminEnrollment: {
            subjectPrefix: "",
            title: "",
            intro: "",
            summaryLabels: {
                studentName: "",
                studentEmail: "",
                bootcamp: "",
                amountPaid: "",
                paidAt: "",
                stripeSession: "",
                paymentMethod: "",
            },
            receiptLabel: "",
            receiptCta: "",
        },
    },
};

// KV storage key
export const KV_KEY = 'landing:content';

