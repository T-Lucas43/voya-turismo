import type { Metadata } from "next";
import "./globals.css";
import { serverEnv } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(serverEnv.APP_URL),
  title: {
    default: "Voya Turismo | Destinos incríveis",
    template: "%s | Voya Turismo",
  },
  description: "Pacotes nacionais e internacionais, planejamento de viagens e aluguel de roupas de frio.",
  keywords: ["Voya Turismo", "pacotes de viagem", "viagens nacionais", "viagens internacionais", "aluguel de roupas de frio"],
  applicationName: "Voya Turismo",
  creator: "Voya Turismo",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Voya Turismo", title: "Voya Turismo | Destinos incríveis", description: "Pacotes nacionais e internacionais, planejamento e aluguel de roupas de frio.", images: [{ url: "/media/hero-balneario-voya-4k.webp" }] },
  twitter: { card: "summary_large_image", title: "Voya Turismo", description: "Destinos incríveis, experiências que ficam para sempre.", images: ["/media/hero-balneario-voya-4k.webp"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
