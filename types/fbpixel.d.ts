// types/fbpixel.d.ts
declare global {
    interface Window {
        fbq: (...args: unknown[]) => void
    }
}
export { }