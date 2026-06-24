import { NextRequest, NextResponse } from 'next/server'
import { buildClosePayload } from '@/lib/close-mapping'
import type { FunnelType, FunnelAnswers } from '@/components/funnel/FunnelProvider'

export async function POST(req: NextRequest) {
  if (!process.env.CLOSE_API_KEY) {
    console.error('Close CRM: CLOSE_API_KEY not set')
    return NextResponse.json({ success: false }, { status: 500 })
  }

  const { name, email, phone, type, answers } = (await req.json()) as {
    name: string
    email: string
    phone: string
    type: FunnelType
    answers: FunnelAnswers
  }

  const auth = Buffer.from(`${process.env.CLOSE_API_KEY}:`).toString('base64')
  const payload = buildClosePayload(type, answers, { name, email, phone })

  const res = await fetch('https://api.close.com/api/v1/lead/', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    console.error('Close CRM error:', await res.text())
    return NextResponse.json({ success: false }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
