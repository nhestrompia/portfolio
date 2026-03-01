import { ibmPlexMono, inter, spaceGrotesk } from "@/lib/fonts";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "UMUT.SYSTEM",
    template: "%s — UMUT.SYSTEM",
  },
  description:
    "Full-stack engineer & product builder. Realtime trading systems, on-chain engines, and protocol infrastructure.",
  keywords: [
    "Web3",
    "Solana",
    "Ethereum",
    "blockchain engineer",
    "systems engineer",
    "product engineer",
  ],
  authors: [{ name: "Umut Özçelik" }],
  creator: "Umut Özçelik",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "UMUT.SYSTEM — Full-Stack Engineer",
    description:
      "Full-stack engineer & product builder. Realtime trading systems, on-chain engines, protocol infrastructure.",
    siteName: "UMUT.SYSTEM",
  },
  twitter: {
    card: "summary_large_image",
    title: "UMUT.SYSTEM — Full-Stack Engineer",
    description:
      "Full-stack engineer & product builder. Realtime trading systems, on-chain engines, protocol infrastructure.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f3f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased overflow-hidden noise-overlay">
        {children}
      </body>
    </html>
  );
}
