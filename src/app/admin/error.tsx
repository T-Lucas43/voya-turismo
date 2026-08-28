"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="route-error route-error-admin" role="alert">
      <span><AlertTriangle /></span>
      <h1>O painel encontrou uma falha</h1>
      <p>Nenhuma alteração foi descartada. Tente carregar esta área novamente.</p>
      <div><button className="button button-primary" type="button" onClick={retry}><RotateCcw /> Tentar novamente</button><Link className="button button-secondary" href="/admin">Voltar ao painel</Link></div>
    </div>
  );
}
