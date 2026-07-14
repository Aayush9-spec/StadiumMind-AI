import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StadiumMind AI - FIFA World Cup 2026 Stadium Operating System",
  description: "Advanced AI Operations Brain Coordinating Egress Crowd Heatmaps, Emergency Dispatching, Volunteer Assistance, and Sustainability Systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
