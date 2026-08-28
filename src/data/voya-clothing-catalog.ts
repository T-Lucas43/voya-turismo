export type VoyaClothingCatalogItem = {
  slug: string;
  name: string;
  description: string;
  category: "MASCULINO" | "FEMININO" | "ACESSORIO" | "INFANTIL";
  imagePath: string;
  sizes: string;
  color: string;
  dailyPrice: number;
  quantity: number;
  featured: boolean;
  sortOrder: number;
};

export const voyaClothingCatalog: VoyaClothingCatalogItem[] = [
  {
    slug: "jaqueta-puffer-azul-masculina",
    name: "Jaqueta Puffer Azul",
    description: "Casaco térmico acolchoado com capuz, ideal para neve, serra e destinos de inverno intenso.",
    category: "MASCULINO",
    imagePath: "/media/clothing-products/jaqueta-puffer-azul-masculina.png",
    sizes: "P, M, G e GG",
    color: "Azul royal",
    dailyPrice: 32,
    quantity: 8,
    featured: true,
    sortOrder: 0,
  },
  {
    slug: "jaqueta-ski-preta-masculina",
    name: "Jaqueta Ski Impermeável",
    description: "Jaqueta técnica corta-vento e impermeável, com capuz e bolsos protegidos.",
    category: "MASCULINO",
    imagePath: "/media/clothing-products/jaqueta-ski-preta-masculina.png",
    sizes: "M, G e GG",
    color: "Preto",
    dailyPrice: 35,
    quantity: 6,
    featured: false,
    sortOrder: 1,
  },
  {
    slug: "casaco-la-camel-feminino",
    name: "Casaco de Lã Camel",
    description: "Casaco longo e elegante com cinto, indicado para temperaturas amenas e frias.",
    category: "FEMININO",
    imagePath: "/media/clothing-products/casaco-la-camel-feminino.png",
    sizes: "P, M e G",
    color: "Camel",
    dailyPrice: 34,
    quantity: 7,
    featured: true,
    sortOrder: 2,
  },
  {
    slug: "jaqueta-puffer-off-white-feminina",
    name: "Jaqueta Puffer Off-white",
    description: "Modelo leve e térmico com acabamento acetinado e gola alta para proteger do vento.",
    category: "FEMININO",
    imagePath: "/media/clothing-products/jaqueta-puffer-off-white-feminina.png",
    sizes: "PP, P, M e G",
    color: "Off-white",
    dailyPrice: 32,
    quantity: 9,
    featured: true,
    sortOrder: 3,
  },
  {
    slug: "kit-acessorios-inverno-rosa",
    name: "Kit Acessórios de Inverno",
    description: "Conjunto com protetor de orelhas, cachecol e luvas em tricô macio.",
    category: "ACESSORIO",
    imagePath: "/media/clothing-products/kit-acessorios-rosa.png",
    sizes: "Tamanho único",
    color: "Rosa blush",
    dailyPrice: 18,
    quantity: 12,
    featured: false,
    sortOrder: 4,
  },
  {
    slug: "jaqueta-infantil-marinho",
    name: "Jaqueta Infantil com Capuz",
    description: "Jaqueta infantil acolchoada, confortável e forrada para manter os pequenos aquecidos.",
    category: "INFANTIL",
    imagePath: "/media/clothing-products/jaqueta-infantil-marinho.png",
    sizes: "2, 4, 6, 8 e 10",
    color: "Azul-marinho",
    dailyPrice: 24,
    quantity: 10,
    featured: true,
    sortOrder: 5,
  },
];
