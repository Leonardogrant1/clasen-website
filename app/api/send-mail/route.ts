import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";
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
