import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura Clinic AI • Voice Business Coach MVP",
  description: "Executive AI Voice Business Coach for Aesthetic Clinics. Maximizing 90-day patient retention, treatment upsells, and practice revenue with real-time CRM & RAG intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-clinic-gold selection:text-obsidian-950`}>
        {children}
      </body>
    </html>
  );
}
