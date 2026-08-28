import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { voyaPackageCatalog } from "../src/data/voya-package-catalog";

async function main() {
  const activeSlugs = voyaPackageCatalog.map((item) => item.slug);

  await prisma.package.updateMany({
    where: { slug: { notIn: activeSlugs } },
    data: { publicationStatus: "ARCHIVED", featured: false, featuredOrder: null, publicationEndsAt: new Date(), deletedAt: new Date() },
  });

  for (const [index, item] of voyaPackageCatalog.entries()) {
    const category = await prisma.packageCategory.upsert({
      where: { slug: item.categorySlug },
      update: { name: item.categoryName, description: `Pacotes ${item.categoryName.toLowerCase()}s da Voya Turismo.`, active: true, deletedAt: null, sortOrder: item.categorySlug === "nacional" ? 0 : 1 },
      create: { name: item.categoryName, slug: item.categorySlug, description: `Pacotes ${item.categoryName.toLowerCase()}s da Voya Turismo.`, active: true, sortOrder: item.categorySlug === "nacional" ? 0 : 1 },
    });
    const destination = await prisma.destination.upsert({
      where: { slug: item.destinationSlug },
      update: { name: item.destination, city: item.city, state: item.state, stateCode: item.stateCode, description: item.summary, coverPath: item.image, active: true, deletedAt: null, sortOrder: index },
      create: { name: item.destination, slug: item.destinationSlug, city: item.city, state: item.state, stateCode: item.stateCode, description: item.summary, coverPath: item.image, active: true, sortOrder: index },
    });
    const installmentTotal = item.installmentValue * 12;
    const packageData = {
      name: item.name,
      summary: item.summary,
      description: item.description,
      categoryId: category.id,
      destinationId: destination.id,
      city: item.city,
      state: item.state,
      stateCode: item.stateCode,
      departureAt: new Date(item.departureIso),
      returnAt: new Date(item.returnIso),
      boardingTime: "06:00",
      boardingLocation: "Marabá — ponto informado pela equipe",
      durationDays: item.durationDays,
      cashPrice: installmentTotal.toFixed(2),
      installmentCount: 12,
      installmentValue: item.installmentValue.toFixed(2),
      installmentTotal: installmentTotal.toFixed(2),
      totalSpots: null,
      remainingSpots: null,
      showSpots: false,
      accommodation: "Hospedagem em apartamento duplo, conforme o anúncio.",
      transport: "Passagens aéreas de ida e volta por Marabá.",
      meals: "Café da manhã incluso.",
      guide: "Equipe Voya Turismo",
      childPolicy: "Consulte a equipe para condições infantis.",
      requiredDocuments: "Documento oficial com foto e documentação exigida pelo destino.",
      paymentMethods: "Parcelamento em até 12 vezes, conforme condições do pacote.",
      importantNotes: "Valor por pessoa em apartamento duplo. Consulte disponibilidade e condições atualizadas.",
      publicationStatus: "PUBLISHED" as const,
      availabilityStatus: "AVAILABLE" as const,
      featured: index < 4,
      featuredOrder: index < 4 ? index + 1 : null,
      waitingListEnabled: true,
      publishedAt: new Date(),
      publicationEndsAt: null,
      deletedAt: null,
      seoTitle: item.name.slice(0, 70),
      seoDescription: item.summary.slice(0, 170),
      shareImagePath: item.image,
    };

    const travelPackage = await prisma.package.upsert({
      where: { slug: item.slug },
      update: packageData,
      create: { slug: item.slug, ...packageData },
    });

    await prisma.packageMedia.deleteMany({ where: { packageId: travelPackage.id } });
    await prisma.packageMedia.create({ data: { packageId: travelPackage.id, type: "IMAGE", path: item.image, thumbnailPath: item.image, altText: `Fotografia do destino ${item.destination}`, mimeType: "image/webp", sizeBytes: 0, width: 1600, height: 900, isCover: true, sortOrder: 0 } });
    await prisma.packageIncludedItem.deleteMany({ where: { packageId: travelPackage.id } });
    await prisma.packageIncludedItem.createMany({ data: item.included.map((text, sortOrder) => ({ packageId: travelPackage.id, text, sortOrder })) });
    await prisma.packageExcludedItem.deleteMany({ where: { packageId: travelPackage.id } });
    await prisma.packageExcludedItem.createMany({ data: [{ packageId: travelPackage.id, text: "Despesas pessoais e itens não mencionados", sortOrder: 0 }] });
    await prisma.itineraryItem.deleteMany({ where: { packageId: travelPackage.id } });
    await prisma.itineraryItem.createMany({ data: [
      { packageId: travelPackage.id, dayNumber: 1, title: "Embarque e chegada", details: "Apresentação no ponto informado, embarque e início da experiência com a Voya.", sortOrder: 0 },
      { packageId: travelPackage.id, dayNumber: item.durationDays, title: "Último dia e retorno", details: "Encerramento da programação e viagem de retorno.", sortOrder: 1 },
    ] });
  }

  await prisma.companySettings.update({ where: { singletonKey: "default" }, data: { phonePrimary: "(94) 99101-7107", whatsappNumber: "5594991017107" } });
  await prisma.adminUser.updateMany({ where: { name: { contains: "D'Hages" } }, data: { name: "Administrador Voya" } });
  await prisma.adminUser.updateMany({ where: { name: { contains: "D’Hages" } }, data: { name: "Administrador Voya" } });
  const published = await prisma.package.count({ where: { publicationStatus: "PUBLISHED", deletedAt: null } });
  console.log(`Pacotes Voya publicados: ${published}`);
}

main().finally(() => prisma.$disconnect());
