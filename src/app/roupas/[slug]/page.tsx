import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Palette, Ruler, Shirt } from "lucide-react";
import { ClothingRentalCard } from "@/components/clothing-rental-card";
import { PublicShell } from "@/components/public-shell";
import { voyaClothingCatalog } from "@/data/voya-clothing-catalog";
import { getPublicClothingBySlug, getPublicCompany } from "@/lib/public-data";

export function generateStaticParams() {
  return voyaClothingCatalog.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps<"/roupas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicClothingBySlug(slug);
  if (!item) return { title: "Roupa não encontrada" };
  return {
    title: `${item.name} — aluguel de roupa de frio`,
    description: item.description ?? `Consulte a disponibilidade de ${item.name} para aluguel com a Voya Turismo.`,
    alternates: { canonical: `/roupas/${item.slug}` },
    openGraph: item.imagePath ? { images: [{ url: item.imagePath }] } : undefined,
  };
}

export default async function ClothingDetailPage({ params }: PageProps<"/roupas/[slug]">) {
  const { slug } = await params;
  const [item, company] = await Promise.all([getPublicClothingBySlug(slug), getPublicCompany()]);
  if (!item) notFound();

  return <PublicShell>
    <section className="clothing-detail-top shell">
      <Link href="/roupas" className="back-link"><ArrowLeft size={18} /> Voltar às roupas</Link>
      <div className="clothing-detail-hero">
        <div className="clothing-detail-image">{item.imagePath ? <img src={item.imagePath} alt={item.name} /> : <Shirt aria-hidden="true" />}{item.featured && <span>Destaque</span>}</div>
        <div className="clothing-detail-intro"><span className="eyebrow">{item.categoryLabel}</span><h1>{item.name}</h1><p>{item.description}</p><div className="clothing-detail-facts">{item.sizes && <span><Ruler /><small>Tamanhos</small><strong>{item.sizes}</strong></span>}{item.color && <span><Palette /><small>Cor</small><strong>{item.color}</strong></span>}<span><Check /><small>Disponíveis</small><strong>{item.quantity} peça{item.quantity === 1 ? "" : "s"}</strong></span></div></div>
      </div>
    </section>
    <section className="clothing-detail-layout shell">
      <div className="clothing-detail-copy"><span className="eyebrow">Aluguel fácil</span><h2>Escolha as diárias e viaje com a mala pronta.</h2><p>O valor exibido é uma estimativa por peça. A equipe Voya confirma o tamanho, a disponibilidade para as datas da viagem e as condições de retirada e devolução diretamente pelo WhatsApp.</p><ul><li>Peças higienizadas e revisadas</li><li>Orientação de tamanho antes da reserva</li><li>Atendimento personalizado para o seu destino</li></ul></div>
      <ClothingRentalCard name={item.name} sizes={item.sizes} color={item.color} dailyPrice={item.dailyPrice} whatsappNumber={company.whatsapp} />
    </section>
  </PublicShell>;
}
