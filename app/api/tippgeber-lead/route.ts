import { NextRequest, NextResponse, after } from 'next/server'
import { CLOSE_LEAD_FIELDS } from '@/lib/close-fields'
import nodemailer from 'nodemailer'

const TIPPGEBER_ART_LABELS: Record<string, string> = {
  bauauftrag: 'Bauauftrag',
  sanierungsauftrag: 'Sanierungsauftrag',
  renovierungsauftrag: 'Renovierungsauftrag',
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: Number(process.env.SMTP_PORT ?? 465) === 465,
  auth: {
    user: process.env.USERNMAME_NODE_MAILER,
    pass: process.env.PASSWORD_NODE_MAILER,
  },
})

// Preview/template: email-confirmation-tippgeber.html (project root)
async function sendConfirmationMail(name: string, email: string, phone: string, typeLabel: string) {
  await transporter.sendMail({
    from: `"CLASEN Family Office" <${process.env.USERNMAME_NODE_MAILER}>`,
    to: email,
    replyTo: process.env.SMTP_TO ?? 'kontakt@clasen-immos.de',
    subject: 'Ihre Empfehlung – CLASEN Tippgeberprogramm',
    text: [
      `Sehr geehrte/r ${name},`,
      ``,
      `vielen Dank für Ihre Empfehlung und Ihr Vertrauen in das CLASEN Tippgeberprogramm.`,
      ``,
      `Wir haben Ihre Angaben erfolgreich erhalten:`,
      ``,
      `    •    Name: ${name}`,
      `    •    E-Mail: ${email}`,
      phone ? `    •    Telefon: ${phone}` : null,
      `    •    Art des Auftrags: ${typeLabel}`,
      ``,
      `Unser Team prüft Ihren Tipp diskret und meldet sich innerhalb der nächsten 24 Stunden bei Ihnen.`,
      ``,
      `Kommt aus Ihrer Empfehlung ein Auftrag zustande, erhalten Sie Ihre Tippgeberprovision — vor Auftragsbeginn schriftlich zugesichert.`,
      ``,
      `Mit den besten Grüßen`,
      ``,
      `CLASEN Family Office`,
      ``,
      `Ihr Schlüssel zum Erfolg.`,
    ].filter(Boolean).join('\n'),
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
                      Ihre Empfehlung ist eingegangen
                    </p>
                    <p style="margin:0 0 20px 0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">
                      CLASEN Tippgeberprogramm
                    </p>
                    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e0e0e0;">
                      Sehr geehrte/r ${name},
                    </p>
                    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e0e0e0;">
                      vielen Dank für Ihre Empfehlung und Ihr Vertrauen in das <br />CLASEN Tippgeberprogramm.
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
                          ${phone ? `<p style="margin:0 0 8px 0;font-size:14px;color:#ffffff;">
                            <span style="color:#C9A84C;font-weight:600;">Telefon:</span>&nbsp; ${phone}
                          </p>` : ''}
                          <p style="margin:0;font-size:14px;color:#ffffff;">
                            <span style="color:#C9A84C;font-weight:600;">Art des Auftrags:</span>&nbsp; ${typeLabel}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:20px 32px 8px 32px;">
                    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#e0e0e0;">
                      Unser Team prüft Ihren Tipp <strong style="color:#ffffff;">diskret</strong> und meldet sich
                      innerhalb der nächsten <strong style="color:#ffffff;">24 Stunden</strong> bei Ihnen.
                    </p>
                    <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#e0e0e0;">
                      Kommt aus Ihrer Empfehlung ein Auftrag zustande, erhalten Sie Ihre Tippgeberprovision —
                      vor Auftragsbeginn <strong style="color:#ffffff;">schriftlich zugesichert</strong>.
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
  const { name, email, phone, type, message } = (await req.json()) as {
    name: string
    email: string
    phone: string
    type: string
    message: string
  }

  const artLabel = TIPPGEBER_ART_LABELS[type]

  if (!process.env.CLOSE_API_KEY) {
    console.error('Close CRM: CLOSE_API_KEY not set')
    return NextResponse.json({ success: false }, { status: 500 })
  }

  const auth = Buffer.from(`${process.env.CLOSE_API_KEY}:`).toString('base64')
  const headers = {
    Authorization: `Basic ${auth}`,
    'Content-Type': 'application/json',
  }

  const payload: Record<string, unknown> = {
    name,
    contacts: [
      {
        name,
        emails: [{ email, type: 'office' }],
        phones: phone ? [{ phone, type: 'mobile' }] : [],
      },
    ],
    [`custom.${CLOSE_LEAD_FIELDS.leadType}`]: 'Tippgeber',
  }
  if (artLabel) payload[`custom.${CLOSE_LEAD_FIELDS.tippgeberArt}`] = artLabel

  console.log('[tippgeber-lead] payload:', JSON.stringify(payload, null, 2))

  const res = await fetch('https://api.close.com/api/v1/lead/', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  const responseText = await res.text()
  console.log('[tippgeber-lead] status:', res.status, 'response:', responseText)

  if (!res.ok) {
    console.error('Close CRM error:', responseText)
    return NextResponse.json({ success: false }, { status: 500 })
  }

  // Send the confirmation mail after the response — SMTP takes ~15s and
  // must not block the form feedback
  if (email) {
    after(() =>
      sendConfirmationMail(name, email, phone, artLabel ?? type).catch((err) =>
        console.error('[tippgeber-lead] confirmation mail error:', err)
      )
    )
  }

  // Attach the tip message as a note so it shows up in the lead's activity feed
  if (message) {
    try {
      const lead = JSON.parse(responseText) as { id: string }
      const noteRes = await fetch('https://api.close.com/api/v1/activity/note/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ lead_id: lead.id, note: `Tipp (${artLabel ?? type}):\n\n${message}` }),
      })
      if (!noteRes.ok) console.error('[tippgeber-lead] note error:', await noteRes.text())
    } catch (err) {
      console.error('[tippgeber-lead] note error:', err)
    }
  }

  return NextResponse.json({ success: true })
}
