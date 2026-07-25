import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marriage App — Find Your Perfect Match",
  description: "A marriage-focused dating platform to find your life partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
