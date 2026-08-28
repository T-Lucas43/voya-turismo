"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MessageCircle, Minus, Plus } from "lucide-react";
import { formatCurrency, whatsappUrl } from "@/data/demo";

type ClothingRentalCardProps = {
  name: string;
  sizes: string | null;
  color: string | null;
  dailyPrice: number | null;
  whatsappNumber: string;
};

const clampDays = (value: number) => Math.min(30, Math.max(1, Math.round(value) || 1));

export function ClothingRentalCard({ name, sizes, color, dailyPrice, whatsappNumber }: ClothingRentalCardProps) {
  const [days, setDays] = useState(3);
  const total = dailyPrice == null ? null : dailyPrice * days;
  const message = useMemo(() => [
    `Olá! Tenho interesse em alugar ${name}.`,
    `Período desejado: ${days} diária${days === 1 ? "" : "s"}.`,
    `Tamanho(s): ${sizes ?? "a confirmar"}.`,
    `Cor: ${color ?? "a confirmar"}.`,
    total == null ? "Valor: gostaria de consultar." : `Valor estimado: ${formatCurrency(total)} (${formatCurrency(dailyPrice ?? 0)} por diária).`,
    "Pode confirmar a disponibilidade e me orientar sobre a reserva?",
  ].join("\n"), [color, dailyPrice, days, name, sizes, total]);

  return <aside className="booking-card clothing-booking-card">
    <span>Valor da diária</span>
    <strong>{dailyPrice == null ? "Sob consulta" : formatCurrency(dailyPrice)}</strong>
    <small>por peça</small>
    <div className="divider" />
    <label className="rental-days-label" htmlFor="rental-days"><CalendarDays size={18} /> Número de diárias</label>
    <div className="rental-days-control">
      <button type="button" onClick={() => setDays((value) => clampDays(value - 1))} aria-label="Diminuir número de diárias"><Minus /></button>
      <input id="rental-days" type="number" min="1" max="30" inputMode="numeric" value={days} onChange={(event) => setDays(clampDays(Number(event.target.value)))} aria-label="Número de diárias" />
      <button type="button" onClick={() => setDays((value) => clampDays(value + 1))} aria-label="Aumentar número de diárias"><Plus /></button>
    </div>
    {total != null && <div className="rental-total"><span>Total estimado</span><strong>{formatCurrency(total)}</strong><small>{days} diária{days === 1 ? "" : "s"}</small></div>}
    <a className="button button-gold button-block" href={whatsappUrl(message, whatsappNumber)} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Consultar disponibilidade</a>
    <small className="booking-help">A mensagem será aberta no WhatsApp com a peça e as diárias escolhidas.</small>
  </aside>;
}
