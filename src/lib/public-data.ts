import { company, packages as demoPackages, type TravelPackage } from "@/data/demo";
import { voyaClothingCatalog } from "@/data/voya-clothing-catalog";
import { voyaPackageCatalog } from "@/data/voya-package-catalog";
import { connection } from "next/server";
import { isFrontendOnly } from "@/lib/env";
import { publicPackageWhere } from "@/lib/packages/visibility";
import { prisma } from "@/lib/prisma";

export type PublicCompany = {
  name: string;
  city: string;
  state: string;
  phones: string[];
  whatsapp: string;
  instagram: string;
  address: string;
  hours: string;
  mapEmbedUrl: string | null;
  aboutTitle: string;
  aboutText: string;
  mission: string;
  vision: string;
  valuesText: string;
};

const demoCompany: PublicCompany = {
  name: company.name,
  city: "Parauapebas",
  state: "Pará",
  phones: company.phones,
  whatsapp: company.whatsapp,
  instagram: company.instagram,
  address: company.address,
  hours: company.hours,
  mapEmbedUrl: null,
  aboutTitle: "Experiências que ficam para sempre",
  aboutText: "A Voya Turismo cria viagens nacionais e internacionais com ótimo custo-benefício, planejamento próximo e aluguel de roupas de frio.",
  mission: "Transformar planos em viagens completas, seguras e memoráveis.",
  vision: "Ser referência em atendimento personalizado e experiências de viagem em Parauapebas.",
  valuesText: "Transparência, cuidado, segurança, proximidade e paixão por viajar.",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

const reportedDatabaseFallbacks = new Set<string>();

function reportDatabaseFallback(scope: string, error: unknown) {
  if (process.env.NODE_ENV === "test" || reportedDatabaseFallbacks.has(scope)) return;
  reportedDatabaseFallbacks.add(scope);
  const reason = error instanceof Error ? error.message.split("\n")[0] : "banco indisponível";
  console.warn(`[Voya] ${scope}: usando o catálogo local (${reason}).`);
}

async function withDatabaseFallback<T>(scope: string, query: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (error) {
    reportDatabaseFallback(scope, error);
    return await fallback();
  }
}

function getDemoDestinations() {
  return demoPackages
    .map((item) => ({ id: item.slug, name: item.destination, slug: item.destinationSlug ?? item.destination, state: item.state, stateCode: item.stateCode ?? "BR", coverPath: item.image, packageCount: 1 }))
    .filter((item, index, all) => all.findIndex((candidate) => candidate.name === item.name) === index);
}

function getDemoHomeContent() {
  return {
    categories: [{ name: "Nacionais", slug: "nacional", count: 5 }, { name: "Internacionais", slug: "internacional", count: 1 }],
    testimonial: { name: "Mariana Souza", destination: "Carolina — MA", quote: "A equipe cuidou de tudo e fez a gente se sentir em casa. Foi a melhor escolha para conhecer a Chapada!", rating: 5 },
    gallery: [],
    faqs: [
      { id: "reserva", question: "Como faço para reservar?", answer: "Fale com nossa equipe pelo WhatsApp. Confirmaremos disponibilidade, datas e condições de pagamento antes de concluir a reserva." },
      { id: "parcelamento", question: "Posso parcelar minha viagem?", answer: "Sim. As opções de parcelamento e o valor total são apresentados em cada pacote e confirmados pela equipe no atendimento." },
      { id: "itens-inclusos", question: "O que está incluso nos pacotes?", answer: "Cada pacote possui sua própria relação de hospedagem, transporte, passeios e serviços inclusos. Consulte os detalhes do roteiro ou fale com a equipe." },
      { id: "roupas-de-frio", question: "Como funciona o aluguel de roupas de frio?", answer: "Escolha a peça, informe o número de diárias e envie a solicitação pelo WhatsApp. A equipe confirma tamanho, disponibilidade, retirada e devolução." },
    ],
  };
}

function getDemoPackageDetail(slug: string): PublicPackageDetail | null {
  const item = demoPackages.find((entry) => entry.slug === slug);
  if (!item) return null;
  const catalogItem = voyaPackageCatalog.find((entry) => entry.slug === slug);
  return { ...item, id: item.slug, city: item.city ?? item.destination, stateCode: item.stateCode ?? "BR", departureIso: item.departureIso ?? new Date().toISOString(), returnIso: catalogItem?.returnIso ?? new Date().toISOString(), description: catalogItem?.description ?? item.summary, boardingTime: "06:00", boardingLocation: "Marabá — ponto informado pela equipe", installmentValue: catalogItem?.installmentValue ?? null, installmentTotal: item.price, totalSpots: null, remainingSpots: null, showSpots: false, accommodation: "Hospedagem em apartamento duplo, conforme o anúncio.", transport: "Passagens aéreas de ida e volta por Marabá.", meals: "Café da manhã incluso.", guide: "Equipe Voya Turismo", childPolicy: "Consulte a equipe.", requiredDocuments: "Documento oficial com foto.", paymentMethods: "Parcelamento em até 12 vezes.", importantNotes: "Valor por pessoa em apartamento duplo. Consulte disponibilidade.", mapUrl: null, includedItems: catalogItem?.included ?? ["Acompanhamento da equipe"], excludedItems: ["Despesas pessoais e itens não mencionados"], itinerary: [{ id: "dia-1", dayNumber: 1, time: null, title: "Embarque e chegada", details: "Embarque, recepção da equipe e início da experiência." }], media: [{ id: "capa", type: "IMAGE", path: item.image, thumbnailPath: item.image, posterPath: null, altText: `Foto do destino do pacote ${item.name}` }], faqs: [], seoTitle: item.name, seoDescription: item.summary, shareImagePath: item.image };
}

export async function getPublicCompany(): Promise<PublicCompany> {
  if (isFrontendOnly) return demoCompany;
  await connection();
  return withDatabaseFallback("empresa", async () => {
    const settings = await prisma.companySettings.findUnique({ where: { singletonKey: "default" } });
    if (!settings) return demoCompany;
    return {
      name: settings.companyName,
      city: settings.city,
      state: settings.state,
      phones: [settings.phonePrimary, settings.phoneSecondary].filter((value): value is string => Boolean(value)),
      whatsapp: settings.whatsappNumber,
      instagram: settings.instagramHandle ?? "",
      address: settings.address,
      hours: settings.businessHours ?? "",
      mapEmbedUrl: settings.mapEmbedUrl,
      aboutTitle: settings.aboutTitle ?? demoCompany.aboutTitle,
      aboutText: settings.aboutText ?? demoCompany.aboutText,
      mission: settings.mission ?? demoCompany.mission,
      vision: settings.vision ?? demoCompany.vision,
      valuesText: settings.valuesText ?? demoCompany.valuesText,
    };
  }, () => demoCompany);
}

export async function getPublicPackages(): Promise<TravelPackage[]> {
  if (isFrontendOnly) return demoPackages;
  await connection();
  return withDatabaseFallback("pacotes", async () => {
    const settings = await getPublicCompany();
    const records = await prisma.package.findMany({
      where: publicPackageWhere(),
      orderBy: [{ featured: "desc" }, { featuredOrder: "asc" }, { departureAt: "asc" }],
      include: { category: { select: { name: true, slug: true } }, destination: { select: { name: true, slug: true } }, media: { orderBy: { sortOrder: "asc" } } },
    });
    return records.map((item) => {
    const cover = item.media.find((media) => media.isCover && media.type === "IMAGE") ?? item.media.find((media) => media.type === "IMAGE");
    const preview = item.media.find((media) => media.isPreview && media.type === "VIDEO");
    return {
      id: item.id,
      slug: item.slug,
      name: item.name,
      destination: item.destination.name,
      destinationSlug: item.destination.slug,
      city: item.city,
      state: item.state,
      stateCode: item.stateCode,
      category: item.category.name,
      categorySlug: item.category.slug,
      departure: dateFormatter.format(item.departureAt),
      departureIso: item.departureAt.toISOString(),
      returnDate: dateFormatter.format(item.returnAt),
      duration: `${item.durationDays} dia${item.durationDays === 1 ? "" : "s"}`,
      durationDays: item.durationDays,
      price: Number(item.cashPrice),
      installments: item.installmentValue ? `${item.installmentCount}x de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(item.installmentValue))}` : `até ${item.installmentCount}x`,
      image: cover?.path ?? cover?.thumbnailPath ?? "/media/destinations/ajuruteua.webp",
      availability: item.availabilityStatus,
      featured: item.featured,
      summary: item.summary,
      previewVideo: preview?.path,
      videoPoster: preview?.posterPath ?? preview?.thumbnailPath ?? cover?.path,
      waitingListEnabled: item.waitingListEnabled,
      whatsappNumber: settings.whatsapp,
    };
    });
  }, () => demoPackages);
}

export async function getPublicDestinations() {
  if (isFrontendOnly) return getDemoDestinations();
  await connection();
  return withDatabaseFallback("destinos", async () => {
    const records = await prisma.destination.findMany({ where: { active: true, deletedAt: null }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], include: { packages: { where: publicPackageWhere(), select: { id: true }, take: 100 } } });
    return records.filter((item) => item.packages.length > 0).map((item) => ({ id: item.id, name: item.name, slug: item.slug, state: item.state, stateCode: item.stateCode, coverPath: item.coverPath ?? "/media/destinations/ajuruteua.webp", packageCount: item.packages.length }));
  }, getDemoDestinations);
}

