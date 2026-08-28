import Link from "next/link";
import { Compass, Home, Phone, Shirt } from "lucide-react";

const items = [
  { label: "Início", href: "/", icon: Home },
  { label: "Pacotes", href: "/pacotes", icon: Compass },
  { label: "Roupas", href: "/roupas", icon: Shirt },
  { label: "Contato", href: "/contato", icon: Phone },
];

export function MobileBar() {
  return (
    <nav className="mobile-bar" aria-label="Atalhos do site">
      {items.map(({ label, href, icon: Icon }) => (
        <Link key={href} href={href}><Icon size={21} /><span>{label}</span></Link>
      ))}
    </nav>
  );
}
