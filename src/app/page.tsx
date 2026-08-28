import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  Globe2,
  Headphones,
  MapPin,
  MessageCircle,
  Plane,
  Search,
  ShieldCheck,
  Shirt,
  Sparkles,
  Users,
} from "lucide-react";
import { PackageCard } from "@/components/package-card";
import { HomePackageCarousel } from "@/components/home-package-carousel";
import { HeroBackground } from "@/components/motion/hero-background";
import { Reveal } from "@/components/motion/reveal";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { whatsappUrl } from "@/data/demo";
import { serverEnv } from "@/lib/env";
import { getPublicCompany, getPublicHomeContent, getPublicPackages } from "@/lib/public-data";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const categoryIcons = ["☀", "❋", "⌁", "↗"];
const services = [
  { icon: Plane, title: "Nacionais", text: "Destinos no Brasil", href: "/pacotes?tipo=nacional" },
  { icon: Globe2, title: "Internacionais", text: "Destinos no exterior", href: "/pacotes?tipo=internacional" },
  { icon: Shirt, title: "Roupas de frio", text: "Aluguel de roupas", href: "/roupas" },
  { icon: CalendarCheck2, title: "Planejamento", text: "Sua viagem completa", href: "/contato" },
];
const benefits = [
  { icon: ShieldCheck, title: "Viaje com segurança", text: "Roteiros planejados, parceiros selecionados e suporte durante toda a jornada." },
  { icon: Headphones, title: "Atendimento personalizado", text: "Orientação próxima para montar a viagem que combina com você." },
  { icon: Users, title: "Experiências completas", text: "Pacotes nacionais e internacionais com ótimo custo-benefício." },
];

