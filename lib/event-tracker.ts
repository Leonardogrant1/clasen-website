import posthog from 'posthog-js'

// Simple cookie helper to get _fbp and _fbc cookies
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return undefined
}

// Standard Meta Pixel Event Names
const STANDARD_META_EVENTS = [
  'AddPaymentInfo',
  'AddToCart',
  'AddToWishlist',
  'CompleteRegistration',
  'Contact',
  'CustomizeProduct',
  'Donate',
  'FindLocation',
  'InitiateCheckout',
  'Lead',
  'Purchase',
  'Schedule',
  'Search',
  'StartTrial',
  'SubmitApplication',
  'Subscribe',
  'ViewContent',
]

interface TrackOptions {
  eventId?: string;
  metaEventName?: string; // Optional override for Meta Pixel (e.g. tracking 'contact_form_succeeded' as 'Contact')
  customData?: Record<string, any>;
  skipMeta?: boolean;
  skipPostHog?: boolean;
}

/**
 * Tracks an event globally, sending it to PostHog, Meta Pixel (Client-side),
 * and Meta Conversions API (Server-side API route /api/track) with deduplication.
 */
export async function trackEvent(
  eventName: string,
  properties: Record<string, any> = {},
  options: TrackOptions = {}
) {
  if (typeof window === 'undefined') return

  const eventId = options.eventId || crypto.randomUUID()
  const customData = options.customData || properties

  // 1) Track in PostHog
  if (!options.skipPostHog) {
    try {
      posthog.capture(eventName, properties)
    } catch (err) {
      console.error('Error tracking in PostHog:', err)
    }
  }

  // Determine Meta event name to send
  const finalMetaEventName = options.metaEventName || eventName

  // 2) Track in Meta Pixel (client-side)
  if (!options.skipMeta && typeof window.fbq === 'function') {
    try {
      const isStandard = STANDARD_META_EVENTS.includes(finalMetaEventName)
      const trackingType = isStandard ? 'track' : 'trackCustom'

      window.fbq(trackingType, finalMetaEventName, customData, { eventID: eventId })
    } catch (err) {
      console.error('Error tracking in Meta Pixel client:', err)
    }
  }

  // 3) Send to Server (Meta Conversions API via /api/track)
  if (!options.skipMeta) {
    try {
      // Run async without blocking main client UI
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: finalMetaEventName,
          eventId,
          eventSourceUrl: window.location.href,
          fbp: getCookie('_fbp'),
          fbc: getCookie('_fbc'),
          customData,
        }),
      }).catch((err) => {
        console.error('Meta CAPI fetch failed:', err)
      })
    } catch (err) {
      console.error('Error initiating Meta CAPI tracking:', err)
    }
  }
}
