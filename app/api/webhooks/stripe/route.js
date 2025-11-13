import Stripe from "stripe";
import { Resend } from "resend";
import { kv } from "@vercel/kv";
import { defaultContent, KV_KEY } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  })
  : null;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FALLBACK_COMPANY_NAME = "IT Job Now";
const FALLBACK_SUPPORT_EMAIL = "support@itjobnow.com.au";
const CONTENT_CACHE_TTL = 60 * 1000;

let cachedContent = null;
let lastContentFetch = 0;

async function getSiteContent() {
  if (
    !process.env.KV_REST_API_URL ||
    !process.env.KV_REST_API_TOKEN
  ) {
    return defaultContent;
  }

  const now = Date.now();
  if (cachedContent && now - lastContentFetch < CONTENT_CACHE_TTL) {
    return cachedContent;
  }

  try {
    const content = await kv.get(KV_KEY);
    cachedContent = content || defaultContent;
  } catch (error) {
    console.error("❌ KV content fetch error:", error);
    cachedContent = defaultContent;
  }

  lastContentFetch = now;
  return cachedContent;
}

export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      env: {
        STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        EMAIL_FROM: !!process.env.EMAIL_FROM,
      },
    }),
    { status: 200 }
  );
}

export async function POST(req) {
  if (!stripe) {
    return new Response("Stripe not configured", { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ webhook verified", event.type, event.id);
  } catch (err) {
    console.error("❌ webhook verify fail:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("➡ checkout.session.completed for", session.id);
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object;
        console.log("➡ payment_intent.succeeded for", pi.id);

        const charge =
          pi.charges && pi.charges.data && pi.charges.data[0]
            ? pi.charges.data[0]
            : null;

        if (!charge) {
          console.warn(
            "⚠ payment_intent.succeeded but no charge yet — cannot build receipt"
          );
          break;
        }

        const receiptUrl = charge.receipt_url || null;
        const card = charge.payment_method_details?.card;
        const cardBrand = card?.brand ?? null;
        const cardLast4 = card?.last4 ?? null;

        const sessions = await stripe.checkout.sessions.list({
          payment_intent: pi.id,
          limit: 1,
        });

        const session = sessions.data[0];
        if (!session) {
          console.warn(
            "⚠ payment_intent.succeeded but no Checkout Session found for PI",
            pi.id
          );
          break;
        }

        const customerEmail = session.customer_details?.email ?? null;
        const customerName = session.customer_details?.name ?? "there";
        const amountTotal = session.amount_total
          ? (session.amount_total / 100).toFixed(2)
          : null;
        const currency = (session.currency || "aud").toUpperCase();

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          { limit: 1 }
        );
        const firstItem = lineItems.data[0];

        const bootcampName =
          (session.metadata && session.metadata.bootcamp_name) ||
          firstItem?.description ||
          (firstItem?.price?.nickname ?? "IT Job Now Bootcamp");

        const paidAt = new Date(session.created * 1000).toLocaleString(
          "en-AU",
          { timeZone: "Australia/Sydney" }
        );

        if (!customerEmail) {
          console.warn(
            "⚠ payment_intent.succeeded but session has no email, skipping"
          );
          break;
        }
        if (!resend) {
          console.error("❌ RESEND_API_KEY missing");
          break;
        }

        const siteContent = await getSiteContent();
        const emailTemplates =
          siteContent?.emailTemplates ?? defaultContent.emailTemplates ?? {};
        const brand = emailTemplates?.brand ?? {};
        const studentTemplate =
          emailTemplates?.studentEnrollment ??
          defaultContent.emailTemplates.studentEnrollment;
        const adminTemplate =
          emailTemplates?.adminEnrollment ??
          defaultContent.emailTemplates.adminEnrollment;

        const companyName =
          brand?.companyName?.trim() || FALLBACK_COMPANY_NAME;
        const supportEmail =
          brand?.supportEmail?.trim() || FALLBACK_SUPPORT_EMAIL;

        const fromEmail =
          process.env.EMAIL_FROM ||
          (brand?.fromEmail?.trim() || "onboarding@resend.dev");

        const templateContext = {
          customerName,
          customerEmail,
          amountPaid: amountTotal ? `${currency} ${amountTotal}` : "Paid",
          bootcampName,
          paidAt,
          stripeSessionId: session.id,
          companyName,
          supportEmail,
          receiptUrl,
          cardBrand,
          cardLast4,
          currency,
          amountTotal,
          year: new Date().getFullYear(),
        };

        const studentDefaults =
          defaultContent.emailTemplates?.studentEnrollment || {};
        const studentSubjectPrefix =
          studentTemplate?.subjectPrefix ??
          studentDefaults.subjectPrefix ??
          "Enrolment confirmed – ";
        const studentSubject = `${studentSubjectPrefix}${bootcampName}`;

        const html = buildEnrollmentEmail(
          templateContext,
          studentTemplate
        );

        const sendPayload = {
          from: fromEmail,
          to: customerEmail,
          subject: studentSubject,
          html,
        };

        const resp = await resend.emails.send(sendPayload);
        if (resp.error) {
          console.error("❌ Resend error:", resp.error);
        } else {
          console.log("✅ email sent to", customerEmail);
        }

        const adminEmail =
          process.env.ADMIN_ENROLLMENT_EMAIL ||
          process.env.ADMIN_NOTIFICATION_EMAIL ||
          process.env.ADMIN_EMAIL ||
          supportEmail;

        if (adminEmail) {
          const adminDefaults =
            defaultContent.emailTemplates?.adminEnrollment || {};
          const adminSubjectPrefix =
            adminTemplate?.subjectPrefix ??
            adminDefaults.subjectPrefix ??
            "New enrolment:";
          const adminSubject = `${adminSubjectPrefix} ${customerName} – ${bootcampName}`;

          const adminHtml = buildAdminEnrollmentEmail(
            templateContext,
            adminTemplate
          );

          const adminPayload = {
            from: fromEmail,
            to: adminEmail,
            subject: adminSubject,
            html: adminHtml,
          };

          const adminResp = await resend.emails.send(adminPayload);
          if (adminResp.error) {
            console.error("❌ Resend admin email error:", adminResp.error);
          } else {
            console.log("✅ admin email sent to", adminEmail);
          }
        } else {
          console.warn("⚠ Admin email not configured; skipping admin notification");
        }

        break;
      }

      default:
        console.log("Ignoring event:", event.type);
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("❌ handler error:", err);
    return new Response(`Handler Error: ${err.message}`, { status: 500 });
  }
}

function buildEnrollmentEmail(data, template = {}) {
  const defaults =
    defaultContent.emailTemplates?.studentEnrollment ?? {};

  const merged = {
    ...defaults,
    ...template,
    summaryLabels: {
      ...defaults.summaryLabels,
      ...(template.summaryLabels || {}),
    },
    nextSteps: Array.isArray(template.nextSteps)
      ? template.nextSteps
      : defaults.nextSteps || [],
  };

  const heroTitle =
    merged.heroTitle ||
    defaults.heroTitle ||
    "Your enrolment is confirmed 🎉";
  const heroSubtitle = `${merged.heroSubtitlePrefix ?? ""}${data.bootcampName
    }${merged.heroSubtitleSuffix ?? ""}`;

  const greetingBase = merged.greeting || defaults.greeting || "Hi";
  const greeting = `${greetingBase} ${data.customerName},`;

  const introLead =
    merged.introLead ??
    defaults.introLead ??
    "Thanks for your payment. This email confirms your enrolment in ";
  const introTrail = merged.introTrail ?? defaults.introTrail ?? ".";
  const intro = `${introLead}<strong>${data.bootcampName}</strong>${introTrail}`;

  const paymentLead =
    merged.paymentSummaryLead ?? defaults.paymentSummaryLead ?? "We’ve received";
  const paymentMid =
    merged.paymentSummaryMid ?? defaults.paymentSummaryMid ?? "on";
  const paymentTrail =
    merged.paymentSummaryTrail ?? defaults.paymentSummaryTrail ?? ".";
  const paymentSummary = `${paymentLead} <strong>${data.amountPaid}</strong> ${paymentMid} <strong>${data.paidAt}</strong>${paymentTrail || ""}`;

  const summaryHeading =
    merged.summaryHeading ?? defaults.summaryHeading ?? "Summary";
  const summaryLabels = merged.summaryLabels || {};

  const receiptText =
    merged.receiptText ?? defaults.receiptText ?? "You can view your receipt here:";
  const receiptCta =
    merged.receiptCta ?? defaults.receiptCta ?? "View receipt";
  const noReceiptText =
    merged.noReceiptText ??
    defaults.noReceiptText ??
    "(We couldn’t attach a receipt link automatically for this payment yet.)";

  const nextStepsHeading =
    merged.nextStepsHeading ?? defaults.nextStepsHeading ?? "What’s next?";
  const nextStepsList = (merged.nextSteps || []).filter(
    (step) => typeof step === "string" && step.trim().length > 0
  );

  const closingLine =
    merged.closingLine ?? defaults.closingLine ?? "Cheers,";
  const closingSignaturePrefix =
    merged.closingSignaturePrefix ??
    defaults.closingSignaturePrefix ??
    "The ";
  const closingSignatureSuffix =
    merged.closingSignatureSuffix ??
    defaults.closingSignatureSuffix ??
    " Team";
  const closingSignature = `${closingSignaturePrefix}${data.companyName}${closingSignatureSuffix}`;

  const supportPrefix =
    merged.supportTextPrefix ??
    defaults.supportTextPrefix ??
    "Need help? Contact us at ";
  const supportText = `${supportPrefix}${data.supportEmail}.`;

  const footerPrefix =
    merged.footerPrefix ?? defaults.footerPrefix ?? "© ";
  const footerSuffix =
    merged.footerSuffix ??
    defaults.footerSuffix ??
    ". All rights reserved.";
  const footerText = `${footerPrefix}${data.year} ${data.companyName}${footerSuffix}`;

  const shouldShowPaymentMethod = data.cardBrand || data.cardLast4;

  const summaryHeadingMarkup = summaryHeading
    ? `<h3 style="margin:0 0 10px;font-size:15px;">${summaryHeading}</h3>`
    : "";

  const nextStepsMarkup = nextStepsList.length
    ? `<p style="margin-top:20px;">${nextStepsHeading}</p>
        <ul style="color:#4b5563;padding-left:18px;">
          ${nextStepsList.map((item) => `<li>${item}</li>`).join("")}
        </ul>`
    : "";

  const receiptMarkup = data.receiptUrl
    ? `<p style="margin-top:18px;font-size:13px;color:#4b5563;">
                ${receiptText}
                <a href="${data.receiptUrl}" style="color:#0f172a;">${receiptCta}</a>
              </p>`
    : noReceiptText
      ? `<p style="margin-top:18px;font-size:13px;color:#4b5563;">
                ${noReceiptText}
              </p>`
      : "";

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${heroTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="background-color:#f4f4f5;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
      <div style="background:#0f172a;color:#ffffff;padding:24px 32px;">
        <h1 style="margin:0;font-size:20px;">${heroTitle}</h1>
        <p style="margin-top:6px;opacity:0.8;">${heroSubtitle}</p>
      </div>
      <div style="padding:28px 32px 32px 32px;">
        <p>${greeting}</p>
        <p>${intro}</p>
        <p style="font-size:13px;color:#4b5563;">${paymentSummary}</p>

        <div style="background:#f4f4f5;border-radius:10px;padding:16px 18px;margin-top:20px;">
          ${summaryHeadingMarkup}
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:14px;">
            <span>${summaryLabels.bootcamp || "Bootcamp"}</span>
            <span><strong>${data.bootcampName}</strong></span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:14px;">
            <span>${summaryLabels.studentEmail || "Student email"}</span>
            <span>${data.customerEmail}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:14px;">
            <span>${summaryLabels.amount || "Amount"}</span>
            <span>${data.amountPaid}</span>
          </div>
          ${shouldShowPaymentMethod
      ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:14px;">
                  <span>${summaryLabels.paymentMethod || "Payment method"}</span>
                  <span>${data.cardBrand ? data.cardBrand.toUpperCase() : ""}${data.cardLast4 ? " •••• " + data.cardLast4 : ""
      }</span>
                </div>`
      : ""}
          <div style="display:flex;justify-content:space-between;font-size:14px;">
            <span>${summaryLabels.stripeReference || "Stripe reference"}</span>
            <span>${data.stripeSessionId}</span>
          </div>
        </div>

        ${receiptMarkup}
        ${nextStepsMarkup}
        <p style="margin-top:22px;margin-bottom:8px;">
          ${closingLine}<br />
          ${closingSignature}
        </p>
        <p style="font-size:13px;color:#4b5563;margin-top:12px;">
          ${supportText}
        </p>
      </div>
    </div>
    <p style="text-align:center;color:#6b7280;font-size:12px;margin-top:18px;">
      ${footerText}
    </p>
  </body>
</html>`;
}

function buildAdminEnrollmentEmail(data, template = {}) {
  const defaults =
    defaultContent.emailTemplates?.adminEnrollment ?? {};

  const merged = {
    ...defaults,
    ...template,
    summaryLabels: {
      ...defaults.summaryLabels,
      ...(template.summaryLabels || {}),
    },
  };

  const title =
    merged.title || defaults.title || "New enrolment received";
  const intro =
    merged.intro ||
    defaults.intro ||
    "A student just completed their payment. Details below:";

  const summaryLabels = merged.summaryLabels || {};
  const receiptLabel =
    merged.receiptLabel || defaults.receiptLabel || "Receipt";
  const receiptCta =
    merged.receiptCta || defaults.receiptCta || "View Stripe receipt";

  const shouldShowPaymentMethod = data.cardBrand || data.cardLast4;

  const receiptMarkup = data.receiptUrl
    ? `<p style="margin-top:18px;">${receiptLabel}: <a href="${data.receiptUrl}" style="color:#0f172a;">${receiptCta}</a></p>`
    : "";

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="background-color:#f4f4f5;margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#111827;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;padding:24px 28px;">
      <h2 style="margin-top:0;margin-bottom:12px;">${title}</h2>
      <p style="margin-top:0;margin-bottom:18px;">${intro}</p>
      <table style="width:100%;border-collapse:collapse;">
        <tbody>
          <tr>
            <td style="padding:6px 0;font-weight:600;width:40%;">${summaryLabels.studentName || "Student name"}</td>
            <td style="padding:6px 0;">${data.customerName}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">${summaryLabels.studentEmail || "Student email"}</td>
            <td style="padding:6px 0;">${data.customerEmail}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">${summaryLabels.bootcamp || "Bootcamp"}</td>
            <td style="padding:6px 0;">${data.bootcampName}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">${summaryLabels.amountPaid || "Amount paid"}</td>
            <td style="padding:6px 0;">${data.amountPaid}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">${summaryLabels.paidAt || "Paid at"}</td>
            <td style="padding:6px 0;">${data.paidAt}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">${summaryLabels.stripeSession || "Stripe session"}</td>
            <td style="padding:6px 0;">${data.stripeSessionId}</td>
          </tr>
          ${shouldShowPaymentMethod
      ? `<tr>
            <td style="padding:6px 0;font-weight:600;">${summaryLabels.paymentMethod || "Payment method"}</td>
            <td style="padding:6px 0;">${data.cardBrand ? data.cardBrand.toUpperCase() : ""}${data.cardLast4 ? " •••• " + data.cardLast4 : ""
      }</td>
          </tr>`
      : ""
    }
        </tbody>
      </table>
      ${receiptMarkup}
    </div>
  </body>
</html>`;
}
