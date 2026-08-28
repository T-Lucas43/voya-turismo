import type { Metadata } from "next";
import { MessageCircle, Shirt } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { whatsappUrl } from "@/data/demo";
import { formatCurrency } from "@/data/demo";
import { getPublicClothing, getPublicCompany } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Aluguel de roupas de frio",
  description: "Roupas de frio femininas, masculinas, infantis e acessórios para sua viagem.",
  alternates: { canonical: "/roupas" },
};

export default async function ClothingPage() {
  const [items, company] = await Promise.all([getPublicClothing(), getPublicCompany()]);
  return <PublicShell>
    <section className="page-hero clothing-hero"><div className="shell clothing-hero-inner"><div><span className="eyebrow eyebrow-light">Viaje bem equipado</span><h1>Aluguel de roupas de frio</h1><p>Peças para o público feminino, masculino e infantil, além de acessórios para completar sua mala.</p></div><img src="/media/categories/roupas-frio-v2.webp" alt="Casaco de frio disponível para aluguel" /></div></section>
    <section className="section shell clothing-catalog">
      <div className="clothing-category-links" aria-label="Categorias de roupas">
        <span><img src="/media/clothing-products/jaqueta-puffer-azul-masculina.png" alt="" />Masculino</span>
        <span><img src="/media/clothing-products/casaco-la-camel-feminino.png" alt="" />Feminino</span>
        <span><img src="/media/clothing-products/kit-acessorios-rosa.png" alt="" />Acessórios</span>
        <span><img src="/media/clothing-products/jaqueta-infantil-marinho.png" alt="" />Infantil</span>
      </div>
      {items.length ? <div className="clothing-grid">{items.map((item) => <article className="clothing-card" key={item.id}>
        <div className="clothing-image">{item.imagePath ? <img src={item.imagePath} alt={item.name} /> : <Shirt aria-hidden="true" />}{item.featured && <span>Destaque</span>}</div>
        <div><small>{item.categoryLabel}</small><h2>{item.name}</h2>{item.description && <p>{item.description}</p>}<dl>{item.sizes && <><dt>Tamanhos</dt><dd>{item.sizes}</dd></>}{item.color && <><dt>Cor</dt><dd>{item.color}</dd></>}<dt>Disponíveis</dt><dd>{item.quantity}</dd></dl><strong>{item.dailyPrice == null ? "Valor sob consulta" : `${formatCurrency(item.dailyPrice)} / diária`}</strong><a className="clothing-interest-link" href={whatsappUrl(`Olá! Quero consultar a disponibilidade de ${item.name}.`, company.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Consultar no WhatsApp</a></div>
      </article>)}</div> : <div className="public-empty clothing-empty"><Shirt /><strong>Catálogo em preparação</strong><p>As peças serão cadastradas pela equipe Voya no painel administrativo. Fale conosco para consultar opções disponíveis.</p></div>}
    </section>
    <section className="section shell cta-section"><div><span className="eyebrow">Precisa de ajuda?</span><h2>Monte sua mala de frio com a Voya.</h2><p>Conte o destino e as datas da viagem para receber orientação personalizada.</p></div><a className="button button-gold" href={whatsappUrl("Olá! Quero saber mais sobre o aluguel de roupas de frio.", company.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle /> Consultar roupas</a></section>
  </PublicShell>;
}
