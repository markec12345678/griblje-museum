import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/museum/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Muzej vasi Griblje — digitalni muzej vasi ob Kolpi",
  description:
    "Muzej vasi Griblje je dvojezični digitalni muzej resnične vasi v Beli krajini: 14 zapisov, dokazljivi viri, lestvica zanesljivosti, odprti podatki in zemljevid. / A bilingual digital museum of a real village in Bela krajina, Slovenia.",
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
  openGraph: {
    title: "Muzej vasi Griblje",
    description:
      "Digitalni muzej resnične vasi ob Kolpi — zbirka, zgodbe, zemljevid, odprti podatki.",
    siteName: "Muzej vasi Griblje",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
