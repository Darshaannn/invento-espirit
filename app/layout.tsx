import "./globals.css";
import React from "react";
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Invento Medical | AI Cognitive Screening",
  description: "Detect early signs of dementia risk through advanced AI-powered cognitive screenings. Trustworthy and secure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}