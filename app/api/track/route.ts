import { NextRequest, NextResponse } from 'next/server'

// Map common camelCase custom data properties to Meta's expected snake_case properties
const CUSTOM_DATA_MAP: Record<string, string> = {
  contentName: 'content_name',
  contentCategory: 'content_category',
  contentIds: 'content_ids',
  contentType: 'content_type',
  numItems: 'num_items',
  orderId: 'order_id',
  searchString: 'search_string',
}

function normalizeCustomData(customData?: Record<string, any>): Record<string, any> | undefined {
  if (!customData) return undefined

  const normalized: Record<string, any> = {}
  for (const [key, value] of Object.entries(customData)) {
    const targetKey = CUSTOM_DATA_MAP[key] || key
    normalized[targetKey] = value
  }
  return normalized
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { eventName, eventId, eventSourceUrl, customData, fbp, fbc } = body

    // Extract client IP and User Agent for event matching (essential for CAPI quality score)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] ?? ''
    const userAgent = req.headers.get('user-agent') ?? ''

    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const accessToken = process.env.FB_CAPI_ACCESS_TOKEN;

    if (!pixelId) {
      console.error('[CAPI] Meta Pixel ID is missing from environment variables.')
      return NextResponse.json({ success: false, error: 'Meta Pixel ID is missing.' }, { status: 500 })
    }

    if (!accessToken) {
      // In development or if not yet configured, log warning but don't crash
      console.warn('[CAPI] FB_CAPI_ACCESS_TOKEN is missing. Skipping server-side event dispatch.')
      return NextResponse.json({ success: false, warning: 'CAPI access token not configured.' })
    }

    // Build the Conversions API Event payload
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventSourceUrl,
          action_source: 'website',
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: userAgent,
            ...(fbp ? { fbp } : {}),
            ...(fbc ? { fbc } : {}),
          },
          ...(customData ? { custom_data: normalizeCustomData(customData) } : {}),
        },
      ],
    }

    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('[CAPI] Meta CAPI response error:', result)
      return NextResponse.json({ success: false, error: result }, { status: response.status })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    console.error('[CAPI] Error processing tracking event:', err)
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 500 })
  }
}
