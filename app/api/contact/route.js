"use server";

import { Resend } from "resend";

// Next.js App Router API Route (app/api/contact/route.js)
// Accepts JSON { fullName, email, phoneNumber, subject, description }
// Sends an email via Resend to CONTACT_TO/EMAIL_FROM (plus a hardcoded admin inbox)

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            fullName = "",
            email = "",
            phoneNumber = "",
            subject = "",
            description = "",
        } = body ?? {};

        // Basic validation
        if (!fullName || !email || !subject || !description) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            return new Response(
                JSON.stringify({ error: "RESEND_API_KEY not configured" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const resend = new Resend(resendApiKey);

        // From: If EMAIL_FROM is not set, use Resend test domain for dev
        const fromAddress = process.env.EMAIL_FROM?.trim() || "onboarding@resend.dev";

        // Always send to the main recipient inbox
        const adminAddress = "sigidevelopers@gmail.com";
        // Additionally allow env-configured recipients (optional)
        const optionalRecipient1 = process.env.CONTACT_TO?.trim();
        const optionalRecipient2 = process.env.EMAIL_FROM?.trim();
        const adminRecipients = Array.from(
            new Set([adminAddress, optionalRecipient1, optionalRecipient2].filter(Boolean))
        );

        const emailSubject = subject || "New Contact Form Submission";

        // Build templates (text + HTML) safely
        const { admin, user } = renderContactTemplates({
            fullName,
            email,
            phoneNumber,
            subject,
            description,
        });

        // 1) Send to admins/inbox
        const { data: adminData, error: adminError } = await resend.emails.send({
            from: fromAddress,
            to: adminRecipients,
            reply_to: email, // so you can reply directly to the sender
            subject: `[Contact] ${emailSubject}`,
            text: admin.text,
            html: admin.html,
        });

        if (adminError) {
            return new Response(
                JSON.stringify({
                    error: adminError.message || "Failed to send admin email",
                }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // 2) Send a copy/confirmation to the user who submitted the form
        let userEmailId = null;
        let userEmailError = null;
        try {
            const userRes = await resend.emails.send({
                from: fromAddress,
                to: [email],
                subject: `We received your message: ${emailSubject}`,
                text: user.text,
                html: user.html,
            });
            userEmailId = userRes?.data?.id || null;
        } catch (userErr) {
            userEmailError =
                userErr?.message || "Failed to send confirmation to user";
            console.error("Failed to send confirmation to user:", userEmailError);
        }

        return new Response(
            JSON.stringify({
                success: true,
                adminEmailId: adminData?.id || null,
                userEmailId,
                userEmailSent: Boolean(userEmailId) && !userEmailError,
                userEmailError,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({
                error:
                    err?.message || "Unexpected error while sending contact form email",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

/** Small helper to avoid HTML injection in the email */
function escapeHtml(input) {
    return String(input)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/** Renders both admin + user email bodies (text + html) with safe escaping */
function renderContactTemplates({ fullName, email, phoneNumber, subject, description }) {
    const safe = {
        fullName: escapeHtml(fullName || ""),
        email: escapeHtml(email || ""),
        phoneNumber: escapeHtml(phoneNumber || "N/A"),
        subject: escapeHtml(subject || ""),
        // Keep raw for text version, convert newlines to <br/> for HTML
        descriptionTxt: String(description || ""),
        descriptionHtml: escapeHtml(String(description || "")).replace(/\n/g, "<br/>"),
    };
    const year = new Date().getFullYear();

    // --- Admin versions ---
    const adminText =
        `New contact form submission:\n\n` +
        `Full Name: ${fullName}\n` +
        `Email: ${email}\n` +
        `Phone Number: ${phoneNumber || "N/A"}\n` +
        `Subject: ${subject}\n\n` +
        `Message:\n${safe.descriptionTxt}\n`;

    const adminHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New Contact Form Submission</title>
    <style>
      body{margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
      .wrap{max-width:640px;margin:24px auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
      .header{background:#0f172a;color:#fff;padding:22px 28px}
      .header h1{margin:0;font-size:18px}
      .content{padding:26px 28px}
      .row{display:flex;justify-content:space-between;gap:16px;margin:10px 0;font-size:14px}
      .key{color:#6b7280;min-width:140px}
      .val{color:#111827;text-align:right}
      .msg{background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;margin-top:14px;white-space:pre-wrap}
      .footer{color:#6b7280;text-align:center;font-size:12px;margin:18px 0}
      a{color:#0f172a}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="header">
        <h1>New Query – Drop-in</h1>
        <p style="margin:6px 0 0;opacity:.85">From ${safe.fullName} &lt;${safe.email}&gt;</p>
      </div>
      <div class="content">
        <div class="row"><div class="key">Full Name</div><div class="val">${safe.fullName}</div></div>
        <div class="row"><div class="key">Email</div><div class="val">${safe.email}</div></div>
        <div class="row"><div class="key">Phone</div><div class="val">${safe.phoneNumber}</div></div>
        <div class="row"><div class="key">Subject</div><div class="val">${safe.subject}</div></div>
        <div class="msg">${safe.descriptionHtml}</div>
        <p style="margin-top:16px;color:#6b7280;font-size:13px">Reply directly to this email to contact the sender.</p>
      </div>
    </div>
    <p class="footer">© ${year} IT Bootcamp</p>
  </body>
</html>
  `.trim();

    // --- User versions ---
    const userText =
        `Hi ${fullName},\n\n` +
        `Thanks for contacting us. Here's a copy of your submission:\n\n` +
        adminText +
        `\nWe will get back to you shortly.\n\nBest regards,\nIT Bootcamp`;

    const userHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>We received your message</title>
    <style>
      body{margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
      .wrap{max-width:640px;margin:24px auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
      .header{background:#0f172a;color:#fff;padding:22px 28px}
      .header h1{margin:0;font-size:18px}
      .content{padding:26px 28px}
      .pill{display:inline-block;background:#0f172a;color:#fff;border-radius:9999px;padding:6px 12px;font-size:12px}
      .row{display:flex;justify-content:space-between;gap:16px;margin:10px 0;font-size:14px}
      .key{color:#6b7280;min-width:140px}
      .val{color:#111827;text-align:right}
      .msg{background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;margin-top:14px;white-space:pre-wrap}
      .footer{color:#6b7280;text-align:center;font-size:12px;margin:18px 0}
      a{color:#0f172a}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="header">
        <h1>Thanks, we received your message ✅</h1>
        <p style="margin:6px 0 0;opacity:.85">We usually reply within 1 business day.</p>
      </div>
      <div class="content">
        <p>Hi ${safe.fullName},</p>
        <p>Here’s a copy of what you sent us. If anything looks off, just reply to this email.</p>
        <div class="row"><div class="key">Subject</div><div class="val">${safe.subject}</div></div>
        <div class="row"><div class="key">Your email</div><div class="val">${safe.email}</div></div>
        <div class="row"><div class="key">Phone</div><div class="val">${safe.phoneNumber}</div></div>
        <div class="msg">${safe.descriptionHtml}</div>
        <p style="margin-top:16px;color:#6b7280;font-size:13px">Need to add more details? Reply to this email and it’ll reach our team.</p>
        <p style="margin-top:8px;font-size:13px;color:#6b7280">Support: <a href="mailto:support@itbootcamp.example" style="color:#0f172a;">support@itbootcamp.example</a></p>
      </div>
    </div>
    <p class="footer">© ${year} IT Bootcamp</p>
  </body>
</html>
  `.trim();

    return {
        admin: { text: adminText, html: adminHtml },
        user: { text: userText, html: userHtml },
    };
}
