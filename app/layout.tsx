import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Badminton Court Reservations",
  description: "Easy badminton court booking and reservations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${_geist.className} ${_geistMono.className} font-sans antialiased`}
      >
        {/* Skip link for keyboard users */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-3 py-2 rounded"
        >
          Skip to content
        </a>
        <main id="content">{children}</main>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
