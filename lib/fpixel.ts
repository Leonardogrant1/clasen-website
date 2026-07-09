// lib/fpixel.ts
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export const pageview = () => {
    window.fbq('track', 'PageView')
}

// Standard- oder Custom-Events, z. B. fpixel.event('Lead')
export const event = (name: string, options: Record<string, unknown> = {}) => {
    window.fbq('track', name, options)
}