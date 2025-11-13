import { defaultContent } from "./constants";

const FALLBACK_SITE_URL = "https://itjobnow.com.au";

function getSiteUrl() {
    const raw =
        typeof process !== "undefined" &&
        process.env &&
        process.env.NEXT_PUBLIC_SITE_URL;

    const normalized = (raw || FALLBACK_SITE_URL).trim();
    return normalized.replace(/\/+$/, "");
}

function toAbsoluteUrl(path) {
    if (!path) return undefined;
    if (/^https?:\/\//i.test(path)) return path;

    const base = getSiteUrl();
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalizedPath}`;
}

function toIsoDate(value) {
    if (!value) return undefined;
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
        return undefined;
    }
    return new Date(parsed).toISOString().split("T")[0];
}

function parsePrice(price) {
    if (!price) return undefined;
    const numeric = `${price}`.replace(/[^\d.,]/g, "").replace(/,/g, "");
    return numeric || undefined;
}

function clean(value) {
    if (Array.isArray(value)) {
        const items = value
            .map((item) => clean(item))
            .filter((item) => {
                if (item === undefined || item === null) return false;
                if (typeof item === "string") return item.trim().length > 0;
                if (Array.isArray(item)) return item.length > 0;
                if (typeof item === "object") return Object.keys(item).length > 0;
                return true;
            });
        return items.length > 0 ? items : undefined;
    }

    if (typeof value === "object" && value !== null) {
        const entries = Object.entries(value).reduce((acc, [key, val]) => {
            const cleaned = clean(val);
            if (
                cleaned !== undefined &&
                cleaned !== null &&
                (typeof cleaned !== "string" || cleaned.trim().length > 0)
            ) {
                acc[key] = cleaned;
            }
            return acc;
        }, {});

        return Object.keys(entries).length > 0 ? entries : undefined;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }

    return value;
}

function extractBrand(content) {
    const brand =
        content?.emailTemplates?.brand || defaultContent.emailTemplates.brand;

    return {
        name:
            brand?.companyName?.trim() ||
            defaultContent.emailTemplates.brand.companyName,
        email:
            brand?.supportEmail?.trim() ||
            defaultContent.emailTemplates.brand.supportEmail,
    };
}

function extractContact(content) {
    const contact =
        content?.footer?.contact || defaultContent.footer.contact || {};
    return {
        email: contact.email || extractBrand(content).email,
        telephone: contact.phone || undefined,
        areaServed: contact.location || defaultContent.footer.contact.location,
        contactType: "customer support",
        url: toAbsoluteUrl(contact.href || "/contact"),
    };
}

function buildOrganization(content) {
    const brand = extractBrand(content);
    const social =
        content?.footer?.socialLinks || defaultContent.footer.socialLinks;

    return clean({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: brand.name,
        url: getSiteUrl(),
        logo: toAbsoluteUrl(
            content?.header?.logo?.image || defaultContent.header.logo.image
        ),
        email: brand.email,
        contactPoint: [clean({ "@type": "ContactPoint", ...extractContact(content) })],
        sameAs: clean(
            (Array.isArray(social) ? social : [])
                .map((item) => item?.url)
                .filter(Boolean)
                .map((url) => toAbsoluteUrl(url))
        ),
    });
}

function buildCourse(content) {
    const program = content?.programOverview || defaultContent.programOverview;
    const hero = content?.hero || defaultContent.hero;
    const organization = buildOrganization(content);

    const courseInstances = clean(
        (Array.isArray(program.bootcampCycles) ? program.bootcampCycles : []).map(
            (cycle) => {
                const price = parsePrice(cycle?.price);
                const offer = clean({
                    "@type": "Offer",
                    priceCurrency: "AUD",
                    price,
                    availabilityStarts: toIsoDate(cycle?.startDate),
                    url: toAbsoluteUrl("/enroll"),
                });

                return clean({
                    "@type": "CourseInstance",
                    name: cycle?.title,
                    startDate: toIsoDate(cycle?.startDate),
                    endDate: toIsoDate(cycle?.endDate),
                    courseMode: cycle?.duration,
                    offers: offer,
                });
            }
        )
    );

    return clean({
        "@context": "https://schema.org",
        "@type": "Course",
        name: hero?.title || program?.title,
        description: program?.subtitle,
        provider: organization
            ? {
                "@type": "Organization",
                name: organization.name,
                sameAs: organization.sameAs,
                url: organization.url,
            }
            : undefined,
        educationalCredentialAwarded:
            program?.outcomes?.includes("Certificate of completion")
                ? "Certificate of completion"
                : undefined,
        hasCourseInstance: courseInstances,
    });
}

function buildBreadcrumbList(items) {
    if (!Array.isArray(items) || items.length === 0) return undefined;
    return clean({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) =>
            clean({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: toAbsoluteUrl(item.item),
            })
        ),
    });
}

export function buildHomeJsonLd(content) {
    const organization = buildOrganization(content);
    const course = buildCourse(content);
    const hero = content?.hero || defaultContent.hero;

    const website = clean({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: hero?.title || organization?.name,
        url: getSiteUrl(),
        description:
            hero?.subtitle ||
            content?.programOverview?.subtitle ||
            defaultContent.programOverview.subtitle,
        inLanguage: "en-AU",
        publisher: organization
            ? {
                "@type": "Organization",
                name: organization.name,
                url: organization.url,
            }
            : undefined,
    });

    return clean([website, organization, course]);
}

export function buildContactJsonLd(content) {
    const brand = extractBrand(content);
    const contact = extractContact(content);

    const contactPage = clean({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact IT Job Now",
        url: toAbsoluteUrl("/contact"),
        description:
            content?.footer?.contact?.description ||
            defaultContent.footer.contact.description,
        inLanguage: "en-AU",
        breadcrumb: buildBreadcrumbList([
            { name: "Home", item: "/" },
            { name: "Contact", item: "/contact" },
        ]),
        mainEntity: clean({
            "@type": "Organization",
            name: brand.name,
            email: contact.email,
            contactPoint: [clean({ "@type": "ContactPoint", ...contact })],
        }),
    });

    return contactPage;
}

export function buildEnrollJsonLd(content, bootcampCycles) {
    const course = buildCourse({
        ...content,
        programOverview: {
            ...(content?.programOverview || defaultContent.programOverview),
            bootcampCycles:
                bootcampCycles ||
                content?.programOverview?.bootcampCycles ||
                defaultContent.programOverview.bootcampCycles,
        },
    });

    const enrollPage = clean({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Enroll in IT Job Now Bootcamp",
        url: toAbsoluteUrl("/enroll"),
        description:
            content?.programOverview?.subtitle ||
            defaultContent.programOverview.subtitle,
        breadcrumb: buildBreadcrumbList([
            { name: "Home", item: "/" },
            { name: "Enroll", item: "/enroll" },
        ]),
        mainEntity: course,
    });

    return enrollPage;
}

export function buildFaqJsonLd(content) {
    const faq =
        content?.faq && content.faq.items
            ? content.faq
            : defaultContent.faq;

    const mainEntity = clean(
        (faq.items || defaultContent.faq.items).map((item) =>
            clean({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: clean({
                    "@type": "Answer",
                    text: item.answer,
                }),
            })
        )
    );

    const faqPage = clean({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        name: faq.title || defaultContent.faq.title,
        url: toAbsoluteUrl("/faq"),
        description: faq.description || defaultContent.faq.description,
        breadcrumb: buildBreadcrumbList([
            { name: "Home", item: "/" },
            { name: "FAQ", item: "/faq" },
        ]),
        mainEntity,
    });

    return faqPage;
}

export function buildPaymentJsonLd(content, selectedCycle) {
    const program = content?.programOverview || defaultContent.programOverview;
    const offerCycle = selectedCycle;

    const price = parsePrice(offerCycle?.price);

    const offer = clean({
        "@type": "Offer",
        priceCurrency: "AUD",
        price,
        availabilityStarts: toIsoDate(offerCycle?.startDate),
        url: toAbsoluteUrl(`/payment?cycle=${offerCycle?.id || ""}`),
    });

    const paymentPage = clean({
        "@context": "https://schema.org",
        "@type": "CheckoutPage",
        name: "Secure Bootcamp Payment",
        url: toAbsoluteUrl("/payment"),
        description:
            "Complete your IT Job Now bootcamp enrollment payment securely.",
        breadcrumb: buildBreadcrumbList([
            { name: "Home", item: "/" },
            { name: "Enroll", item: "/enroll" },
            { name: "Payment", item: "/payment" },
        ]),
        mainEntity: clean({
            "@type": "Course",
            name: program.title || "IT Job Now Bootcamp",
            offers: offer,
        }),
    });

    return paymentPage;
}

export function buildAdminJsonLd() {
    return clean({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Admin Content Manager",
        url: toAbsoluteUrl("/admin"),
        description:
            "Admin dashboard for managing IT Job Now website content.",
    });
}


