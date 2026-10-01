import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: `${BRAND.name} — Financement pour entreprises refusées par la banque`,
  description:
    "Financement commercial de 10 000 $ à 500 000 $ basé sur vos revenus, pour les entreprises québécoises que la banque a refusées. Aucuns frais d'avance, réponse rapide.",
  openGraph: {
    title: `${BRAND.name} — Financement d'entreprise`,
    description: "Financement commercial basé sur vos revenus. Aucuns frais d'avance.",
    url: BRAND.url,
    siteName: BRAND.name,
    locale: "fr_CA",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr-CA"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
