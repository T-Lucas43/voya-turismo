import "dotenv/config";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { hash } from "argon2";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { databaseAdapterUrl } from "../src/lib/database-url";
import { voyaPackageCatalog } from "../src/data/voya-package-catalog";
import { voyaClothingCatalog } from "../src/data/voya-clothing-catalog";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(databaseAdapterUrl(databaseUrl)) });

const categorySeed = [
  ["Praias & ilhas", "praias-ilhas", "Roteiros de sol, mar, rios e ilhas."],
  ["Natureza", "natureza", "Experiências de contemplação e ecoturismo."],
  ["Aventura", "aventura", "Trilhas, cachoeiras e atividades ao ar livre."],
  ["Bate e volta", "bate-e-volta", "Passeios de um dia saindo de Belém."],
] as const;

const destinationSeed = [
  { name: "Ajuruteua", slug: "ajuruteua-pa", city: "Bragança", state: "Pará", stateCode: "PA", coverPath: "/media/destinations/ajuruteua.webp" },
  { name: "Bragança", slug: "braganca-pa", city: "Bragança", state: "Pará", stateCode: "PA", coverPath: "/media/destinations/mosqueiro.webp" },
  { name: "Ilha do Mosqueiro", slug: "mosqueiro-pa", city: "Belém", state: "Pará", stateCode: "PA", coverPath: "/media/destinations/alter-do-chao.webp" },
  { name: "Carolina", slug: "carolina-ma", city: "Carolina", state: "Maranhão", stateCode: "MA", coverPath: "/media/destinations/chapada-das-mesas.webp" },
  { name: "Salinas", slug: "salinopolis-pa", city: "Salinópolis", state: "Pará", stateCode: "PA", coverPath: "/media/destinations/salinas.webp" },
] as const;

