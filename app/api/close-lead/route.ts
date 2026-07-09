import { NextRequest, NextResponse } from 'next/server'
import { buildClosePayload } from '@/lib/close-mapping'
import type { FunnelType, FunnelAnswers } from '@/components/funnel/FunnelProvider'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: Number(process.env.SMTP_PORT ?? 465) === 465,
  auth: {
    user: process.env.USERNMAME_NODE_MAILER,
    pass: process.env.PASSWORD_NODE_MAILER,
  },
})

const PRODUCT_NAMES: Record<FunnelType, string> = {
  owner: 'Traumhaus-Finder™',
  investor: 'Deal-Kompass™',
  seller: 'Käuferradar™',
}

async function sendConfirmationMail(type: FunnelType, name: string, email: string, phone: string) {
  const product = PRODUCT_NAMES[type] ?? 'Traumhaus-Finder™'

  await transporter.sendMail({
    from: `"CLASEN Family Office" <${process.env.USERNMAME_NODE_MAILER}>`,
    to: email,
    replyTo: process.env.SMTP_TO ?? 'kontakt@clasen-immos.de',
    subject: `Ihre Anfrage – CLASEN ${product}`,
    text: [
      `Sehr geehrte/r ${name},`,
      ``,
      `vielen Dank für Ihre Anfrage und Ihr Vertrauen in unseren CLASEN ${product}.`,
      ``,
      `Wir haben Ihre Angaben erfolgreich erhalten:`,
      ``,
      `    •    Name: ${name}`,
      `    •    E-Mail: ${email}`,
      `    •    Telefon: ${phone}`,
      ``,
      `Ihr persönlicher Ansprechpartner meldet sich innerhalb der nächsten 24 Stunden bei Ihnen, um die nächsten Schritte gemeinsam zu besprechen.`,
      ``,
      `Mit den besten Grüßen`,
      ``,
      `CLASEN Family Office`,
      ``,
      `Ihr Schlüssel zum Erfolg.`,
    ].join('\n'),
    html: `
      <!DOCTYPE html>
      <html lang="de">
      <body style="margin:0;padding:0;background:#0d0d0d;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0d0d;padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="max-width:560px;background:#1a1a1a;border-top:3px solid #C9A84C;font-family:'Jost',Arial,Helvetica,sans-serif;color:#ffffff;">

                <!-- Logo -->
                <tr>
                  <td align="center" style="padding:36px 32px 8px 32px;">
                    <img src="https://clasen.com/logo/logo_white.png" alt="CLASEN Family Office" width="180"
                      style="display:block;border:0;max-width:180px;width:180px;height:auto;" />
                  </td>
                </tr>

                <!-- Intro -->
                <tr>
                  <td style="padding:24px 32px 0 32px;">
                    <p style="margin:0 0 4px 0;font-size:11px;color:#C9A84C;letter-spacing:2px;text-transform:uppercase;font-weight:600;">
                      Ihre Anfrage ist eingegangen
                    </p>
                    <p style="margin:0 0 20px 0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">
                      CLASEN ${product}
                    </p>
                    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e0e0e0;">
                      Sehr geehrte/r ${name},
                    </p>
                    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e0e0e0;">
                      vielen Dank für Ihre Anfrage und Ihr Vertrauen in unseren CLASEN ${product}.
                    </p>
                    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#e0e0e0;">
                      Wir haben Ihre Angaben erfolgreich erhalten:
                    </p>
                  </td>
                </tr>

                <!-- Data box -->
                <tr>
                  <td style="padding:0 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                      style="background:#111111;border-left:2px solid #C9A84C;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0 0 8px 0;font-size:14px;color:#ffffff;">
                            <span style="color:#C9A84C;font-weight:600;">Name:</span>&nbsp; ${name}
                          </p>
                          <p style="margin:0 0 8px 0;font-size:14px;color:#ffffff;">
                            <span style="color:#C9A84C;font-weight:600;">E-Mail:</span>&nbsp; ${email}
                          </p>
                          <p style="margin:0;font-size:14px;color:#ffffff;">
                            <span style="color:#C9A84C;font-weight:600;">Telefon:</span>&nbsp; ${phone}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:20px 32px 8px 32px;">
                    <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#e0e0e0;">
                      Ihr persönlicher Ansprechpartner meldet sich innerhalb der nächsten
                      <strong style="color:#ffffff;">24 Stunden</strong> bei Ihnen, um die nächsten Schritte
                      gemeinsam zu besprechen.
                    </p>
                    <p style="margin:0 0 4px 0;font-size:14px;line-height:1.6;color:#e0e0e0;">
                      Mit den besten Grüßen
                    </p>
                    <p style="margin:0 0 28px 0;font-size:15px;font-weight:700;color:#ffffff;">
                      CLASEN Family Office
                    </p>
                  </td>
                </tr>

                <!-- Bottom bar -->
                <tr>
                  <td style="padding:10px 32px;background:#111111;font-size:11px;color:#999999;letter-spacing:1px;">
                    Ihr Schlüssel zum Erfolg.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  })
}

export async function POST(req: NextRequest) {
  const { name, email, phone, type, answers } = (await req.json()) as {
    name: string
    email: string
    phone: string
    type: FunnelType
    answers: FunnelAnswers
  }

  try {
    await sendConfirmationMail(type, name, email, phone)
  } catch (err) {
    console.error('[close-lead] confirmation mail error:', err)
  }

  if (!process.env.CLOSE_API_KEY) {
    console.error('Close CRM: CLOSE_API_KEY not set')
    return NextResponse.json({ success: false }, { status: 500 })
  }

  const auth = Buffer.from(`${process.env.CLOSE_API_KEY}:`).toString('base64')
  const payload = buildClosePayload(type, answers, { name, email, phone })

  console.log('[close-lead] payload:', JSON.stringify(payload, null, 2))

  const res = await fetch('https://api.close.com/api/v1/lead/', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseText = await res.text()
  console.log('[close-lead] status:', res.status, 'response:', responseText)

  if (!res.ok) {
    console.error('Close CRM error:', responseText)
    return NextResponse.json({ success: false }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
