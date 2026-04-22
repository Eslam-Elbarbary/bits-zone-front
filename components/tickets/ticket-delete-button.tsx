"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteTicketFormAction } from "@/app/actions/tickets";
import { Button } from "@/components/ui/button";
import { alert } from "@/lib/notify";

export function TicketDeleteButton({ ticketId }: { ticketId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      className="gap-2"
      disabled={pending}
      onClick={() => {
        void (async () => {
          const ok = await alert.confirm({
            title: "حذف التذكرة؟",
            text: "سيتم حذف التذكرة نهائياً من نظام الدعم.",
            confirmText: "حذف",
            cancelText: "إلغاء",
          });
          if (!ok) return;
          startTransition(async () => {
            const fd = new FormData();
            fd.append("ticket_id", ticketId);
            await deleteTicketFormAction(fd);
          });
        })();
      }}
    >
      <Trash2 className="size-4" aria-hidden />
      {pending ? "جاري الحذف..." : "حذف التذكرة"}
    </Button>
  );
}
