import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand-logo" aria-label="Voya Turismo — início">
      <span className={compact ? "brand-mark compact" : "brand-mark"}>
        <Image
          src="/brand/voya-mark-640.png"
          alt="Símbolo da Voya Turismo"
          fill
          sizes={compact ? "44px" : "56px"}
          priority
        />
      </span>
      <span className="brand-copy">
        <strong>VOYA</strong>
        <small>TURISMO</small>
      </span>
    </Link>
  );
}
