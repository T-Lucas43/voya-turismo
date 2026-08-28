export type VoyaPackageCatalogItem = {
  slug: string;
  name: string;
  destination: string;
  destinationSlug: string;
  city: string;
  state: string;
  stateCode: string;
  categoryName: "Nacional" | "Internacional";
  categorySlug: "nacional" | "internacional";
  departureIso: string;
  returnIso: string;
  durationDays: number;
  installmentValue: number;
  image: string;
  summary: string;
  description: string;
  included: string[];
};

export const voyaPackageCatalog: VoyaPackageCatalogItem[] = [
  {
    slug: "jericoacoara-fortaleza",
    name: "Jericoacoara + Fortaleza",
    destination: "Jericoacoara e Fortaleza",
    destinationSlug: "jericoacoara-fortaleza-ce",
    city: "Fortaleza",
    state: "Ceará",
    stateCode: "CE",
    categoryName: "Nacional",
    categorySlug: "nacional",
    departureIso: "2027-03-08T06:00:00-03:00",
    returnIso: "2027-03-14T21:00:00-03:00",
    durationDays: 7,
    installmentValue: 199,
    image: "/media/packages-voya/photos/jericoacoara-fortaleza.webp",
    summary: "Jericoacoara e Fortaleza em uma viagem completa pelo litoral do Ceará.",
    description: "Pacote aéreo de ida e volta por Marabá, com três diárias em Jericoacoara, três diárias em Fortaleza e café da manhã incluso.",
    included: ["Aéreo ida e volta por Marabá", "3 diárias em Jericoacoara", "3 diárias em Fortaleza", "Café da manhã incluso"],
  },
  {
    slug: "gramado-balneario-beto-carrero",
    name: "Gramado + Balneário Camboriú + Beto Carrero",
    destination: "Gramado e Balneário Camboriú",
    destinationSlug: "gramado-balneario-beto-carrero",
    city: "Gramado",
    state: "Rio Grande do Sul",
    stateCode: "RS",
    categoryName: "Nacional",
    categorySlug: "nacional",
    departureIso: "2027-05-10T06:00:00-03:00",
    returnIso: "2027-05-19T21:00:00-03:00",
    durationDays: 10,
    installmentValue: 291,
    image: "/media/packages-voya/photos/gramado.webp",
    summary: "Serra Gaúcha, litoral catarinense e um dia de diversão no Beto Carrero.",
    description: "Pacote aéreo de ida e volta por Marabá, com hospedagem em Gramado e Balneário Camboriú, passeio ao Beto Carrero e café da manhã.",
    included: ["Aéreo ida e volta por Marabá", "Hospedagem em Gramado", "Hospedagem em Balneário Camboriú", "Passeio ao Beto Carrero", "Café da manhã incluso"],
  },
  {
    slug: "maceio-maragogi-milagres",
    name: "Maceió + Maragogi + São Miguel dos Milagres",
    destination: "Maceió, Maragogi e Milagres",
    destinationSlug: "maceio-maragogi-milagres-al",
    city: "Maceió",
    state: "Alagoas",
    stateCode: "AL",
    categoryName: "Nacional",
    categorySlug: "nacional",
    departureIso: "2026-11-08T06:00:00-03:00",
    returnIso: "2026-11-14T21:00:00-03:00",
    durationDays: 7,
    installmentValue: 245,
    image: "/media/packages-voya/photos/maceio.webp",
    summary: "Águas cristalinas e praias inesquecíveis em três destinos de Alagoas.",
    description: "Pacote aéreo de ida e volta por Marabá, com hospedagem em Maceió e passeios para Maragogi e São Miguel dos Milagres.",
    included: ["Aéreo ida e volta por Marabá", "Hospedagem em Maceió", "Passeio em Maragogi", "Passeio em São Miguel dos Milagres", "Café da manhã incluso"],
  },
  {
    slug: "balneario-beto-carrero",
    name: "Balneário Camboriú + Beto Carrero",
    destination: "Balneário Camboriú",
    destinationSlug: "balneario-beto-carrero-sc",
    city: "Balneário Camboriú",
    state: "Santa Catarina",
    stateCode: "SC",
    categoryName: "Nacional",
    categorySlug: "nacional",
    departureIso: "2026-11-16T06:00:00-03:00",
    returnIso: "2026-11-21T21:00:00-03:00",
    durationDays: 6,
    installmentValue: 236,
    image: "/media/packages-voya/photos/balneario-camboriu.webp",
    summary: "Cinco diárias no litoral catarinense e um dia completo no Beto Carrero.",
    description: "Pacote aéreo de ida e volta por Marabá, cinco diárias em Balneário Camboriú, passeio ao Beto Carrero e café da manhã incluso.",
    included: ["Aéreo ida e volta por Marabá", "5 diárias em Balneário Camboriú", "1 dia de passeio no Beto Carrero", "Café da manhã incluso"],
  },
  {
    slug: "santiago-temporada-de-neve",
    name: "Santiago — Temporada de Neve",
    destination: "Santiago",
    destinationSlug: "santiago-chile",
    city: "Santiago",
    state: "Chile",
    stateCode: "CL",
    categoryName: "Internacional",
    categorySlug: "internacional",
    departureIso: "2027-07-12T06:00:00-03:00",
    returnIso: "2027-07-17T21:00:00-03:00",
    durationDays: 6,
    installmentValue: 421,
    image: "/media/packages-voya/photos/santiago-neve.webp",
    summary: "Cinco diárias em Santiago durante a temporada de neve no Chile.",
    description: "Pacote aéreo de ida e volta por Marabá, cinco diárias em Santiago, seguro viagem e café da manhã inclusos.",
    included: ["Aéreo ida e volta por Marabá", "5 diárias em Santiago", "Seguro viagem incluso", "Café da manhã incluso"],
  },
  {
    slug: "natal-pipa-maracajau-genipabu",
    name: "Natal + Pipa + Maracajaú + Genipabu",
    destination: "Natal e litoral potiguar",
    destinationSlug: "natal-pipa-maracajau-genipabu-rn",
    city: "Natal",
    state: "Rio Grande do Norte",
    stateCode: "RN",
    categoryName: "Nacional",
    categorySlug: "nacional",
    departureIso: "2026-11-23T06:00:00-03:00",
    returnIso: "2026-11-29T21:00:00-03:00",
    durationDays: 7,
    installmentValue: 245,
    image: "/media/packages-voya/photos/natal.webp",
    summary: "Natal com passeios para Pipa, Maracajaú e Genipabu em uma única viagem.",
    description: "Pacote aéreo de ida e volta por Marabá, hospedagem em Natal, três passeios pelo litoral potiguar e café da manhã incluso.",
    included: ["Aéreo ida e volta por Marabá", "Hospedagem em Natal", "Passeio para Pipa", "Passeio para Maracajaú", "Passeio para Genipabu", "Café da manhã incluso"],
  },
];
