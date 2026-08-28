import { CollectionManager, type CollectionRecord } from "@/components/admin/collection-manager";
import { prisma } from "@/lib/prisma";

export default async function ClothingAdminPage() {
  const records = await prisma.clothingItem.findMany({
    where: { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return <CollectionManager
    entity="roupas"
    title="Roupas de frio"
    singular="Peça"
    description="Cadastre casacos, roupas térmicas e acessórios disponíveis para aluguel."
    records={records.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      category: item.category,
      imagePath: item.imagePath,
      sizes: item.sizes,
      color: item.color,
      dailyPrice: item.dailyPrice == null ? null : Number(item.dailyPrice),
      quantity: item.quantity,
      active: item.active,
      featured: item.featured,
      sortOrder: item.sortOrder,
    })) as CollectionRecord[]}
    columns={[
      { key: "name", label: "Peça" },
      { key: "category", label: "Categoria", format: "clothingCategory" },
      { key: "sizes", label: "Tamanhos" },
      { key: "quantity", label: "Estoque" },
      { key: "dailyPrice", label: "Diária", format: "currency" },
      { key: "active", label: "Status", format: "active" },
    ]}
    fields={[
      { key: "name", label: "Nome da peça", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "category", label: "Categoria", type: "select", required: true, defaultValue: "MASCULINO", options: [
        { value: "MASCULINO", label: "Masculino" },
        { value: "FEMININO", label: "Feminino" },
        { value: "ACESSORIO", label: "Acessórios" },
        { value: "INFANTIL", label: "Infantil" },
      ] },
      { key: "sizes", label: "Tamanhos", placeholder: "Ex.: P, M, G, GG" },
      { key: "color", label: "Cor" },
      { key: "quantity", label: "Quantidade disponível", type: "number", min: 0, defaultValue: 0 },
      { key: "dailyPrice", label: "Valor da diária (R$)", type: "number", min: 0, step: 0.01 },
      { key: "imagePath", label: "Imagem (caminho ou URL)", placeholder: "/uploads/roupas/casaco.webp", wide: true },
      { key: "description", label: "Descrição", type: "textarea", wide: true },
      { key: "sortOrder", label: "Ordem de exibição", type: "number", min: 0, defaultValue: 0 },
      { key: "active", label: "Disponibilidade", type: "checkbox", defaultValue: true, checkboxLabel: "Ativa e disponível no catálogo" },
      { key: "featured", label: "Destaque", type: "checkbox", defaultValue: false, checkboxLabel: "Exibir como destaque" },
    ]}
  />;
}
