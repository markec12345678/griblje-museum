import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/museum/providers";
import { PwaRegister } from "@/components/museum/pwa-register";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Muzej vasi Griblje — digitalni muzej vasi ob Kolpi",
    template: "%s — Muzej vasi Griblje",
  },
  description:
    "Muzej vasi Griblje je trojezični digitalni muzej resnične vasi v Beli krajini: 44 zapisov, dokazljivi viri, lestvica zanesljivosti, odprti podatki in zemljevid. / A multilingual digital museum of a real village in Bela krajina, Slovenia.",
  keywords: [
    "Griblje",
    "Bela krajina",
    "Kolpa",
    "digitalni muzej",
    "vas",
    "Črnomelj",
    "digital museum",
    "village museum",
    "Slovenia",
  ],
  authors: [{ name: "Muzej vasi Griblje" }],
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Muzej vasi Griblje — Griblje Village Museum",
    description:
      "Digitalni muzej resnične vasi ob Kolpi — zbirka, zgodbe, zemljevid, odprti podatki. / A digital museum of a real village on the Kolpa.",
    siteName: "Muzej vasi Griblje",
    type: "website",
    locale: "sl",
    alternateLocale: ["en"],
    images: [
      {
        url: "/images/authentic/hero-griblje.jpg",
        width: 1600,
        height: 800,
        alt: "Vas Griblje ob Kolpi s cerkvijo sv. Vida / The village of Griblje on the Kolpa with the church of St. Vitus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muzej vasi Griblje — Griblje Village Museum",
    description:
      "Digitalni muzej resnične vasi ob Kolpi — zbirka, zgodbe, zemljevid, odprti podatki.",
    images: ["/images/authentic/hero-griblje.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sl"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased bg-background text-foreground min-h-screen">
        <Providers>{children}</Providers>
        <PwaRegister />
      </body>
    </html>
  );
}