export type PublicClothingItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: "FEMININO" | "MASCULINO" | "INFANTIL" | "ACESSORIO";
  categoryLabel: string;
  imagePath: string | null;
  sizes: string | null;
  color: string | null;
  dailyPrice: number | null;
  quantity: number;
  featured: boolean;
};

const clothingCategoryLabels: Record<PublicClothingItem["category"], string> = {
  FEMININO: "Feminino",
  MASCULINO: "Masculino",
  INFANTIL: "Infantil",
  ACESSORIO: "Acessórios",
};

function getDemoClothing(): PublicClothingItem[] {
  return voyaClothingCatalog.map((item) => ({
    id: `mock-${item.slug}`,
    name: item.name,
    slug: item.slug,
    description: item.description,
    category: item.category,
    categoryLabel: clothingCategoryLabels[item.category],
    imagePath: item.imagePath,
    sizes: item.sizes,
    color: item.color,
    dailyPrice: item.dailyPrice,
    quantity: item.quantity,
    featured: item.featured,
  }));
}

function mapClothingRecord(item: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: PublicClothingItem["category"];
  imagePath: string | null;
  sizes: string | null;
  color: string | null;
  dailyPrice: { toString(): string } | number | null;
  quantity: number;
  featured: boolean;
}): PublicClothingItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    category: item.category,
    categoryLabel: clothingCategoryLabels[item.category],
    imagePath: item.imagePath,
    sizes: item.sizes,
    color: item.color,
    dailyPrice: item.dailyPrice == null ? null : Number(item.dailyPrice),
    quantity: item.quantity,
    featured: item.featured,
  };
}

