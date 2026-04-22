import { ExternalLink, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VendorLocationDisplay } from "@/types/api";
import { cn } from "@/lib/utils";

function sortPrimaryFirst(locations: VendorLocationDisplay[]): VendorLocationDisplay[] {
  return [...locations].sort((a, b) => Number(!!b.isPrimary) - Number(!!a.isPrimary));
}

export function VendorStoreLocations({
  locations,
  className,
}: {
  locations: VendorLocationDisplay[];
  className?: string;
}) {
  const sorted = sortPrimaryFirst(locations);
  const count = sorted.length;

  return (
    <section
      className={cn(
        "rounded-3xl border border-sky-100/90 bg-gradient-to-b from-white via-sky-50/20 to-white p-6 shadow-sm ring-1 ring-sky-50/80 md:p-8",
        className
      )}
      aria-labelledby="vendor-locations-heading"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10">
            <MapPin className="size-5" aria-hidden />
          </span>
          <div>
            <h2 id="vendor-locations-heading" className="text-lg font-bold tracking-tight text-sky-950 md:text-xl">
              مواقع المتجر
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              عناوين الفروع ومعلومات التواصل كما ترد من خادم المتجر. يمكنك فتح الموقع على خرائط Google عند توفر
              الإحداثيات.
            </p>
          </div>
        </div>
        {count > 1 ? (
          <Badge variant="secondary" className="shrink-0 font-semibold tabular-nums">
            {count} موقع
          </Badge>
        ) : null}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.map((loc) => (
          <li key={loc.id}>
            <Card className="relative h-full overflow-hidden border-sky-100/90 shadow-sm ring-1 ring-sky-50 transition-shadow hover:shadow-md">
              <span
                className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-sky-500 via-primary to-papaya/90"
                aria-hidden
              />
              <CardHeader className="pb-2 ps-5 pt-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-base font-bold leading-snug text-sky-950">{loc.title}</CardTitle>
                  {loc.isPrimary ? (
                    <Badge className="border-0 bg-sky-600/10 text-[10px] font-bold text-sky-800 hover:bg-sky-600/10">
                      الرئيسي
                    </Badge>
                  ) : null}
                </div>
                <div className="space-y-1.5 text-start text-sm leading-relaxed text-sky-900/85">
                  {loc.lines.map((line, i) => (
                    <p key={i} className={cn(i === 0 ? "font-medium text-sky-950" : "text-muted-foreground")}>
                      {line}
                    </p>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 ps-5 pb-5">
                {loc.phone ? (
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Phone className="size-3.5 shrink-0 text-primary" aria-hidden />
                    <span className="tabular-nums tracking-tight" dir="ltr">
                      {loc.phone}
                    </span>
                  </p>
                ) : null}
                {loc.mapsUrl ? (
                  <Button asChild variant="outline" size="sm" className="w-full rounded-lg border-sky-200/80 font-semibold">
                    <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="ms-1 size-3.5 opacity-80" aria-hidden />
                      عرض على الخريطة
                    </a>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
