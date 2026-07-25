import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChronoNav | UC Main Campus Navigation & Schedule System",
  description:
    "Indoor campus navigation and schedule-management web system for the University of Cebu Main Campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-dark antialiased">
        {children}
      </body>
    </html>
  );
}
