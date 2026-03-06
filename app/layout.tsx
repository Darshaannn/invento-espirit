import "./globals.css";
import React from "react";

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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}