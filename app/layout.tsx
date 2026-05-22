import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { CalendlyDialogProvider } from "@/components/CalendlyDialogProvider";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CLASEN Family Office - Ihr Schlüssel zum Erfolg.",
  description: "Professionelle Immobilienlösungen für anspruchsvolle Kunden. Ihr Schlüssel zum Erfolg.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CalendlyDialogProvider>
          {children}
        </CalendlyDialogProvider>
      </body>
    </html>
  );
}
