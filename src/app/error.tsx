"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="route-error" role="alert">
      <span><AlertTriangle /></span>
      <h1>Não foi possível carregar esta página</h1>
      <p>Ocorreu uma falha temporária. Tente novamente ou volte para o início.</p>
      <div><button className="button button-primary" type="button" onClick={retry}><RotateCcw /> Tentar novamente</button><Link className="button button-secondary" href="/">Voltar ao início</Link></div>
    </main>
  );
}