export async function getPublicClothing(): Promise<PublicClothingItem[]> {
  if (isFrontendOnly) return getDemoClothing();
  await connection();
  return withDatabaseFallback("roupas", async () => {
    const records = await prisma.clothingItem.findMany({
      where: { active: true, deletedAt: null },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
    });
    return records.map(mapClothingRecord);
  }, getDemoClothing);
}

export async function getPublicClothingBySlug(slug: string): Promise<PublicClothingItem | null> {
  const demoItem = () => getDemoClothing().find((item) => item.slug === slug) ?? null;
  if (isFrontendOnly) return demoItem();
  await connection();
  return withDatabaseFallback(`roupa ${slug}`, async () => {
    const item = await prisma.clothingItem.findFirst({ where: { slug, active: true, deletedAt: null } });
    return item ? mapClothingRecord(item) : null;
  }, demoItem);
}

export async function getPublicHomeContent() {
  if (isFrontendOnly) return getDemoHomeContent();
  await connection();
  return withDatabaseFallback("conteúdo da página inicial", async () => {
    const now = new Date();
    const [categories, testimonial, faqs] = await Promise.all([
      prisma.packageCategory.findMany({ where: { active: true, deletedAt: null }, orderBy: { sortOrder: "asc" }, include: { _count: { select: { packages: { where: publicPackageWhere(now) } } } } }),
      prisma.testimonial.findFirst({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }] }),
      prisma.faq.findMany({ where: { active: true, scope: "GENERAL" }, orderBy: { sortOrder: "asc" }, take: 8 }),
    ]);
    return {
      categories: categories.filter((item) => item._count.packages > 0).map((item) => ({ name: item.name, slug: item.slug, count: item._count.packages })),
      testimonial: testimonial ? { name: testimonial.name, destination: testimonial.destination ?? "Viajante Voya", quote: testimonial.quote, rating: testimonial.rating } : null,
      gallery: [],
      faqs: faqs.map(({ id, question, answer }) => ({ id, question, answer })),
    };
  }, getDemoHomeContent);
}

