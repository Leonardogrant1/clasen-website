import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";
import { CLOSE_LEAD_FIELDS } from "@/lib/close-fields";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: Number(process.env.SMTP_PORT ?? 465) === 465,
  auth: {
    user: process.env.USERNMAME_NODE_MAILER,
    pass: process.env.PASSWORD_NODE_MAILER,
  },
});

// A failed lead creation must not break the form — the mail to the team is
// already out, so we only log errors here.
async function createCloseLead(name: string, email: string, phone: string, topic: string, message: string) {
  if (!process.env.CLOSE_API_KEY) {
    console.error("[send-mail] Close CRM: CLOSE_API_KEY not set");
    return;
  }

  const auth = Buffer.from(`${process.env.CLOSE_API_KEY}:`).toString("base64");
  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  };

  const payload = {
    name,
    contacts: [
      {
        name,
        emails: [{ email, type: "office" }],
        phones: phone ? [{ phone, type: "mobile" }] : [],
      },
    ],
    [`custom.${CLOSE_LEAD_FIELDS.funnelSource}`]: "Kontaktformular",
  };

  const res = await fetch("https://api.close.com/api/v1/lead/", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const responseText = await res.text();
  console.log("[send-mail] Close lead status:", res.status, "response:", responseText);

  if (!res.ok) {
    console.error("[send-mail] Close CRM error:", responseText);
    return;
  }

  // Attach topic + message as a note so it shows up in the lead's activity feed
  const lead = JSON.parse(responseText) as { id: string };
  const note = [`Betreff: ${topic}`, message && message !== topic ? `\n${message}` : null]
    .filter(Boolean)
    .join("\n");
  const noteRes = await fetch("https://api.close.com/api/v1/activity/note/", {
    method: "POST",
    headers,
    body: JSON.stringify({ lead_id: lead.id, note }),
  });
  if (!noteRes.ok) console.error("[send-mail] Close note error:", await noteRes.text());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, topic, message } = body;

  try {
    await transporter.sendMail({
      from: `"Clasen Immos Kontaktformular" <${process.env.USERNMAME_NODE_MAILER}>`,
      to: process.env.SMTP_TO ?? "kontakt@clasen-immos.de",
      replyTo: email,
      subject: `${topic} — ${name}`,
      text: [
        `Name: ${name}`,
        `E-Mail: ${email}`,
        phone ? `Telefon: ${phone}` : null,
        `Betreff: ${topic}`,
        ``,
        message !== topic ? `Nachricht:\n${message}` : null,
      ].filter(Boolean).join("\n"),
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ""}
        <p><strong>Betreff:</strong> ${topic}</p>
        ${message !== topic ? `<hr /><p><strong>Nachricht:</strong></p><p>${message.replace(/\n/g, "<br/>")}</p>` : ""}
      `,
    });
  } catch (err) {
    console.error("[send-mail] SMTP error:", err);
    return NextResponse.json({ message: "Mail konnte nicht gesendet werden." }, { status: 500 });
  }

  try {
    await createCloseLead(name, email, phone, topic, message);
  } catch (err) {
    console.error("[send-mail] Close lead error:", err);
  }

  const distinctId = req.headers.get("x-posthog-distinct-id") ?? email ?? "anonymous";
  const sessionId = req.headers.get("x-posthog-session-id") ?? undefined;
  const posthog = getPostHogClient();
  posthog.capture({
    distinctId,
    event: "contact_message_received",
    properties: {
      has_phone: !!phone,
      ...(sessionId ? { $session_id: sessionId } : {}),
    },
  });
  await posthog.flush();

  return NextResponse.json({ message: "Success" });
}
