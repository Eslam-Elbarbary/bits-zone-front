import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (!raw) return null;

  return (
    <Link
      href={`https://wa.me/${raw}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-2 ring-transparent transition hover:bg-emerald-600 hover:ring-primary/40 md:bottom-8 md:right-8"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="size-7" />
    </Link>
  );
}
