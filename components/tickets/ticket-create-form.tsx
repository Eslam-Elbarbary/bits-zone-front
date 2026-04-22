import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type TicketCreateFormSource = "contact" | "new-ticket";

interface TicketCreateFormProps {
  action: (formData: FormData) => Promise<void>;
  source?: TicketCreateFormSource;
  cancelHref: string;
  cancelLabel?: string;
  submitLabel?: string;
  /** Prefix for `id` / `htmlFor` to avoid duplicate IDs if multiple instances mount (unlikely). */
  fieldIdPrefix?: string;
}

export function TicketCreateForm({
  action,
  source = "new-ticket",
  cancelHref,
  cancelLabel = "إلغاء",
  submitLabel = "إرسال التذكرة",
  fieldIdPrefix = "ticket",
}: TicketCreateFormProps) {
  const p = fieldIdPrefix;

  return (
    <form action={action} className="space-y-6">
      {source === "contact" ? <input type="hidden" name="ticket_form_source" value="contact" /> : null}

      <div className="space-y-2">
        <Label htmlFor={`${p}-subject`}>العنوان</Label>
        <Input
          id={`${p}-subject`}
          name="subject"
          required
          maxLength={255}
          placeholder="مثال: استفسار عن الطلب، مشكلة في الدفع، اقتراح…"
          className="rounded-xl"
        />
        <p className="text-[11px] text-muted-foreground">حتى 255 حرفاً — يظهر في قائمة تذاكرك.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${p}-description`}>الوصف التفصيلي</Label>
        <textarea
          id={`${p}-description`}
          name="description"
          required
          rows={6}
          placeholder="اشرح طلبك أو المشكلة، الخطوات التي جرّبتها، وأرقام الطلبات أو المنتجات إن وُجدت."
          className={cn(
            "flex min-h-[140px] w-full resize-y rounded-xl border border-input bg-background/80 px-3 py-2 text-sm shadow-sm outline-none transition-[color,box-shadow,border-color] placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/15 disabled:opacity-50"
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${p}-attachments`}>مرفقات (اختياري)</Label>
        <Input id={`${p}-attachments`} name="attachments" type="file" multiple className="cursor-pointer rounded-xl" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          صيغ مدعومة شائعاً: PDF، Word، JPG، PNG — حجم معقول لكل ملف (راجع سياسة الخادم؛ غالباً حتى 2 ميجابايت لكل
          مرفق).
        </p>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-sky-100/80 pt-4">
        <Button type="button" variant="outline" className="rounded-xl" asChild>
          <Link href={cancelHref}>{cancelLabel}</Link>
        </Button>
        <Button type="submit" className="rounded-xl px-8 font-bold shadow-md">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
