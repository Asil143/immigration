import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/layout/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "VisaPilot — Your Immigration Co-Pilot",
    template: "%s | VisaPilot",
  },
  description:
    "AI-powered immigration guidance for international students and immigrants. Navigate F-1, OPT, H-1B, green card, and more with confidence.",
  keywords: [
    "immigration",
    "visa",
    "F-1",
    "OPT",
    "H-1B",
    "green card",
    "international students",
    "USCIS",
    "immigration attorney",
  ],
  openGraph: {
    title: "VisaPilot — Your Immigration Co-Pilot",
    description: "AI-powered immigration guidance for international students",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning style={{ background: "#ffffff", colorScheme: "light" }}>
        <body className="min-h-full bg-white font-sans antialiased" style={{ backgroundColor: "#ffffff", color: "#0f172a" }}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
