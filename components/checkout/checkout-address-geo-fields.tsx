import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Optional latitude/longitude — matches Postman POST /api/addresses; server fills Riyadh defaults if empty. */
export function CheckoutAddressGeoFields({
  idPrefix,
  className,
}: {
  idPrefix: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-lat`} className="text-xs font-medium text-muted-foreground">
            خط العرض (اختياري)
          </Label>
          <Input
            id={`${idPrefix}-lat`}
            name="latitude"
            dir="ltr"
            className="font-mono text-sm"
            placeholder="24.7136"
            inputMode="decimal"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-lng`} className="text-xs font-medium text-muted-foreground">
            خط الطول (اختياري)
          </Label>
          <Input
            id={`${idPrefix}-lng`}
            name="longitude"
            dir="ltr"
            className="font-mono text-sm"
            placeholder="46.6753"
            inputMode="decimal"
            autoComplete="off"
          />
        </div>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        يُحسِّن دقة الشحن. إن تُرك الحقلان فارغين نُرسل إحداثياتاً تقريبية للرياض كما يتوقع الخادم.
      </p>
    </div>
  );
}
