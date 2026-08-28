import { Image as ImageIcon } from "lucide-react";

export default function GalleryAdminPage() {
  return <div className="admin-content admin-list-page">
    <div className="admin-welcome"><div><span>Planejamento futuro</span><h1>Galeria de imagens</h1><p>Esta área está reservada para uma implementação futura e não aparece no site público.</p></div></div>
    <section className="admin-panel future-feature-card">
      <span><ImageIcon /></span>
      <div><h2>Implementação futura</h2><p>O cadastro, a organização e a publicação de galerias serão adicionados em uma próxima etapa do projeto.</p></div>
    </section>
  </div>;
}