export default async function Home() {
  const [packages, content, company] = await Promise.all([getPublicPackages(), getPublicHomeContent(), getPublicCompany()]);
  const featuredPackages = packages.filter((item) => item.featured).concat(packages.filter((item) => !item.featured)).slice(0, 4);
  return (
    <PublicShell>
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        name: "Voya Turismo",
        url: new URL("/", serverEnv.APP_URL).toString(),
        address: { "@type": "PostalAddress", addressLocality: "Parauapebas", addressRegion: "PA", addressCountry: "BR" },
        sameAs: ["https://www.instagram.com/voya.turismo/"],
      }} />

      <section className="hero">
        <HeroBackground />
        <div className="hero-shade" />
        <div className="shell hero-content">
          <Reveal className="hero-copy" distance={18}>
            <span className="hero-kicker">Viaje com a</span>
            <h1>VOYA <em>TURISMO</em></h1>
            <p>Destinos incríveis, experiências que ficam para sempre.</p>
            <div className="hero-actions">
              <Link className="button button-gold" href="/pacotes">Ver pacotes <ArrowRight size={18} /></Link>
              <Link className="button button-ghost" href="/sobre">Saiba mais</Link>
            </div>
          </Reveal>
          <Reveal delay={0.12} distance={22}>
            <form className="search-panel" action="/pacotes">
              <div className="search-heading"><Search size={20} /><div><strong>Encontre seu próximo destino</strong><span>Escolha os detalhes da sua viagem</span></div></div>
              <label><span>Destino</span><div className="field"><MapPin size={18} /><input name="busca" placeholder="Para onde você quer ir?" /></div></label>
              <div className="field-grid">
                <label><span>Quando?</span><div className="field"><CalendarDays size={18} /><input name="data" type="date" /></div></label>
                <label><span>Categoria</span><select name="categoria" defaultValue=""><option value="">Todas</option>{content.categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
              </div>
              <label><span>Faixa de preço</span><select name="preco" defaultValue=""><option value="">Qualquer valor</option><option value="ate-500">Até R$ 500</option><option value="500-1500">R$ 500 a R$ 1.500</option><option value="acima-1500">Acima de R$ 1.500</option></select></label>
              <button className="button button-gold button-block" type="submit"><Search size={18} /> Buscar pacotes</button>
            </form>
          </Reveal>
        </div>
        <div className="service-strip shell" id="servicos">
          {services.map(({ icon: Icon, title, text, href }) => <Link href={href} key={title}><Icon /><span><strong>{title}</strong><small>{text}</small></span></Link>)}
        </div>
      </section>

      <section className="section shell featured-section">
        <SectionHeading eyebrow="Escolhidos para você" title="Pacotes em destaque" text="Experiências selecionadas para viver dias inesquecíveis." href="/pacotes" linkLabel="Ver todos os pacotes" />
        {featuredPackages.length ? <Reveal><HomePackageCarousel itemCount={featuredPackages.length}>{featuredPackages.map((item) => <PackageCard key={item.slug} item={item} />)}</HomePackageCarousel></Reveal> : <div className="public-empty"><strong>Novas viagens em preparação</strong><p>Fale com nossa equipe para conhecer os próximos roteiros.</p></div>}
      </section>

      <section className="shell promo-grid" aria-label="Serviços Voya Turismo">
        <Link href="/roupas" className="promo-card promo-clothing"><div><span>Aluguel de</span><h2>Roupas de frio</h2><p>Masculino, feminino, infantil e acessórios para viajar bem equipado.</p><strong>Ver roupas <ArrowRight /></strong></div><img src="/media/categories/roupas-frio-v2.webp" alt="Casaco de frio disponível para aluguel" /></Link>
        <Link href="/contato" className="promo-card"><div><span>Planeje sua</span><h2>Viagem</h2><p>Deixe tudo com a Voya e aproveite cada momento.</p><strong>Saiba mais <ArrowRight /></strong></div><img src="/media/categories/planejamento.webp" alt="Acessórios para planejamento de viagem" /></Link>
        <a href={whatsappUrl("Olá! Quero atendimento personalizado da Voya Turismo.", company.whatsapp)} target="_blank" rel="noreferrer" className="promo-card"><div><span>Atendimento</span><h2>Personalizado</h2><p>Fale com nossa equipe e tire suas dúvidas.</p><strong>Falar no WhatsApp <ArrowRight /></strong></div><img src="/media/categories/atendimento-v2.webp" alt="Headset de atendimento personalizado" /></a>
      </section>

      <section className="section section-soft"><div className="shell">
        <SectionHeading eyebrow="Do seu jeito" title="Qual viagem combina com você?" text="Escolha uma experiência e deixe o restante com a gente." />
        <Reveal className="category-grid">{content.categories.map((category, index) => <Link href={`/pacotes?categoria=${encodeURIComponent(category.slug)}`} className="category-card" key={category.slug}><span>{categoryIcons[index % categoryIcons.length]}</span><div><h3>{category.name}</h3><p>{category.count} roteiro{category.count === 1 ? "" : "s"}</p></div><ArrowRight size={20} /></Link>)}</Reveal>
      </div></section>

      <section className="section shell benefits-section">
        <Reveal className="benefits-photo"><img src="/media/destinations/alter-do-chao.webp" alt="Paisagem brasileira cercada de natureza" loading="lazy" /><div className="experience-badge"><Sparkles /><span>viagens bem<br />planejadas</span></div></Reveal>
        <Reveal delay={0.1}><span className="eyebrow">Por que escolher a Voya?</span><h2>Mais que uma viagem.<br />Uma experiência completa.</h2><p className="lead">Da escolha do destino às roupas de frio, a Voya ajuda você a cuidar de cada detalhe.</p><div className="benefit-list">{benefits.map(({ icon: Icon, title, text }) => <div key={title}><span><Icon /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div><Link className="text-link" href="/sobre">Conheça a Voya <ArrowRight size={18} /></Link></Reveal>
      </section>

      {content.testimonial && <section className="testimonial-section"><div className="shell testimonial-inner"><div><span className="eyebrow eyebrow-light">Histórias reais</span><h2>Quem viaja com a gente, recomenda.</h2><p>“{content.testimonial.quote}”</p><div className="testimonial-author"><span>{content.testimonial.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}</span><div><strong>{content.testimonial.name}</strong><small>{content.testimonial.destination}</small></div></div></div><div className="testimonial-score"><strong>{content.testimonial.rating},0</strong><span>{"★".repeat(content.testimonial.rating)}</span><small>avaliação desta experiência</small></div></div></section>}
      {content.faqs.length > 0 && <section className="section section-soft"><div className="shell faq-section"><SectionHeading eyebrow="Antes de viajar" title="Perguntas frequentes" text="Respostas rápidas para planejar com tranquilidade." /><div className="faq-list">{content.faqs.map((faq) => <details key={faq.id}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></div></section>}
      <section className="section shell cta-section"><div><span className="eyebrow">Vamos planejar?</span><h2>Seu próximo destino está esperando.</h2><p>Converse com a equipe Voya e encontre a experiência ideal.</p></div><a className="button button-gold" href={whatsappUrl("Olá! Quero ajuda para escolher minha próxima viagem.", company.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Falar com um especialista</a></section>
    </PublicShell>
  );
}
