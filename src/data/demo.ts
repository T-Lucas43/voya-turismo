import { voyaPackageCatalog } from "@/data/voya-package-catalog";

export type Availability = "AVAILABLE" | "FEW_SPOTS" | "SOLD_OUT" | "CANCELLED";

export type TravelPackage = {
  id?: string;
  slug: string;
  name: string;
  destination: string;
  destinationSlug?: string;
  city?: string;
  state: string;
  stateCode?: string;
  category: string;
  categorySlug?: string;
  departure: string;
  departureIso?: string;
  returnDate: string;
  duration: string;
  durationDays?: number;
  price: number;
  installments: string;
  image: string;
  availability: Availability;
  featured?: boolean;
  summary: string;
  previewVideo?: string;
  videoPoster?: string;
  waitingListEnabled?: boolean;
  whatsappNumber?: string;
};

export const company = {
  name: "Voya Turismo",
  city: "Parauapebas – PA",
  phones: ["(94) 99101-7107"],
  whatsapp: "message/LVQYCRLRXG7LL1",
  instagram: "@voya.turismo",
  address: "Esplanada, Parauapebas - PA",
  hours: "Atendimento personalizado sob consulta",
};

const demoDateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

export const packages: TravelPackage[] = voyaPackageCatalog.map((item, index) => ({
  slug: item.slug,
  name: item.name,
  destination: item.destination,
  destinationSlug: item.destinationSlug,
  city: item.city,
  state: item.state,
  stateCode: item.stateCode,
  category: item.categoryName,
  categorySlug: item.categorySlug,
  departure: demoDateFormatter.format(new Date(item.departureIso)),
  departureIso: item.departureIso,
  returnDate: demoDateFormatter.format(new Date(item.returnIso)),
  duration: `${item.durationDays} dias`,
  durationDays: item.durationDays,
  price: item.installmentValue * 12,
  installments: `12x de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.installmentValue)}`,
  image: item.image,
  availability: "AVAILABLE",
  featured: index < 4,
  summary: item.summary,
  waitingListEnabled: true,
}));

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

export const whatsappUrl = (message: string, number = company.whatsapp) => {
  if (number.startsWith("message/")) return `https://wa.me/${number}`;
  if (/^https?:\/\//.test(number)) return number;
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
};