async function main() {
  const configuredPassword = process.env.ADMIN_INITIAL_PASSWORD;
  const initialPassword = configuredPassword || randomBytes(18).toString("base64url");
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL ?? "admin@dhages.local";
  const passwordHash = await hash(initialPassword, { type: 2, memoryCost: 19456, timeCost: 3, parallelism: 1 });

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { name: process.env.ADMIN_INITIAL_NAME ?? "Administrador Voya", passwordHash, active: true, failedLoginCount: 0, lockedUntil: null },
    create: { name: process.env.ADMIN_INITIAL_NAME ?? "Administrador Voya", email: adminEmail.toLowerCase(), passwordHash, role: "OWNER" },
  });

  if (!configuredPassword) {
    const credentialDir = resolve("storage");
    await mkdir(credentialDir, { recursive: true });
    await writeFile(resolve(credentialDir, "dev-admin-credentials.txt"), `E-mail: ${adminEmail}\nSenha: ${initialPassword}\n`, { encoding: "utf8", mode: 0o600 });
  }

  const companySettingsData = {
    companyName: "Voya Turismo",
    city: "Parauapebas",
    state: "Pará",
      phonePrimary: "(94) 99101-7107",
    phoneSecondary: null,
    whatsappNumber: "message/LVQYCRLRXG7LL1",
    instagramHandle: "@voya.turismo",
    address: "Esplanada, Parauapebas - PA",
    businessHours: "Atendimento personalizado sob consulta",
    mapEmbedUrl: "https://maps.app.goo.gl/d8bqHyrkwRFXEaH68?g_st=ipc",
    aboutTitle: "Experiências que ficam para sempre",
    aboutText: "A Voya Turismo cria viagens nacionais e internacionais com ótimo custo-benefício, planejamento próximo e aluguel de roupas de frio.",
    mission: "Transformar planos em viagens completas, seguras e memoráveis.",
    vision: "Ser referência em atendimento personalizado e experiências de viagem em Parauapebas.",
    valuesText: "Transparência, cuidado, segurança, proximidade e paixão por viajar.",
    logoDarkPath: "/brand/voya-mark-640.png",
    logoLightPath: "/brand/voya-mark-640.png",
    defaultShareImagePath: "/media/hero-balneario-voya-4k.webp",
  };

  await prisma.companySettings.upsert({
    where: { singletonKey: "default" },
    update: companySettingsData,
    create: { singletonKey: "default", ...companySettingsData },
  });

  const categories = new Map<string, string>();
  for (let index = 0; index < categorySeed.length; index += 1) {
    const [name, slug, description] = categorySeed[index];
    const category = await prisma.packageCategory.upsert({
      where: { slug },
      update: { name, description, active: true, sortOrder: index },
      create: { name, slug, description, active: true, sortOrder: index },
    });
    categories.set(slug, category.id);
  }

  const destinations = new Map<string, string>();
  for (let index = 0; index < destinationSeed.length; index += 1) {
    const item = destinationSeed[index];
    const destination = await prisma.destination.upsert({
      where: { slug: item.slug },
      update: { ...item, active: true, sortOrder: index },
      create: { ...item, active: true, sortOrder: index, description: `Conheça ${item.name} com a Voya Turismo.` },
    });
    destinations.set(item.slug, destination.id);
  }

  for (const [index, item] of voyaPackageCatalog.entries()) {
    const category = await prisma.packageCategory.upsert({
      where: { slug: item.categorySlug },
      update: { name: item.categoryName, active: true, deletedAt: null, sortOrder: item.categorySlug === "nacional" ? 0 : 1 },
      create: { name: item.categoryName, slug: item.categorySlug, active: true, sortOrder: item.categorySlug === "nacional" ? 0 : 1 },
    });
    categories.set(item.categorySlug, category.id);
    const destination = await prisma.destination.upsert({
      where: { slug: item.destinationSlug },
      update: { name: item.destination, city: item.city, state: item.state, stateCode: item.stateCode, coverPath: item.image, active: true, deletedAt: null, sortOrder: index },
      create: { name: item.destination, slug: item.destinationSlug, city: item.city, state: item.state, stateCode: item.stateCode, coverPath: item.image, active: true, sortOrder: index },
    });
    destinations.set(item.destinationSlug, destination.id);
  }

  const packageSeeds = voyaPackageCatalog.map((item, index) => ({
    name: item.name, slug: item.slug, summary: item.summary, description: item.description, category: item.categorySlug, destination: item.destinationSlug,
    city: item.city, state: item.state, stateCode: item.stateCode, departureAt: new Date(item.departureIso), returnAt: new Date(item.returnIso), durationDays: item.durationDays,
    cashPrice: (item.installmentValue * 12).toFixed(2), installmentCount: 12, installmentValue: item.installmentValue.toFixed(2), installmentTotal: (item.installmentValue * 12).toFixed(2),
    totalSpots: null, remainingSpots: null, availabilityStatus: "AVAILABLE" as const, featured: index < 4, featuredOrder: index < 4 ? index + 1 : null, waitingListEnabled: true,
    image: item.image, included: item.included,
  }));

  for (const item of packageSeeds) {
    const categoryId = categories.get(item.category);
    const destinationId = destinations.get(item.destination);
    if (!categoryId || !destinationId) throw new Error(`Seed incompleto para ${item.slug}.`);

    await prisma.package.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name, summary: item.summary, description: item.description, categoryId, destinationId, city: item.city, state: item.state, stateCode: item.stateCode,
        departureAt: item.departureAt, returnAt: item.returnAt, durationDays: item.durationDays, cashPrice: item.cashPrice, installmentCount: item.installmentCount,
        installmentValue: item.installmentValue, installmentTotal: item.installmentTotal, totalSpots: item.totalSpots, remainingSpots: item.remainingSpots,
        availabilityStatus: item.availabilityStatus, featured: item.featured, featuredOrder: item.featuredOrder, waitingListEnabled: item.waitingListEnabled,
        publicationStatus: "PUBLISHED", publishedAt: new Date("2026-08-01T09:00:00-03:00"), publicationEndsAt: null, deletedAt: null, updatedById: admin.id,
      },
      create: {
        name: item.name, slug: item.slug, summary: item.summary, description: item.description, categoryId, destinationId, city: item.city, state: item.state, stateCode: item.stateCode,
        departureAt: item.departureAt, returnAt: item.returnAt, boardingTime: "06:00", boardingLocation: "Marabá — ponto informado pela equipe", durationDays: item.durationDays,
        cashPrice: item.cashPrice, installmentCount: item.installmentCount, installmentValue: item.installmentValue, installmentTotal: item.installmentTotal,
        totalSpots: item.totalSpots, remainingSpots: item.remainingSpots, showSpots: true, accommodation: "Hospedagem conforme categoria do pacote.", transport: "Transporte executivo climatizado.",
        meals: "Café da manhã quando indicado no roteiro.", guide: "Equipe Voya Turismo", childPolicy: "Consulte condições por faixa etária.", requiredDocuments: "Documento oficial com foto.",
        paymentMethods: "Pix, cartão e transferência, conforme condições do pacote.", publicationStatus: "PUBLISHED", availabilityStatus: item.availabilityStatus,
        featured: item.featured, featuredOrder: item.featuredOrder, waitingListEnabled: item.waitingListEnabled, publishedAt: new Date("2026-08-01T09:00:00-03:00"),
        seoTitle: item.name, seoDescription: item.summary, createdById: admin.id, updatedById: admin.id,
        media: {
          create: [{ type: "IMAGE", path: item.image, thumbnailPath: item.image, altText: `Fotografia do destino ${item.name}`, mimeType: "image/webp", sizeBytes: 0, width: 1600, height: 900, isCover: true, sortOrder: 0 }],
        },
        includedItems: { create: item.included.map((text, sortOrder) => ({ text, sortOrder })) },
        excludedItems: { create: [{ text: "Despesas pessoais", sortOrder: 0 }, { text: "Refeições não mencionadas", sortOrder: 1 }] },
        itinerary: { create: [{ dayNumber: 1, title: "Partida e boas-vindas", details: "Embarque, recepção da equipe e início das atividades.", sortOrder: 0 }, { dayNumber: item.durationDays, title: "Últimas experiências e retorno", details: "Programação final e retorno.", sortOrder: 1 }] },
      },
    });
  }

  for (const item of voyaClothingCatalog) {
    await prisma.clothingItem.upsert({
      where: { slug: item.slug },
      update: { ...item, active: true, deletedAt: null },
      create: { ...item, active: true },
    });
  }

  const faqSeed = [
    ["Como faço para reservar?", "Fale com nossa equipe pelo WhatsApp. Confirmaremos disponibilidade e condições de pagamento."],
    ["Posso parcelar?", "Sim. Cada pacote informa o número de parcelas e o valor total parcelado."],
    ["O que preciso levar?", "Enviamos uma lista antes da viagem, além dos documentos necessários informados no pacote."],
  ] as const;

  for (let index = 0; index < faqSeed.length; index += 1) {
    const [question, answer] = faqSeed[index];
    const existing = await prisma.faq.findFirst({ where: { question, scope: "GENERAL" } });
    if (!existing) await prisma.faq.create({ data: { scope: "GENERAL", question, answer, active: true, sortOrder: index } });
  }

  const testimonial = await prisma.testimonial.findFirst({ where: { name: "Mariana Souza" } });
  if (!testimonial) await prisma.testimonial.create({ data: { name: "Mariana Souza", destination: "Carolina — MA", quote: "A equipe cuidou de tudo e fez a gente se sentir em casa. Foi a melhor escolha para conhecer a Chapada!", rating: 5, active: true, sortOrder: 0, publishedAt: new Date() } });

  await prisma.auditLog.create({ data: { adminUserId: admin.id, action: "SEED_COMPLETED", entityType: "System", summary: "Dados iniciais de desenvolvimento verificados." } });
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exitCode = 1; });