export type PublicPackageDetail = TravelPackage & {
  description: string;
  city: string;
  stateCode: string;
  departureIso: string;
  returnIso: string;
  boardingTime: string | null;
  boardingLocation: string | null;
  installmentValue: number | null;
  installmentTotal: number | null;
  totalSpots: number | null;
  remainingSpots: number | null;
  showSpots: boolean;
  accommodation: string | null;
  transport: string | null;
  meals: string | null;
  guide: string | null;
  childPolicy: string | null;
  requiredDocuments: string | null;
  paymentMethods: string | null;
  importantNotes: string | null;
  mapUrl: string | null;
  includedItems: string[];
  excludedItems: string[];
  itinerary: Array<{ id: string; dayNumber: number | null; time: string | null; title: string; details: string }>;
  media: Array<{ id: string; type: "IMAGE" | "VIDEO"; path: string; thumbnailPath: string | null; posterPath: string | null; altText: string | null }>;
  faqs: Array<{ id: string; question: string; answer: string }>;
  seoTitle: string | null;
  seoDescription: string | null;
  shareImagePath: string | null;
};

export async function getPublicPackageBySlug(slug: string, countView = false): Promise<PublicPackageDetail | null> {
  if (isFrontendOnly) return getDemoPackageDetail(slug);
  await connection();
  return withDatabaseFallback(`pacote ${slug}`, async () => {
    const record = await prisma.package.findFirst({
    where: { slug, ...publicPackageWhere() },
    include: {
      category: { select: { name: true, slug: true } },
      destination: { select: { name: true, slug: true } },
      media: { orderBy: { sortOrder: "asc" } },
      includedItems: { orderBy: { sortOrder: "asc" } },
      excludedItems: { orderBy: { sortOrder: "asc" } },
      itinerary: { orderBy: { sortOrder: "asc" } },
      faqs: { where: { active: true }, orderBy: { sortOrder: "asc" } },
    },
    });
    if (!record) return null;
    const settings = await getPublicCompany();
    if (countView) await prisma.package.update({ where: { id: record.id }, data: { viewCount: { increment: 1 } } });
    const cover = record.media.find((media) => media.isCover && media.type === "IMAGE") ?? record.media.find((media) => media.type === "IMAGE");
    const preview = record.media.find((media) => media.isPreview && media.type === "VIDEO");
    return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    destination: record.destination.name,
    destinationSlug: record.destination.slug,
    city: record.city,
    state: record.state,
    stateCode: record.stateCode,
    category: record.category.name,
    categorySlug: record.category.slug,
    departure: dateFormatter.format(record.departureAt),
    departureIso: record.departureAt.toISOString(),
    returnDate: dateFormatter.format(record.returnAt),
    returnIso: record.returnAt.toISOString(),
    duration: `${record.durationDays} dia${record.durationDays === 1 ? "" : "s"}`,
    durationDays: record.durationDays,
    price: Number(record.cashPrice),
    installments: record.installmentValue ? `${record.installmentCount}x de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(record.installmentValue))}` : `até ${record.installmentCount}x`,
    installmentValue: record.installmentValue ? Number(record.installmentValue) : null,
    installmentTotal: record.installmentTotal ? Number(record.installmentTotal) : null,
    image: cover?.path ?? "/media/destinations/ajuruteua.webp",
    previewVideo: preview?.path,
    videoPoster: preview?.posterPath ?? preview?.thumbnailPath ?? cover?.path,
    availability: record.availabilityStatus,
    featured: record.featured,
    summary: record.summary,
    description: record.description,
    boardingTime: record.boardingTime,
    boardingLocation: record.boardingLocation,
    totalSpots: record.totalSpots,
    remainingSpots: record.remainingSpots,
    showSpots: record.showSpots,
    accommodation: record.accommodation,
    transport: record.transport,
    meals: record.meals,
    guide: record.guide,
    childPolicy: record.childPolicy,
    requiredDocuments: record.requiredDocuments,
    paymentMethods: record.paymentMethods,
    importantNotes: record.importantNotes,
    mapUrl: record.mapUrl,
    waitingListEnabled: record.waitingListEnabled,
    whatsappNumber: settings.whatsapp,
    includedItems: record.includedItems.map((item) => item.text),
    excludedItems: record.excludedItems.map((item) => item.text),
    itinerary: record.itinerary.map(({ id, dayNumber, time, title, details }) => ({ id, dayNumber, time, title, details })),
    media: record.media.map(({ id, type, path, thumbnailPath, posterPath, altText }) => ({ id, type, path, thumbnailPath, posterPath, altText })),
    faqs: record.faqs.map(({ id, question, answer }) => ({ id, question, answer })),
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    shareImagePath: record.shareImagePath,
    };
  }, () => getDemoPackageDetail(slug));
}
