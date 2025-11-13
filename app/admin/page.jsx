"use client";

import { useEffect, useState } from "react";
import { defaultContent } from "@/lib/constants";

const ADMIN_TABS = [
  { id: "header", label: "Header & Nav" },
  { id: "hero", label: "Hero Section" },
  { id: "programOverview", label: "Program Overview" },
  { id: "faq", label: "FAQ" },
  { id: "footer", label: "Footer" },
  { id: "emails", label: "Email Templates" },
];

function normalizeContent(data) {
  const incoming = data || {};
  const headerData = incoming.header || {};
  const heroData = incoming.hero || {};
  const programOverviewData = incoming.programOverview || {};
  const faqData = incoming.faq || {};
  const defaultFaq = defaultContent.faq || {};
  const footerData = incoming.footer || {};
  const emailTemplatesData = incoming.emailTemplates || {};

  const defaultBootcampCycles = Array.isArray(defaultContent.programOverview?.bootcampCycles)
    ? defaultContent.programOverview.bootcampCycles
    : [];
  const defaultFooter = defaultContent.footer || {};
  const defaultEmailTemplates = defaultContent.emailTemplates || {};

  const mergedHeader = {
    ...defaultContent.header,
    ...headerData,
    logo: {
      ...defaultContent.header.logo,
      ...headerData.logo,
    },
    button: {
      ...defaultContent.header.button,
      ...headerData.button,
    },
    menu: Array.isArray(headerData.menu) ? headerData.menu : defaultContent.header.menu,
  };

  const mergedHero = {
    ...defaultContent.hero,
    ...heroData,
  };

  const mergedProgramOverview = {
    ...defaultContent.programOverview,
    ...programOverviewData,
    title: programOverviewData.title ?? defaultContent.programOverview.title,
    subtitle: programOverviewData.subtitle ?? defaultContent.programOverview.subtitle,
    youtube: {
      ...defaultContent.programOverview.youtube,
      ...(programOverviewData.youtube || {}),
      ctaUrl: programOverviewData.youtube?.ctaUrl ?? defaultContent.programOverview.youtube.ctaUrl,
      embedUrl: programOverviewData.youtube?.embedUrl ?? defaultContent.programOverview.youtube.embedUrl,
    },
    whatYouLearn: Array.isArray(programOverviewData.whatYouLearn) && programOverviewData.whatYouLearn.length > 0
      ? programOverviewData.whatYouLearn
      : defaultContent.programOverview.whatYouLearn,
    benefits: Array.isArray(programOverviewData.benefits) && programOverviewData.benefits.length > 0
      ? programOverviewData.benefits
      : defaultContent.programOverview.benefits,
    outcomes: Array.isArray(programOverviewData.outcomes) && programOverviewData.outcomes.length > 0
      ? programOverviewData.outcomes
      : defaultContent.programOverview.outcomes,
    testimonials: Array.isArray(programOverviewData.testimonials) && programOverviewData.testimonials.length > 0
      ? programOverviewData.testimonials.map((t) => ({
        name: t?.name ?? "",
        quote: t?.quote ?? "",
        image: t?.image ?? "",
      }))
      : defaultContent.programOverview.testimonials,
    youtube: {
      ...defaultContent.programOverview.youtube,
      ...(programOverviewData.youtube || {}),
      ctaUrl: programOverviewData.youtube?.ctaUrl ?? defaultContent.programOverview.youtube.ctaUrl,
      embedUrl: programOverviewData.youtube?.embedUrl ?? defaultContent.programOverview.youtube.embedUrl,
    },
    instructor: {
      ...defaultContent.programOverview.instructor,
      ...(programOverviewData.instructor || {}),
      roleLabel: programOverviewData.instructor?.roleLabel ?? defaultContent.programOverview.instructor.roleLabel,
      name: programOverviewData.instructor?.name ?? defaultContent.programOverview.instructor.name,
      bio: programOverviewData.instructor?.bio ?? defaultContent.programOverview.instructor.bio,
      background: programOverviewData.instructor?.background ?? defaultContent.programOverview.instructor.background,
      focus: programOverviewData.instructor?.focus ?? defaultContent.programOverview.instructor.focus,
      teachingStyle: programOverviewData.instructor?.teachingStyle ?? defaultContent.programOverview.instructor.teachingStyle,
      image: programOverviewData.instructor?.image ?? defaultContent.programOverview.instructor.image,
      tags: Array.isArray(programOverviewData.instructor?.tags) && programOverviewData.instructor.tags.length > 0
        ? programOverviewData.instructor.tags
        : defaultContent.programOverview.instructor.tags,
    },
    courseDetails: {
      ...defaultContent.programOverview.courseDetails,
      ...(programOverviewData.courseDetails || {}),
      durationText: programOverviewData.courseDetails?.durationText ?? defaultContent.programOverview.courseDetails.durationText,
      scheduleText: programOverviewData.courseDetails?.scheduleText ?? defaultContent.programOverview.courseDetails.scheduleText,
      dates: Array.isArray(programOverviewData.courseDetails?.dates) && programOverviewData.courseDetails.dates.length > 0
        ? programOverviewData.courseDetails.dates
        : defaultContent.programOverview.courseDetails.dates,
    },
    bootcampCycles: Array.isArray(programOverviewData.bootcampCycles) && programOverviewData.bootcampCycles.length > 0
      ? programOverviewData.bootcampCycles.map((c, index) => {
        const fallbackCycle = defaultBootcampCycles[index] || {};
        return {
          id: c?.id ?? fallbackCycle.id ?? "",
          title: c?.title ?? fallbackCycle.title ?? "",
          recommended: c?.recommended ?? fallbackCycle.recommended ?? false,
          price: c?.price ?? fallbackCycle.price ?? "",
          priceLabel: c?.priceLabel ?? fallbackCycle.priceLabel ?? "",
          startDate: c?.startDate ?? fallbackCycle.startDate ?? "",
          endDate: c?.endDate ?? fallbackCycle.endDate ?? "",
          duration: c?.duration ?? fallbackCycle.duration ?? "",
          ctaText: c?.ctaText ?? fallbackCycle.ctaText ?? "",
        };
      })
      : defaultContent.programOverview.bootcampCycles,
  };

  const fallbackFaq = defaultContent.faq;
  const faqItems =
    Array.isArray(faqData.items) && faqData.items.length > 0
      ? faqData.items.map((item) => ({
        question: item?.question ?? "",
        answer: item?.answer ?? "",
      }))
      : fallbackFaq.items;

  const openCountRaw =
    typeof faqData.initialOpenCount === "number"
      ? faqData.initialOpenCount
      : fallbackFaq.initialOpenCount;

  const normalizedFaq = {
    ...fallbackFaq,
    ...faqData,
    heroHeading: faqData.heroHeading ?? defaultFaq.heroHeading ?? "",
    heroDescription: faqData.heroDescription ?? defaultFaq.heroDescription ?? "",
    items: faqItems,
    initialOpenCount: Math.min(Math.max(0, openCountRaw), faqItems.length),
  };

  const mergedFooter = {
    ...defaultFooter,
    ...footerData,
    description: footerData.description ?? defaultFooter.description ?? "",
    legalLinks:
      Array.isArray(footerData.legalLinks) && footerData.legalLinks.length > 0
        ? footerData.legalLinks.map((link) => ({
          label: link?.label ?? "",
          href: link?.href ?? "",
        }))
        : defaultFooter.legalLinks || [],
    contact: {
      ...(defaultFooter.contact || {}),
      ...(footerData.contact || {}),
      heading: footerData.contact?.heading ?? defaultFooter.contact?.heading ?? "",
      description: footerData.contact?.description ?? defaultFooter.contact?.description ?? "",
      email: footerData.contact?.email ?? defaultFooter.contact?.email ?? "",
      location: footerData.contact?.location ?? defaultFooter.contact?.location ?? "",
      href: footerData.contact?.href ?? defaultFooter.contact?.href ?? "",
    },
    bottomBar: {
      ...(defaultFooter.bottomBar || {}),
      ...(footerData.bottomBar || {}),
      copyright: footerData.bottomBar?.copyright ?? defaultFooter.bottomBar?.copyright ?? "",
      designCredit: footerData.bottomBar?.designCredit ?? defaultFooter.bottomBar?.designCredit ?? "",
      language: footerData.bottomBar?.language ?? defaultFooter.bottomBar?.language ?? "",
      currency: footerData.bottomBar?.currency ?? defaultFooter.bottomBar?.currency ?? "",
    },
    socialLinks:
      Array.isArray(footerData.socialLinks) && footerData.socialLinks.length > 0
        ? footerData.socialLinks.map((link) => ({
          platform: link?.platform ?? "",
          url: link?.url ?? "",
        }))
        : defaultFooter.socialLinks || [],
  };

  const studentEmailTemplateData = emailTemplatesData.studentEnrollment || {};
  const defaultStudentEmailTemplate = defaultEmailTemplates.studentEnrollment || {};
  const adminEmailTemplateData = emailTemplatesData.adminEnrollment || {};
  const defaultAdminEmailTemplate = defaultEmailTemplates.adminEnrollment || {};

  const mergedEmailTemplates = {
    ...defaultEmailTemplates,
    ...emailTemplatesData,
    brand: {
      ...defaultEmailTemplates.brand,
      ...(emailTemplatesData.brand || {}),
    },
    studentEnrollment: {
      ...defaultStudentEmailTemplate,
      ...studentEmailTemplateData,
      summaryLabels: {
        ...defaultStudentEmailTemplate.summaryLabels,
        ...(studentEmailTemplateData.summaryLabels || {}),
      },
      nextSteps: Array.isArray(studentEmailTemplateData.nextSteps)
        ? studentEmailTemplateData.nextSteps
        : defaultStudentEmailTemplate.nextSteps || [],
    },
    adminEnrollment: {
      ...defaultAdminEmailTemplate,
      ...adminEmailTemplateData,
      summaryLabels: {
        ...defaultAdminEmailTemplate.summaryLabels,
        ...(adminEmailTemplateData.summaryLabels || {}),
      },
    },
  };

  return {
    ...defaultContent,
    ...incoming,
    header: mergedHeader,
    hero: mergedHero,
    programOverview: mergedProgramOverview,
    faq: normalizedFaq,
    footer: mergedFooter,
    emailTemplates: mergedEmailTemplates,
  };
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordLoaded, setPasswordLoaded] = useState(false);
  const [content, setContent] = useState(null);
  const [initialContent, setInitialContent] = useState(null);
  const [status, setStatus] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("header");

  // fetch current content
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/content");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const response = await res.json();
        if (response.data) {
          const normalized = normalizeContent(response.data);
          setContent(normalized);
          setInitialContent(normalized);
        } else if (response.content) {
          // Fallback for old format
          const normalized = normalizeContent(response.content);
          setContent(normalized);
          setInitialContent(normalized);
        } else {
          // default to site defaults so preview matches home (shows logo, etc.)
          const normalized = normalizeContent(defaultContent);
          setContent(normalized);
          setInitialContent(normalized);
        }
      } catch (error) {
        console.error("Error loading content:", error);
        // default to site defaults on error as well
        const normalized = normalizeContent(defaultContent);
        setContent(normalized);
        setInitialContent(normalized);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedPassword = window.localStorage.getItem("adminPassword");
    if (storedPassword) {
      setPassword(storedPassword);
      setPasswordInput(storedPassword);
      setIsAuthenticated(true);
    }
    setPasswordLoaded(true);
  }, []);

  const isDirty = JSON.stringify(content) !== JSON.stringify(initialContent);

  function handlePasswordSubmit(event) {
    event.preventDefault();
    const trimmed = passwordInput.trim();
    if (!trimmed) {
      setStatus("❌ Please enter the admin password");
      return;
    }
    setPassword(trimmed);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("adminPassword", trimmed);
    }
    setIsAuthenticated(true);
    setStatus("Admin access granted ✅");
  }

  function handlePasswordLogout() {
    setPassword("");
    setPasswordInput("");
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("adminPassword");
    }
    setStatus("You have been logged out");
  }

  async function handleLogoUpload(file) {
    if (!file) return;

    if (!password) {
      setStatus("❌ Please enter the admin password first before uploading files");
      return;
    }

    setUploadingLogo(true);
    setStatus("Uploading logo...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const oldLogoUrl = content.header?.logo?.image || "";
      if (oldLogoUrl && oldLogoUrl.startsWith("https://")) {
        formData.append("oldUrl", oldLogoUrl);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-edit-password": password,
        },
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        setStatus(`Upload failed ❌ Server error (HTTP ${res.status}). Check console for details.`);
        setUploadingLogo(false);
        return;
      }

      if (res.ok) {
        setContent((prev) => ({
          ...prev,
          header: {
            ...prev.header,
            logo: { ...prev.header?.logo, image: data.url },
          },
        }));
        setStatus("Logo uploaded ✅ (old logo replaced)");
      } else {
        setStatus(`Upload failed ❌ ${data.error || `HTTP ${res.status}: ${res.statusText}`}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus(`Upload failed ❌ ${error.message || "Network error. Check console for details."}`);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleUpload(file, type) {
    if (!file) return;

    // Check password before uploading
    if (!password) {
      setStatus("❌ Please enter the admin password first before uploading files");
      return;
    }

    const uploadState = type === "image" ? setUploadingImage : setUploadingVideo;
    uploadState(true);
    setStatus(`Uploading ${type}...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Get old URLs to delete from Blob when replacing
      const oldImageUrl = content.hero?.backgroundImage || "";
      const oldVideoUrl = content.hero?.backgroundVideo || "";

      // When uploading image, delete old image AND old video (only one background allowed)
      // When uploading video, delete old video AND old image (only one background allowed)
      if (type === "image") {
        // Delete old image if exists
        if (oldImageUrl && oldImageUrl.startsWith("https://")) {
          formData.append("oldUrl", oldImageUrl);
        }
        // Also delete old video since we're replacing with image
        if (oldVideoUrl && oldVideoUrl.startsWith("https://")) {
          formData.append("oldUrl", oldVideoUrl);
        }
      } else {
        // Delete old video if exists
        if (oldVideoUrl && oldVideoUrl.startsWith("https://")) {
          formData.append("oldUrl", oldVideoUrl);
        }
        // Also delete old image since we're replacing with video
        if (oldImageUrl && oldImageUrl.startsWith("https://")) {
          formData.append("oldUrl", oldImageUrl);
        }
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-edit-password": password,
        },
        body: formData,
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        // Response is HTML (error page), get text to see what happened
        const text = await res.text();
        console.error("Non-JSON response:", text);
        setStatus(`Upload failed ❌ Server error (HTTP ${res.status}). Check console for details.`);
        uploadState(false);
        return;
      }

      if (res.ok) {
        if (type === "image") {
          // Set new image and clear video (only one background at a time)
          setContent((prev) => ({
            ...prev,
            hero: {
              ...prev.hero,
              backgroundImage: data.url,
              backgroundVideo: "", // Clear video when image is uploaded
            },
          }));
          setStatus("Image uploaded ✅ (old background replaced)");
        } else {
          // Set new video and clear image (only one background at a time)
          setContent((prev) => ({
            ...prev,
            hero: {
              ...prev.hero,
              backgroundVideo: data.url,
              backgroundImage: "", // Clear image when video is uploaded
            },
          }));
          setStatus("Video uploaded ✅ (old background replaced)");
        }
      } else {
        setStatus(`Upload failed ❌ ${data.error || `HTTP ${res.status}: ${res.statusText}`}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus(`Upload failed ❌ ${error.message || "Network error. Check console for details."}`);
    } finally {
      uploadState(false);
    }
  }

  async function handleSave() {
    if (!content) return;
    if (!password) {
      setStatus("Failed ❌ Please enter the admin password");
      return;
    }
    setSaving(true);
    setStatus("Saving...");
    try {
      const res = await fetch("/api/content/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-edit-password": password,
        },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Saved ✅");
        setInitialContent(content);
      } else {
        // Show specific error message from API
        const errorMsg = data.error || `HTTP ${res.status}: Check password or data format`;
        setStatus(`Failed ❌ ${errorMsg}`);
      }
    } catch (error) {
      setStatus(`Failed ❌ ${error.message || "Network error. Make sure your dev server is running."}`);
    } finally {
      setSaving(false);
    }
  }

  const updateEmailBrand = (field, value) => {
    setContent((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        brand: {
          ...(prev.emailTemplates?.brand || {}),
          [field]: value,
        },
      },
    }));
  };

  const updateStudentEmailTemplate = (field, value) => {
    setContent((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        studentEnrollment: {
          ...(prev.emailTemplates?.studentEnrollment || {}),
          [field]: value,
        },
      },
    }));
  };

  const updateStudentSummaryLabel = (field, value) => {
    setContent((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        studentEnrollment: {
          ...(prev.emailTemplates?.studentEnrollment || {}),
          summaryLabels: {
            ...(prev.emailTemplates?.studentEnrollment?.summaryLabels || {}),
            [field]: value,
          },
        },
      },
    }));
  };

  const updateStudentNextSteps = (updater) => {
    setContent((prev) => {
      const current = Array.isArray(prev.emailTemplates?.studentEnrollment?.nextSteps)
        ? [...prev.emailTemplates.studentEnrollment.nextSteps]
        : [];
      const next = updater(current);
      return {
        ...prev,
        emailTemplates: {
          ...prev.emailTemplates,
          studentEnrollment: {
            ...(prev.emailTemplates?.studentEnrollment || {}),
            nextSteps: next,
          },
        },
      };
    });
  };

  const updateAdminEmailTemplate = (field, value) => {
    setContent((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        adminEnrollment: {
          ...(prev.emailTemplates?.adminEnrollment || {}),
          [field]: value,
        },
      },
    }));
  };

  const updateAdminSummaryLabel = (field, value) => {
    setContent((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        adminEnrollment: {
          ...(prev.emailTemplates?.adminEnrollment || {}),
          summaryLabels: {
            ...(prev.emailTemplates?.adminEnrollment?.summaryLabels || {}),
            [field]: value,
          },
        },
      },
    }));
  };


  if (!content) {
    return <div className="p-6">Loading...</div>;
  }

  if (!passwordLoaded) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">Loading access...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Restricted Access</p>
              <h1 className="text-2xl font-semibold text-slate-900">Enter Admin Password</h1>
              <p className="text-sm text-slate-500">
                Provide the admin password to access the content manager.
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="admin-password">
                  Admin Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={passwordInput}
                  onChange={(event) => setPasswordInput(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="CONTENT_EDIT_PASSWORD"
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Unlock Admin
              </button>
            </form>
            {status ? <p className="text-sm text-slate-500">{status}</p> : null}
          </div>
        </div>
      </div>
    );
  }

  const emailBrand = content.emailTemplates?.brand || {};
  const studentEmailTemplate = content.emailTemplates?.studentEnrollment || {};
  const studentSummaryLabels = studentEmailTemplate.summaryLabels || {};
  const studentNextSteps = Array.isArray(studentEmailTemplate.nextSteps)
    ? studentEmailTemplate.nextSteps
    : [];
  const adminEmailTemplate = content.emailTemplates?.adminEnrollment || {};
  const adminSummaryLabels = adminEmailTemplate.summaryLabels || {};

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 text-slate-200 md:fixed md:inset-y-0 md:flex">
        <div className="px-6 py-5 text-lg font-semibold text-white">Admin Console</div>
        <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-1">
          {ADMIN_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${isActive
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex w-full flex-col md:ml-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Content Manager
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">Bootcamp Landing Admin</h1>
              <p className="text-sm text-slate-500">
                Use the tabs to edit each section. Changes save to Vercel KV.
              </p>
              <div className="mt-4 flex items-center gap-2 md:hidden">
                <label className="text-xs font-medium text-slate-500" htmlFor="section-select">
                  Section
                </label>
                <select
                  id="section-select"
                  value={activeTab}
                  onChange={(event) => setActiveTab(event.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {ADMIN_TABS.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              {status && <span className="text-sm text-slate-500">{status}</span>}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={!isDirty || saving}
                  className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${!isDirty || saving
                    ? "cursor-not-allowed bg-slate-200 text-slate-500"
                    : "bg-primary text-white hover:bg-primary/90"
                    }`}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={handlePasswordLogout}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:text-slate-700"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl p-6 space-y-6">
            {/* Header Section */}
            {activeTab === "header" && (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Header Section</h2>

                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    {/* Logo Image */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Logo Image</label>
                      <div className="space-y-2">
                        {/* File Upload Section */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Logo Image from Local
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="logo-upload"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const maxSize = 10 * 1024 * 1024; // 10MB
                                  if (file.size > maxSize) {
                                    setStatus(`File too large ❌ Maximum size: 10MB. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                                    return;
                                  }
                                  handleLogoUpload(file);
                                }
                              }}
                              disabled={uploadingLogo}
                            />
                            <label
                              htmlFor="logo-upload"
                              className={`inline-block px-4 py-2 rounded-md text-sm font-semibold cursor-pointer ${uploadingLogo
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary/90"
                                } transition-colors`}
                            >
                              {uploadingLogo ? "Uploading..." : "Choose Logo Image"}
                            </label>
                            {uploadingLogo && (
                              <span className="text-sm text-primary">⏳ Uploading...</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Supported formats: JPEG, PNG, WebP, GIF (Max: 10MB)
                          </p>
                        </div>

                        {/* Or Manual URL Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Or Paste Logo Image URL
                          </label>
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={content.header?.logo?.image || ""}
                            onChange={(e) =>
                              setContent((prev) => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  logo: { ...prev.header?.logo, image: e.target.value },
                                },
                              }))
                            }
                            placeholder="/images/logo.png or https://example.com/logo.png"
                          />
                        </div>

                        {/* Current Logo Display */}
                        {content.header?.logo?.image && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-medium text-gray-700 mb-1">Current Logo:</p>
                            <p className="text-xs text-gray-600 break-all mb-2">{content.header.logo.image}</p>
                            <img
                              src={content.header.logo.image}
                              alt="Logo Preview"
                              className="max-w-xs max-h-32 rounded border object-contain"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Logo Text (Fallback) */}
                    <div>
                      <label className="block text-sm font-medium">Logo Text (Fallback)</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.header?.logo?.text || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              logo: { ...prev.header?.logo, text: e.target.value },
                            },
                          }))
                        }
                        placeholder="ITJobNow"
                      />
                    </div>

                    {/* Logo Link */}
                    <div>
                      <label className="block text-sm font-medium">Logo Link</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.header?.logo?.link || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              logo: { ...prev.header?.logo, link: e.target.value },
                            },
                          }))
                        }
                        placeholder="/"
                      />
                    </div>

                    {/* Menu Items */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Navigation Menu</label>
                      <div className="space-y-3">
                        {(content.header?.menu || []).map((item, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="text"
                              className="border rounded px-3 py-2 flex-1 text-sm"
                              placeholder="Menu Label"
                              value={item.label || ""}
                              onChange={(e) => {
                                const newMenu = [...(content.header?.menu || [])];
                                newMenu[index] = { ...newMenu[index], label: e.target.value };
                                setContent((prev) => ({
                                  ...prev,
                                  header: { ...prev.header, menu: newMenu },
                                }));
                              }}
                            />
                            <input
                              type="text"
                              className="border rounded px-3 py-2 flex-1 text-sm"
                              placeholder="Menu Link"
                              value={item.link || ""}
                              onChange={(e) => {
                                const newMenu = [...(content.header?.menu || [])];
                                newMenu[index] = { ...newMenu[index], link: e.target.value };
                                setContent((prev) => ({
                                  ...prev,
                                  header: { ...prev.header, menu: newMenu },
                                }));
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newMenu = (content.header?.menu || []).filter((_, i) => i !== index);
                                setContent((prev) => ({
                                  ...prev,
                                  header: { ...prev.header, menu: newMenu },
                                }));
                              }}
                              className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newMenu = [...(content.header?.menu || []), { label: "", link: "" }];
                            setContent((prev) => ({
                              ...prev,
                              header: { ...prev.header, menu: newMenu },
                            }));
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          + Add Menu Item
                        </button>
                      </div>
                    </div>

                    {/* Header Button */}
                    <div>
                      <label className="block text-sm font-medium">Button Text</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.header?.button?.text || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              button: { ...prev.header?.button, text: e.target.value },
                            },
                          }))
                        }
                        placeholder="Enroll Now"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Button Link</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.header?.button?.link || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              button: { ...prev.header?.button, link: e.target.value },
                            },
                          }))
                        }
                        placeholder="#enroll"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hero Section */}
            {activeTab === "hero" && (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Hero Section</h2>

                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Hero Title</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.hero?.title || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, title: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Hero Subtitle</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.hero?.subtitle || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, subtitle: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">CTA Text</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.hero?.ctaText || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, ctaText: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">CTA Link</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.hero?.ctaLink || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, ctaLink: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium">Badge</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.hero?.badge || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, badge: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Background Image</label>
                      <div className="space-y-2">
                        {/* File Upload Section */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Image from Local
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="image-upload"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const maxSize = 10 * 1024 * 1024; // 10MB
                                  if (file.size > maxSize) {
                                    setStatus(
                                      `File too large ❌ Maximum size: 10MB. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
                                    );
                                    return;
                                  }
                                  handleUpload(file, "image");
                                }
                              }}
                              disabled={uploadingImage}
                            />
                            <label
                              htmlFor="image-upload"
                              className={`inline-block px-4 py-2 rounded-md text-sm font-semibold cursor-pointer ${uploadingImage
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary/90"
                                } transition-colors`}
                            >
                              {uploadingImage ? "Uploading..." : "Choose Image File"}
                            </label>
                            {uploadingImage && (
                              <span className="text-sm text-primary">⏳ Uploading...</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Supported formats: JPEG, PNG, WebP, GIF (Max: 10MB)
                          </p>
                        </div>

                        {/* Or Manual URL Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Or Paste Image URL
                          </label>
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={content.hero?.backgroundImage || ""}
                            onChange={(e) =>
                              setContent((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, backgroundImage: e.target.value },
                              }))
                            }
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>

                        {/* Current Image Display */}
                        {content.hero?.backgroundImage && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-medium text-gray-700 mb-1">Current Image:</p>
                            <p className="text-xs text-gray-600 break-all mb-2">
                              {content.hero.backgroundImage}
                            </p>
                            <img
                              src={content.hero.backgroundImage}
                              alt="Preview"
                              className="max-w-xs max-h-32 rounded border object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        )}

                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Background Video</label>
                      <div className="space-y-2">
                        {/* File Upload Section */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Video from Local (Recommended)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="video/*"
                              id="video-upload"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const maxSize = 50 * 1024 * 1024; // 50MB
                                  if (file.size > maxSize) {
                                    setStatus(
                                      `File too large ❌ Maximum size: 50MB. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
                                    );
                                    return;
                                  }
                                  handleUpload(file, "video");
                                }
                              }}
                              disabled={uploadingVideo}
                            />
                            <label
                              htmlFor="video-upload"
                              className={`inline-block px-4 py-2 rounded-md text-sm font-semibold cursor-pointer ${uploadingVideo
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary/90"
                                } transition-colors`}
                            >
                              {uploadingVideo ? "Uploading..." : "Choose Video File"}
                            </label>
                            {uploadingVideo && (
                              <span className="text-sm text-primary">⏳ Uploading...</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Supported formats: MP4, WebM, OGG, QuickTime (Max: 50MB)
                          </p>
                        </div>

                        {/* Or Manual URL Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Or Paste Video URL
                          </label>
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={content.hero?.backgroundVideo || ""}
                            onChange={(e) =>
                              setContent((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, backgroundVideo: e.target.value },
                              }))
                            }
                            placeholder="https://example.com/video.mp4"
                          />
                        </div>

                        {/* Current Video Display */}
                        {content.hero?.backgroundVideo && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-medium text-gray-700 mb-1">Current Video:</p>
                            <p className="text-xs text-gray-600 break-all">{content.hero.backgroundVideo}</p>
                            {content.hero.backgroundVideo.match(/\.(mp4|webm|ogg|mov)$/i) && (
                              <video
                                src={content.hero.backgroundVideo}
                                controls
                                className="mt-2 w-full max-w-md rounded border"
                                style={{ maxHeight: "200px" }}
                              >
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "programOverview" && (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Program Overview</h2>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Title</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.programOverview?.title || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: { ...prev.programOverview, title: e.target.value },
                          }))
                        }
                        placeholder="Program Overview"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium">Subtitle</label>
                      <textarea
                        className="border rounded px-3 py-2 w-full text-sm min-h-[80px]"
                        value={content.programOverview?.subtitle || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: { ...prev.programOverview, subtitle: e.target.value },
                          }))
                        }
                        placeholder="Our curriculum is meticulously crafted..."
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Key Takeaways</h3>
                  <p className="text-sm text-slate-500">
                    Manage the three list-based sections that appear in the program overview.
                  </p>
                  <div className="mt-6 grid gap-6 md:grid-cols-3">
                    {/* What You Learn */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">What You Learn</h4>
                      {(content.programOverview?.whatYouLearn || []).map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={item}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.whatYouLearn)
                                  ? [...prev.programOverview.whatYouLearn]
                                  : [];
                                next[index] = e.target.value;
                                return {
                                  ...prev,
                                  programOverview: { ...prev.programOverview, whatYouLearn: next },
                                };
                              })
                            }
                            placeholder="List item"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setContent((prev) => {
                                const current = Array.isArray(prev.programOverview?.whatYouLearn)
                                  ? [...prev.programOverview.whatYouLearn]
                                  : [];
                                const next = current.filter((_, i) => i !== index);
                                return {
                                  ...prev,
                                  programOverview: { ...prev.programOverview, whatYouLearn: next },
                                };
                              })
                            }
                            className="px-2 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setContent((prev) => {
                            const current = Array.isArray(prev.programOverview?.whatYouLearn)
                              ? [...prev.programOverview.whatYouLearn]
                              : [];
                            return {
                              ...prev,
                              programOverview: {
                                ...prev.programOverview,
                                whatYouLearn: [...current, ""],
                              },
                            };
                          })
                        }
                        className="px-3 py-2 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      >
                        + Add Item
                      </button>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Benefits</h4>
                      {(content.programOverview?.benefits || []).map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={item}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.benefits)
                                  ? [...prev.programOverview.benefits]
                                  : [];
                                next[index] = e.target.value;
                                return {
                                  ...prev,
                                  programOverview: { ...prev.programOverview, benefits: next },
                                };
                              })
                            }
                            placeholder="List item"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setContent((prev) => {
                                const current = Array.isArray(prev.programOverview?.benefits)
                                  ? [...prev.programOverview.benefits]
                                  : [];
                                const next = current.filter((_, i) => i !== index);
                                return {
                                  ...prev,
                                  programOverview: { ...prev.programOverview, benefits: next },
                                };
                              })
                            }
                            className="px-2 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setContent((prev) => {
                            const current = Array.isArray(prev.programOverview?.benefits)
                              ? [...prev.programOverview.benefits]
                              : [];
                            return {
                              ...prev,
                              programOverview: {
                                ...prev.programOverview,
                                benefits: [...current, ""],
                              },
                            };
                          })
                        }
                        className="px-3 py-2 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      >
                        + Add Item
                      </button>
                    </div>

                    {/* Outcomes */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Outcomes</h4>
                      {(content.programOverview?.outcomes || []).map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={item}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.outcomes)
                                  ? [...prev.programOverview.outcomes]
                                  : [];
                                next[index] = e.target.value;
                                return {
                                  ...prev,
                                  programOverview: { ...prev.programOverview, outcomes: next },
                                };
                              })
                            }
                            placeholder="List item"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setContent((prev) => {
                                const current = Array.isArray(prev.programOverview?.outcomes)
                                  ? [...prev.programOverview.outcomes]
                                  : [];
                                const next = current.filter((_, i) => i !== index);
                                return {
                                  ...prev,
                                  programOverview: { ...prev.programOverview, outcomes: next },
                                };
                              })
                            }
                            className="px-2 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setContent((prev) => {
                            const current = Array.isArray(prev.programOverview?.outcomes)
                              ? [...prev.programOverview.outcomes]
                              : [];
                            return {
                              ...prev,
                              programOverview: {
                                ...prev.programOverview,
                                outcomes: [...current, ""],
                              },
                            };
                          })
                        }
                        className="px-3 py-2 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Testimonials</h3>
                      <p className="text-sm text-slate-500">
                        Showcase success stories from alumni or current students.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => {
                          const current = Array.isArray(prev.programOverview?.testimonials)
                            ? [...prev.programOverview.testimonials]
                            : [];
                          return {
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              testimonials: [
                                ...current,
                                { name: "", quote: "", image: "" },
                              ],
                            },
                          };
                        })
                      }
                      className="inline-flex items-center justify-center rounded-md bg-green-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
                    >
                      + Add Testimonial
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {(content.programOverview?.testimonials || []).map((t, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-3 bg-gray-50">
                        <div className="grid gap-2 md:grid-cols-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                            <input
                              className="border rounded px-3 py-2 w-full text-sm"
                              value={t?.name || ""}
                              onChange={(e) =>
                                setContent((prev) => {
                                  const next = Array.isArray(prev.programOverview?.testimonials)
                                    ? [...prev.programOverview.testimonials]
                                    : [];
                                  next[index] = { ...next[index], name: e.target.value };
                                  return {
                                    ...prev,
                                    programOverview: { ...prev.programOverview, testimonials: next },
                                  };
                                })
                              }
                              placeholder="Person's name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Quote</label>
                            <input
                              className="border rounded px-3 py-2 w-full text-sm"
                              value={t?.quote || ""}
                              onChange={(e) =>
                                setContent((prev) => {
                                  const next = Array.isArray(prev.programOverview?.testimonials)
                                    ? [...prev.programOverview.testimonials]
                                    : [];
                                  next[index] = { ...next[index], quote: e.target.value };
                                  return {
                                    ...prev,
                                    programOverview: { ...prev.programOverview, testimonials: next },
                                  };
                                })
                              }
                              placeholder="Short testimonial"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={t?.image || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.testimonials)
                                  ? [...prev.programOverview.testimonials]
                                  : [];
                                next[index] = { ...next[index], image: e.target.value };
                                return {
                                  ...prev,
                                  programOverview: { ...prev.programOverview, testimonials: next },
                                };
                              })
                            }
                            placeholder="/images/person.png or https://..."
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setContent((prev) => {
                                const current = Array.isArray(prev.programOverview?.testimonials)
                                  ? [...prev.programOverview.testimonials]
                                  : [];
                                const next = current.filter((_, i) => i !== index);
                                return {
                                  ...prev,
                                  programOverview: { ...prev.programOverview, testimonials: next },
                                };
                              })
                            }
                            className="px-2 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">YouTube CTA & Embed</h3>
                  <p className="text-sm text-slate-500">
                    Control the channel CTA link and the embedded video shown on the site.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium">CTA URL (channel or video)</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        placeholder="https://www.youtube.com/@yourchannel"
                        value={content.programOverview?.youtube?.ctaUrl || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              youtube: { ...prev.programOverview?.youtube, ctaUrl: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Embed URL</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                        value={content.programOverview?.youtube?.embedUrl || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              youtube: { ...prev.programOverview?.youtube, embedUrl: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Instructor Profile</h3>
                  <p className="text-sm text-slate-500">
                    Update the instructor bio, photo, and supporting tags.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium">Role Label</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.programOverview?.instructor?.roleLabel || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              instructor: { ...prev.programOverview?.instructor, roleLabel: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.programOverview?.instructor?.name || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              instructor: { ...prev.programOverview?.instructor, name: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium">Bio</label>
                      <textarea
                        className="border rounded px-3 py-2 w-full min-h-[80px] text-sm"
                        value={content.programOverview?.instructor?.bio || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              instructor: { ...prev.programOverview?.instructor, bio: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Background</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.programOverview?.instructor?.background || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              instructor: { ...prev.programOverview?.instructor, background: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Focus</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.programOverview?.instructor?.focus || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              instructor: { ...prev.programOverview?.instructor, focus: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium">Teaching Style</label>
                      <textarea
                        className="border rounded px-3 py-2 w-full min-h-[80px] text-sm"
                        value={content.programOverview?.instructor?.teachingStyle || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              instructor: { ...prev.programOverview?.instructor, teachingStyle: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Instructor Image</label>
                      <div className="space-y-2">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Image from Local
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="instructor-image-upload"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (!password) {
                                  setStatus("❌ Please enter the admin password first before uploading files");
                                  return;
                                }
                                try {
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  const oldUrl = content.programOverview?.instructor?.image || "";
                                  if (oldUrl && oldUrl.startsWith("https://")) {
                                    formData.append("oldUrl", oldUrl);
                                  }
                                  const res = await fetch("/api/upload", {
                                    method: "POST",
                                    headers: { "x-edit-password": password },
                                    body: formData,
                                  });
                                  const data = await res.json();
                                  if (res.ok && data?.url) {
                                    setContent((prev) => ({
                                      ...prev,
                                      programOverview: {
                                        ...prev.programOverview,
                                        instructor: { ...prev.programOverview?.instructor, image: data.url },
                                      },
                                    }));
                                    setStatus("Instructor image uploaded ✅");
                                  } else {
                                    setStatus(`Upload failed ❌ ${data?.error || "Unknown error"}`);
                                  }
                                } catch (err) {
                                  setStatus(`Upload failed ❌ ${err?.message || "Network error"}`);
                                }
                              }}
                            />
                            <label
                              htmlFor="instructor-image-upload"
                              className="inline-block px-4 py-2 rounded-md text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                            >
                              Choose Image
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Or Paste Image URL
                          </label>
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={content.programOverview?.instructor?.image || ""}
                            onChange={(e) =>
                              setContent((prev) => ({
                                ...prev,
                                programOverview: {
                                  ...prev.programOverview,
                                  instructor: { ...prev.programOverview?.instructor, image: e.target.value },
                                },
                              }))
                            }
                            placeholder="/images/person.png or https://..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium">Tags</label>
                      <div className="space-y-2">
                        {(content.programOverview?.instructor?.tags || []).map((tag, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input
                              className="border rounded px-3 py-2 w-full text-sm"
                              value={tag}
                              onChange={(e) =>
                                setContent((prev) => {
                                  const next = Array.isArray(prev.programOverview?.instructor?.tags)
                                    ? [...prev.programOverview.instructor.tags]
                                    : [];
                                  next[i] = e.target.value;
                                  return {
                                    ...prev,
                                    programOverview: {
                                      ...prev.programOverview,
                                      instructor: { ...prev.programOverview?.instructor, tags: next },
                                    },
                                  };
                                })
                              }
                              placeholder="Tag"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setContent((prev) => {
                                  const current = Array.isArray(prev.programOverview?.instructor?.tags)
                                    ? [...prev.programOverview.instructor.tags]
                                    : [];
                                  const next = current.filter((_, idx) => idx !== i);
                                  return {
                                    ...prev,
                                    programOverview: {
                                      ...prev.programOverview,
                                      instructor: { ...prev.programOverview?.instructor, tags: next },
                                    },
                                  };
                                })
                              }
                              className="px-2 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            setContent((prev) => {
                              const current = Array.isArray(prev.programOverview?.instructor?.tags)
                                ? [...prev.programOverview.instructor.tags]
                                : [];
                              return {
                                ...prev,
                                programOverview: {
                                  ...prev.programOverview,
                                  instructor: { ...prev.programOverview?.instructor, tags: [...current, ""] },
                                },
                              };
                            })
                          }
                          className="px-3 py-2 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                        >
                          + Add Tag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Course Details</h3>
                  <p className="text-sm text-slate-500">
                    Configure the duration, schedule, and upcoming date ranges.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium">Duration Text</label>
                      <input
                        className="border rounded px-3 py-2 w-full"
                        value={content.programOverview?.courseDetails?.durationText || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              courseDetails: { ...prev.programOverview?.courseDetails, durationText: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium">Schedule Text</label>
                      <textarea
                        className="border rounded px-3 py-2 w-full min-h-[80px] text-sm"
                        value={content.programOverview?.courseDetails?.scheduleText || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              courseDetails: { ...prev.programOverview?.courseDetails, scheduleText: e.target.value },
                            },
                          }))
                        }
                        placeholder={"Full-Time:\nMon-Fri, 9am - 5pm"}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium">Dates</label>
                      <div className="space-y-2">
                        {(content.programOverview?.courseDetails?.dates || []).map((d, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input
                              className="border rounded px-3 py-2 w-full text-sm"
                              value={d}
                              onChange={(e) =>
                                setContent((prev) => {
                                  const next = Array.isArray(prev.programOverview?.courseDetails?.dates)
                                    ? [...prev.programOverview.courseDetails.dates]
                                    : [];
                                  next[i] = e.target.value;
                                  return {
                                    ...prev,
                                    programOverview: {
                                      ...prev.programOverview,
                                      courseDetails: { ...prev.programOverview?.courseDetails, dates: next },
                                    },
                                  };
                                })
                              }
                              placeholder="e.g. October 28, 2025"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setContent((prev) => {
                                  const current = Array.isArray(prev.programOverview?.courseDetails?.dates)
                                    ? [...prev.programOverview.courseDetails.dates]
                                    : [];
                                  const next = current.filter((_, idx) => idx !== i);
                                  return {
                                    ...prev,
                                    programOverview: {
                                      ...prev.programOverview,
                                      courseDetails: { ...prev.programOverview?.courseDetails, dates: next },
                                    },
                                  };
                                })
                              }
                              className="px-2 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            setContent((prev) => {
                              const current = Array.isArray(prev.programOverview?.courseDetails?.dates)
                                ? [...prev.programOverview.courseDetails.dates]
                                : [];
                              return {
                                ...prev,
                                programOverview: {
                                  ...prev.programOverview,
                                  courseDetails: { ...prev.programOverview?.courseDetails, dates: [...current, ""] },
                                },
                              };
                            })
                          }
                          className="px-3 py-2 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                        >
                          + Add Date
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Bootcamp Cycles</h3>
                      <p className="text-sm text-slate-500">
                        Configure pricing, dates, and call-to-action text for each cycle.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => {
                          const current = Array.isArray(prev.programOverview?.bootcampCycles)
                            ? [...prev.programOverview.bootcampCycles]
                            : [];
                          return {
                            ...prev,
                            programOverview: {
                              ...prev.programOverview,
                              bootcampCycles: [
                                ...current,
                                {
                                  id: "",
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
                          };
                        })
                      }
                      className="inline-flex items-center justify-center rounded-md bg-green-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
                    >
                      + Add Bootcamp Cycle
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {(content.programOverview?.bootcampCycles || []).map((c, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-3 bg-gray-50">
                        <div className="grid gap-2 md:grid-cols-3">
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            placeholder="ID (e.g. current)"
                            value={c?.id || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.bootcampCycles)
                                  ? [...prev.programOverview.bootcampCycles]
                                  : [];
                                next[index] = { ...next[index], id: e.target.value };
                                return { ...prev, programOverview: { ...prev.programOverview, bootcampCycles: next } };
                              })
                            }
                          />
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            placeholder="Title"
                            value={c?.title || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.bootcampCycles)
                                  ? [...prev.programOverview.bootcampCycles]
                                  : [];
                                next[index] = { ...next[index], title: e.target.value };
                                return { ...prev, programOverview: { ...prev.programOverview, bootcampCycles: next } };
                              })
                            }
                          />
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={!!c?.recommended}
                              onChange={(e) =>
                                setContent((prev) => {
                                  const next = Array.isArray(prev.programOverview?.bootcampCycles)
                                    ? [...prev.programOverview.bootcampCycles]
                                    : [];
                                  next[index] = { ...next[index], recommended: e.target.checked };
                                  return { ...prev, programOverview: { ...prev.programOverview, bootcampCycles: next } };
                                })
                              }
                            />
                            Recommended
                          </label>
                        </div>
                        <div className="grid gap-2 md:grid-cols-3">
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            placeholder="Price (e.g. $220.00)"
                            value={c?.price || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.bootcampCycles)
                                  ? [...prev.programOverview.bootcampCycles]
                                  : [];
                                next[index] = { ...next[index], price: e.target.value };
                                return { ...prev, programOverview: { ...prev.programOverview, bootcampCycles: next } };
                              })
                            }
                          />
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            placeholder="Price Label (e.g. one-time)"
                            value={c?.priceLabel || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.bootcampCycles)
                                  ? [...prev.programOverview.bootcampCycles]
                                  : [];
                                next[index] = { ...next[index], priceLabel: e.target.value };
                                return { ...prev, programOverview: { ...prev.programOverview, bootcampCycles: next } };
                              })
                            }
                          />
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            placeholder="Duration (e.g. 5-Week Intensive)"
                            value={c?.duration || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.bootcampCycles)
                                  ? [...prev.programOverview.bootcampCycles]
                                  : [];
                                next[index] = { ...next[index], duration: e.target.value };
                                return { ...prev, programOverview: { ...prev.programOverview, bootcampCycles: next } };
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">CTA Button Text</label>
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            placeholder="Join current cycle"
                            value={c?.ctaText || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.bootcampCycles)
                                  ? [...prev.programOverview.bootcampCycles]
                                  : [];
                                next[index] = { ...next[index], ctaText: e.target.value };
                                return { ...prev, programOverview: { ...prev.programOverview, bootcampCycles: next } };
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2 md:grid-cols-2">
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            placeholder="Start Date"
                            value={c?.startDate || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.bootcampCycles)
                                  ? [...prev.programOverview.bootcampCycles]
                                  : [];
                                next[index] = { ...next[index], startDate: e.target.value };
                                return { ...prev, programOverview: { ...prev.programOverview, bootcampCycles: next } };
                              })
                            }
                          />
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            placeholder="End Date"
                            value={c?.endDate || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const next = Array.isArray(prev.programOverview?.bootcampCycles)
                                  ? [...prev.programOverview.bootcampCycles]
                                  : [];
                                next[index] = { ...next[index], endDate: e.target.value };
                                return { ...prev, programOverview: { ...prev.programOverview, bootcampCycles: next } };
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setContent((prev) => {
                                const current = Array.isArray(prev.programOverview?.bootcampCycles)
                                  ? [...prev.programOverview.bootcampCycles]
                                  : [];
                                const next = current.filter((_, i) => i !== index);
                                return { ...prev, programOverview: { ...prev.programOverview, bootcampCycles: next } };
                              })
                            }
                            className="px-2 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Section */}
            {activeTab === "footer" && (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Footer Overview</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Update the footer description that appears beside the logo.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Description</label>
                      <textarea
                        className="border rounded px-3 py-2 w-full min-h-[100px] text-sm"
                        value={content.footer?.description || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: { ...prev.footer, description: e.target.value },
                          }))
                        }
                        placeholder="Brief description about the bootcamp or company"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Legal Links</h3>
                      <p className="text-sm text-slate-500">
                        Control the labels and URLs for the legal section.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => {
                          const current = Array.isArray(prev.footer?.legalLinks)
                            ? [...prev.footer.legalLinks]
                            : [];
                          return {
                            ...prev,
                            footer: {
                              ...prev.footer,
                              legalLinks: [...current, { label: "", href: "" }],
                            },
                          };
                        })
                      }
                      className="inline-flex items-center justify-center rounded-md bg-green-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
                    >
                      + Add Legal Link
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {(content.footer?.legalLinks || []).map((link, index) => (
                      <div key={index} className="grid gap-3 md:grid-cols-12">
                        <div className="md:col-span-5">
                          <label className="block text-xs font-medium text-slate-600">Label</label>
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={link?.label || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const current = Array.isArray(prev.footer?.legalLinks)
                                  ? [...prev.footer.legalLinks]
                                  : [];
                                current[index] = { ...current[index], label: e.target.value };
                                return {
                                  ...prev,
                                  footer: { ...prev.footer, legalLinks: current },
                                };
                              })
                            }
                            placeholder="Terms & Conditions"
                          />
                        </div>
                        <div className="md:col-span-5">
                          <label className="block text-xs font-medium text-slate-600">URL</label>
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={link?.href || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const current = Array.isArray(prev.footer?.legalLinks)
                                  ? [...prev.footer.legalLinks]
                                  : [];
                                current[index] = { ...current[index], href: e.target.value };
                                return {
                                  ...prev,
                                  footer: { ...prev.footer, legalLinks: current },
                                };
                              })
                            }
                            placeholder="https://example.com"
                          />
                        </div>
                        <div className="md:col-span-2 flex items-end">
                          <button
                            type="button"
                            onClick={() =>
                              setContent((prev) => {
                                const current = Array.isArray(prev.footer?.legalLinks)
                                  ? [...prev.footer.legalLinks]
                                  : [];
                                const next = current.filter((_, i) => i !== index);
                                return {
                                  ...prev,
                                  footer: { ...prev.footer, legalLinks: next },
                                };
                              })
                            }
                            className="w-full rounded bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Contact Section</h3>
                  <p className="text-sm text-slate-500">Customize the contact block in the footer.</p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Heading</label>
                      <input
                        className="border rounded px-3 py-2 w-full text-sm"
                        value={content.footer?.contact?.heading || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              contact: {
                                ...prev.footer?.contact,
                                heading: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="Contact Us"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Link URL</label>
                      <input
                        className="border rounded px-3 py-2 w-full text-sm"
                        value={content.footer?.contact?.href || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              contact: {
                                ...prev.footer?.contact,
                                href: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="/contact"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Email</label>
                      <input
                        className="border rounded px-3 py-2 w-full text-sm"
                        value={content.footer?.contact?.email || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              contact: {
                                ...prev.footer?.contact,
                                email: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="support@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Location</label>
                      <input
                        className="border rounded px-3 py-2 w-full text-sm"
                        value={content.footer?.contact?.location || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              contact: {
                                ...prev.footer?.contact,
                                location: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Description</label>
                      <textarea
                        className="border rounded px-3 py-2 w-full min-h-[80px] text-sm"
                        value={content.footer?.contact?.description || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              contact: {
                                ...prev.footer?.contact,
                                description: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="Support message or availability"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Bottom Bar Details</h3>
                  <p className="text-sm text-slate-500">
                    Set the texts used in the footer bottom bar.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Copyright Text</label>
                      <input
                        className="border rounded px-3 py-2 w-full text-sm"
                        value={content.footer?.bottomBar?.copyright || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              bottomBar: {
                                ...prev.footer?.bottomBar,
                                copyright: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="© 2025 Company. All rights reserved."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Design Credit</label>
                      <input
                        className="border rounded px-3 py-2 w-full text-sm"
                        value={content.footer?.bottomBar?.designCredit || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              bottomBar: {
                                ...prev.footer?.bottomBar,
                                designCredit: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="Designed with love for ..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Language Label</label>
                      <input
                        className="border rounded px-3 py-2 w-full text-sm"
                        value={content.footer?.bottomBar?.language || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              bottomBar: {
                                ...prev.footer?.bottomBar,
                                language: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="English"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Currency Label</label>
                      <input
                        className="border rounded px-3 py-2 w-full text-sm"
                        value={content.footer?.bottomBar?.currency || ""}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              bottomBar: {
                                ...prev.footer?.bottomBar,
                                currency: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="USD"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Social Links</h3>
                      <p className="text-sm text-slate-500">
                        Provide platform names (facebook, twitter, instagram, etc.) and URLs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => {
                          const current = Array.isArray(prev.footer?.socialLinks)
                            ? [...prev.footer.socialLinks]
                            : [];
                          return {
                            ...prev,
                            footer: {
                              ...prev.footer,
                              socialLinks: [...current, { platform: "", url: "" }],
                            },
                          };
                        })
                      }
                      className="inline-flex items-center justify-center rounded-md bg-green-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
                    >
                      + Add Social Link
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {(content.footer?.socialLinks || []).map((link, index) => (
                      <div key={index} className="grid gap-3 md:grid-cols-12">
                        <div className="md:col-span-4">
                          <label className="block text-xs font-medium text-slate-600">Platform</label>
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={link?.platform || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const current = Array.isArray(prev.footer?.socialLinks)
                                  ? [...prev.footer.socialLinks]
                                  : [];
                                current[index] = { ...current[index], platform: e.target.value };
                                return {
                                  ...prev,
                                  footer: { ...prev.footer, socialLinks: current },
                                };
                              })
                            }
                            placeholder="facebook"
                          />
                        </div>
                        <div className="md:col-span-6">
                          <label className="block text-xs font-medium text-slate-600">URL</label>
                          <input
                            className="border rounded px-3 py-2 w-full text-sm"
                            value={link?.url || ""}
                            onChange={(e) =>
                              setContent((prev) => {
                                const current = Array.isArray(prev.footer?.socialLinks)
                                  ? [...prev.footer.socialLinks]
                                  : [];
                                current[index] = { ...current[index], url: e.target.value };
                                return {
                                  ...prev,
                                  footer: { ...prev.footer, socialLinks: current },
                                };
                              })
                            }
                            placeholder="https://facebook.com/yourpage"
                          />
                        </div>
                        <div className="md:col-span-2 flex items-end">
                          <button
                            type="button"
                            onClick={() =>
                              setContent((prev) => {
                                const current = Array.isArray(prev.footer?.socialLinks)
                                  ? [...prev.footer.socialLinks]
                                  : [];
                                const next = current.filter((_, i) => i !== index);
                                return {
                                  ...prev,
                                  footer: { ...prev.footer, socialLinks: next },
                                };
                              })
                            }
                            className="w-full rounded bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Email Templates */}
            {activeTab === "emails" && (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Email Brand Defaults</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Update global values used across the student and admin enrolment emails.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Company Name</label>
                      <input
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        value={emailBrand.companyName || ""}
                        onChange={(e) => updateEmailBrand("companyName", e.target.value)}
                        placeholder="IT Job Now"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Support Email</label>
                      <input
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        value={emailBrand.supportEmail || ""}
                        onChange={(e) => updateEmailBrand("supportEmail", e.target.value)}
                        placeholder="support@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Default From Email</label>
                      <input
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        value={emailBrand.fromEmail || ""}
                        onChange={(e) => updateEmailBrand("fromEmail", e.target.value)}
                        placeholder="onboarding@resend.dev"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        If blank, the app will use the `EMAIL_FROM` environment variable or Resend test domain.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Student Confirmation Email</h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Controls the email sent to the student after payment succeeds. Dynamic details such as student name,
                        bootcamp name, payment amount, dates and support contact are inserted automatically.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Subject Prefix (before bootcamp name)</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.subjectPrefix || ""}
                          onChange={(e) => updateStudentEmailTemplate("subjectPrefix", e.target.value)}
                          placeholder="Enrolment confirmed – "
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Hero Title</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.heroTitle || ""}
                          onChange={(e) => updateStudentEmailTemplate("heroTitle", e.target.value)}
                          placeholder="Your enrolment is confirmed 🎉"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Hero Subtitle Prefix</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.heroSubtitlePrefix || ""}
                          onChange={(e) => updateStudentEmailTemplate("heroSubtitlePrefix", e.target.value)}
                          placeholder="e.g. Cohort: "
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Hero Subtitle Suffix</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.heroSubtitleSuffix || ""}
                          onChange={(e) => updateStudentEmailTemplate("heroSubtitleSuffix", e.target.value)}
                          placeholder="Leave blank to show only the bootcamp name"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Greeting (before student name)</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.greeting || ""}
                          onChange={(e) => updateStudentEmailTemplate("greeting", e.target.value)}
                          placeholder="Hi"
                        />
                        <p className="mt-1 text-xs text-slate-500">The student name and comma are added automatically.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Intro (before bootcamp name)</label>
                        <textarea
                          className="w-full min-h-[80px] rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.introLead || ""}
                          onChange={(e) => updateStudentEmailTemplate("introLead", e.target.value)}
                          placeholder="Thanks for your payment. This email confirms your enrolment in "
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Intro (after bootcamp name)</label>
                        <textarea
                          className="w-full min-h-[80px] rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.introTrail || ""}
                          onChange={(e) => updateStudentEmailTemplate("introTrail", e.target.value)}
                          placeholder="."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Payment Summary (before amount)</label>
                        <textarea
                          className="w-full min-h-[80px] rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.paymentSummaryLead || ""}
                          onChange={(e) => updateStudentEmailTemplate("paymentSummaryLead", e.target.value)}
                          placeholder="We’ve received"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Payment Summary (between amount and date)</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.paymentSummaryMid || ""}
                          onChange={(e) => updateStudentEmailTemplate("paymentSummaryMid", e.target.value)}
                          placeholder="on"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Payment Summary (after date)</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.paymentSummaryTrail || ""}
                          onChange={(e) => updateStudentEmailTemplate("paymentSummaryTrail", e.target.value)}
                          placeholder="."
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Summary Heading</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.summaryHeading || ""}
                          onChange={(e) => updateStudentEmailTemplate("summaryHeading", e.target.value)}
                          placeholder="Summary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Next Steps Heading</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.nextStepsHeading || ""}
                          onChange={(e) => updateStudentEmailTemplate("nextStepsHeading", e.target.value)}
                          placeholder="What’s next?"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Summary Labels</h3>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Bootcamp</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={studentSummaryLabels.bootcamp || ""}
                            onChange={(e) => updateStudentSummaryLabel("bootcamp", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Student Email</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={studentSummaryLabels.studentEmail || ""}
                            onChange={(e) => updateStudentSummaryLabel("studentEmail", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Amount</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={studentSummaryLabels.amount || ""}
                            onChange={(e) => updateStudentSummaryLabel("amount", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Payment Method</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={studentSummaryLabels.paymentMethod || ""}
                            onChange={(e) => updateStudentSummaryLabel("paymentMethod", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Stripe Reference</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={studentSummaryLabels.stripeReference || ""}
                            onChange={(e) => updateStudentSummaryLabel("stripeReference", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Receipt Text</label>
                        <textarea
                          className="w-full min-h-[80px] rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.receiptText || ""}
                          onChange={(e) => updateStudentEmailTemplate("receiptText", e.target.value)}
                          placeholder="You can view or download your Stripe receipt here:"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Receipt CTA Label</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.receiptCta || ""}
                          onChange={(e) => updateStudentEmailTemplate("receiptCta", e.target.value)}
                          placeholder="View receipt"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Fallback Text When No Receipt Available</label>
                      <textarea
                        className="w-full min-h-[80px] rounded border border-slate-300 px-3 py-2 text-sm"
                        value={studentEmailTemplate.noReceiptText || ""}
                        onChange={(e) => updateStudentEmailTemplate("noReceiptText", e.target.value)}
                        placeholder="(We couldn’t attach a receipt link automatically for this payment yet.)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Next Steps List</label>
                      <p className="mt-1 text-xs text-slate-500">
                        Displayed as bullet points below the heading. Leave blank to omit the list.
                      </p>
                      <div className="mt-3 space-y-3">
                        {studentNextSteps.map((step, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
                              value={step || ""}
                              onChange={(e) =>
                                updateStudentNextSteps((current) => {
                                  const next = [...current];
                                  next[index] = e.target.value;
                                  return next;
                                })
                              }
                              placeholder="You’ll receive onboarding / access details shortly."
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateStudentNextSteps((current) =>
                                  current.filter((_, i) => i !== index)
                                )
                              }
                              className="rounded bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            updateStudentNextSteps((current) => [...current, ""])
                          }
                          className="inline-flex items-center justify-center rounded bg-green-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
                        >
                          + Add Step
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Closing Line</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.closingLine || ""}
                          onChange={(e) => updateStudentEmailTemplate("closingLine", e.target.value)}
                          placeholder="Cheers,"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Closing Signature Prefix</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.closingSignaturePrefix || ""}
                          onChange={(e) => updateStudentEmailTemplate("closingSignaturePrefix", e.target.value)}
                          placeholder="The "
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Closing Signature Suffix</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.closingSignatureSuffix || ""}
                          onChange={(e) => updateStudentEmailTemplate("closingSignatureSuffix", e.target.value)}
                          placeholder=" Team"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Support Line Prefix</label>
                        <textarea
                          className="w-full min-h-[80px] rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.supportTextPrefix || ""}
                          onChange={(e) => updateStudentEmailTemplate("supportTextPrefix", e.target.value)}
                          placeholder="Need help? Contact us at "
                        />
                        <p className="mt-1 text-xs text-slate-500">The support email is appended automatically.</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Footer Prefix</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.footerPrefix || ""}
                          onChange={(e) => updateStudentEmailTemplate("footerPrefix", e.target.value)}
                          placeholder="© "
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Footer Suffix</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={studentEmailTemplate.footerSuffix || ""}
                          onChange={(e) => updateStudentEmailTemplate("footerSuffix", e.target.value)}
                          placeholder=". All rights reserved."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Admin Notification Email</h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Sent to the admin inbox after a successful enrolment. The student name and bootcamp name are appended
                        to the subject automatically.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Subject Prefix</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={adminEmailTemplate.subjectPrefix || ""}
                          onChange={(e) => updateAdminEmailTemplate("subjectPrefix", e.target.value)}
                          placeholder="New enrolment:"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Heading</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={adminEmailTemplate.title || ""}
                          onChange={(e) => updateAdminEmailTemplate("title", e.target.value)}
                          placeholder="New enrolment received"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Intro Paragraph</label>
                      <textarea
                        className="w-full min-h-[80px] rounded border border-slate-300 px-3 py-2 text-sm"
                        value={adminEmailTemplate.intro || ""}
                        onChange={(e) => updateAdminEmailTemplate("intro", e.target.value)}
                        placeholder="A student just completed their payment. Details below:"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Summary Labels</h3>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Student Name</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={adminSummaryLabels.studentName || ""}
                            onChange={(e) => updateAdminSummaryLabel("studentName", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Student Email</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={adminSummaryLabels.studentEmail || ""}
                            onChange={(e) => updateAdminSummaryLabel("studentEmail", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Bootcamp</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={adminSummaryLabels.bootcamp || ""}
                            onChange={(e) => updateAdminSummaryLabel("bootcamp", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Amount Paid</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={adminSummaryLabels.amountPaid || ""}
                            onChange={(e) => updateAdminSummaryLabel("amountPaid", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Paid At</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={adminSummaryLabels.paidAt || ""}
                            onChange={(e) => updateAdminSummaryLabel("paidAt", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Stripe Session</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={adminSummaryLabels.stripeSession || ""}
                            onChange={(e) => updateAdminSummaryLabel("stripeSession", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600">Payment Method</label>
                          <input
                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            value={adminSummaryLabels.paymentMethod || ""}
                            onChange={(e) => updateAdminSummaryLabel("paymentMethod", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Receipt Label</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={adminEmailTemplate.receiptLabel || ""}
                          onChange={(e) => updateAdminEmailTemplate("receiptLabel", e.target.value)}
                          placeholder="Receipt"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Receipt CTA Label</label>
                        <input
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                          value={adminEmailTemplate.receiptCta || ""}
                          onChange={(e) => updateAdminEmailTemplate("receiptCta", e.target.value)}
                          placeholder="View Stripe receipt"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* FAQ Section */}
            {activeTab === "faq" && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">FAQ Section</h2>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Section Title</label>
                    <input
                      className="border rounded px-3 py-2 w-full"
                      value={content.faq?.title || ""}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          faq: { ...prev.faq, title: e.target.value },
                        }))
                      }
                      placeholder="Frequently Asked Questions"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Section Description</label>
                    <textarea
                      className="border rounded px-3 py-2 w-full text-sm min-h-[100px]"
                      value={content.faq?.description || ""}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          faq: { ...prev.faq, description: e.target.value },
                        }))
                      }
                      placeholder="Explore our FAQs to learn more..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Hero Heading</label>
                    <input
                      className="border rounded px-3 py-2 w-full"
                      value={content.faq?.heroHeading || ""}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          faq: { ...prev.faq, heroHeading: e.target.value },
                        }))
                      }
                      placeholder="Questions and answers to things we're often asked"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Hero Description</label>
                    <textarea
                      className="border rounded px-3 py-2 w-full text-sm min-h-[80px]"
                      value={content.faq?.heroDescription || ""}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          faq: { ...prev.faq, heroDescription: e.target.value },
                        }))
                      }
                      placeholder="FAQs about NetSuite, ERP, and cloud technologies, and ourselves"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Default Open Items</label>
                    <input
                      type="number"
                      min={0}
                      max={content.faq?.items?.length || 0}
                      className="border rounded px-3 py-2 w-full md:w-40"
                      value={content.faq?.initialOpenCount ?? 0}
                      onChange={(e) => {
                        const raw = parseInt(e.target.value, 10);
                        setContent((prev) => {
                          const itemsLength = Array.isArray(prev.faq?.items) ? prev.faq.items.length : 0;
                          const safeValue = Number.isNaN(raw) ? 0 : Math.max(0, raw);
                          const clamped = Math.min(safeValue, itemsLength);
                          return {
                            ...prev,
                            faq: { ...prev.faq, initialOpenCount: clamped },
                          };
                        });
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Controls how many questions start expanded (max equals total FAQs).
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium">FAQ Items</label>
                    {(content.faq?.items || []).map((item, index) => {
                      const itemsLength = content.faq?.items?.length || 0;
                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-700">
                              FAQ #{index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() =>
                                setContent((prev) => {
                                  const currentItems = Array.isArray(prev.faq?.items)
                                    ? [...prev.faq.items]
                                    : [];
                                  if (currentItems.length <= 1) {
                                    return prev;
                                  }
                                  const nextItems = currentItems.filter((_, i) => i !== index);
                                  const adjustedOpenCount = Math.min(
                                    prev.faq?.initialOpenCount ?? 0,
                                    nextItems.length
                                  );
                                  return {
                                    ...prev,
                                    faq: {
                                      ...prev.faq,
                                      items: nextItems,
                                      initialOpenCount: adjustedOpenCount,
                                    },
                                  };
                                })
                              }
                              className={`px-3 py-1 rounded text-sm ${itemsLength <= 1
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-red-500 text-white hover:bg-red-600"
                                }`}
                              disabled={itemsLength <= 1}
                            >
                              Remove
                            </button>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Question
                            </label>
                            <input
                              className="border rounded px-3 py-2 w-full text-sm"
                              value={item.question || ""}
                              onChange={(e) =>
                                setContent((prev) => {
                                  const nextItems = Array.isArray(prev.faq?.items)
                                    ? [...prev.faq.items]
                                    : [];
                                  nextItems[index] = {
                                    ...nextItems[index],
                                    question: e.target.value,
                                  };
                                  return {
                                    ...prev,
                                    faq: { ...prev.faq, items: nextItems },
                                  };
                                })
                              }
                              placeholder="Enter question"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Answer
                            </label>
                            <textarea
                              className="border rounded px-3 py-2 w-full text-sm min-h-[80px]"
                              value={item.answer || ""}
                              onChange={(e) =>
                                setContent((prev) => {
                                  const nextItems = Array.isArray(prev.faq?.items)
                                    ? [...prev.faq.items]
                                    : [];
                                  nextItems[index] = {
                                    ...nextItems[index],
                                    answer: e.target.value,
                                  };
                                  return {
                                    ...prev,
                                    faq: { ...prev.faq, items: nextItems },
                                  };
                                })
                              }
                              placeholder="Enter answer"
                            />
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => {
                          const currentItems = Array.isArray(prev.faq?.items)
                            ? [...prev.faq.items]
                            : [];
                          const nextItems = [
                            ...currentItems,
                            {
                              question: "",
                              answer: "",
                            },
                          ];
                          const adjustedOpenCount = Math.min(
                            prev.faq?.initialOpenCount ?? defaultContent.faq.initialOpenCount,
                            nextItems.length
                          );
                          return {
                            ...prev,
                            faq: {
                              ...prev.faq,
                              items: nextItems,
                              initialOpenCount: adjustedOpenCount,
                            },
                          };
                        })
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      + Add FAQ Item
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${!isDirty || saving
                  ? "cursor-not-allowed bg-slate-200 text-slate-500"
                  : "bg-primary text-white hover:bg-primary/90"
                  }`}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
              {status ? <p className="mt-3 text-sm text-slate-500">{status}</p> : null}
              <p className="mt-4 text-xs text-slate-400">
                Tip: this page saves everything to Vercel KV under key <code className="rounded bg-slate-100 px-1 py-0.5">&quot;landing:content&quot;</code>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
