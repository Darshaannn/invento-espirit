import "./globals.css";
import React from "react";

export const metadata = {
  title: "Invento Espirit",
  description: "Advanced cognitive health screening",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0F0A1F] min-h-screen text-white">
        {children}
      </body>
    </html>
  );
}