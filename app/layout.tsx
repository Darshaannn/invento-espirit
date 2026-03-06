import "./globals.css";
import React from "react";

export const metadata = {
  title: "Invento Espirit | Innovation & Idea Investment Platform",
  description: "Connect with students, alumni, professors and investors to transform innovative ideas into real startups.",
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