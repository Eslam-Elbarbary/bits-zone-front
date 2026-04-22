"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Flag, Star } from "lucide-react";
import { rateProductAction, reportProductAction } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";

export function ProductDetailEngagement({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [ratePending, setRatePending] = useState(false);

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [reportPending, setReportPending] = useState(false);

  async function onRate(e: React.FormEvent) {
    e.preventDefault();
    setRatePending(true);
    const fd = new FormData();
    fd.set("rating", String(rating));
    fd.set("comment", comment.trim());
    const r = await rateProductAction(String(productId), fd);
    setRatePending(false);
    if (!r.ok) {
      notify.actionError(r.error);
      return;
    }
    notify.success("شكراً لتقييمك");
    setComment("");
    router.refresh();
  }

  async function onReport(e: React.FormEvent) {
    e.preventDefault();
    setReportPending(true);
    const fd = new FormData();
    fd.set("reason", reason.trim());
    fd.set("description", description.trim());
    const r = await reportProductAction(String(productId), fd);
    setReportPending(false);
    if (!r.ok) {
      notify.actionError(r.error);
      return;
    }
    notify.success("تم إرسال البلاغ");
    setReason("");
    setDescription("");
    router.refresh();
  }

  return (
    <section className="mt-10 space-y-8 rounded-2xl border border-sky-200/50 bg-white/50 p-5 ring-1 ring-white/80 backdrop-blur-sm sm:p-6">
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
          <Star className="size-5 text-primary" aria-hidden />
          تقييم المنتج
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">اختر عدد النجوم ويمكنك إضافة تعليق اختياري.</p>
        <form onSubmit={onRate} className="space-y-4">
          <div className="space-y-2">
            <Label>التقييم</Label>
            <div className="flex flex-wrap items-center gap-1" role="group" aria-label="اختر عدد النجوم">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={cn(
                    "rounded-lg p-1.5 transition-colors hover:bg-sky-50",
                    n <= rating ? "text-papaya" : "text-sky-300"
                  )}
                  onClick={() => setRating(n)}
                  aria-label={`${n} من 5`}
                >
                  <Star className={cn("size-8", n <= rating && "fill-papaya")} aria-hidden />
                </button>
              ))}
              <span className="ms-2 text-sm font-medium tabular-nums text-muted-foreground">{rating}/5</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`product-rate-comment-${productId}`}>تعليق (اختياري)</Label>
            <textarea
              id={`product-rate-comment-${productId}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-input bg-background/80 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
              placeholder="اكتب رأيك عن المنتج…"
            />
          </div>
          <Button type="submit" disabled={ratePending} className="rounded-xl">
            {ratePending ? "جاري الإرسال…" : "إرسال التقييم"}
          </Button>
        </form>
      </div>

      <Separator className="bg-sky-100/80" />

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
          <Flag className="size-5 text-destructive" aria-hidden />
          الإبلاغ عن مشكلة
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          للمنتج: <span className="font-medium text-foreground">{productName}</span>. صف المشكلة وسنراجع البلاغ.
        </p>
        <form onSubmit={onReport} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`product-report-reason-${productId}`}>السبب</Label>
            <Input
              id={`product-report-reason-${productId}`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="مثال: وصف غير دقيق، منتج تالف…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`product-report-desc-${productId}`}>الوصف</Label>
            <textarea
              id={`product-report-desc-${productId}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full resize-none rounded-xl border border-input bg-background/80 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
              placeholder="اشرح المشكلة بالتفصيل…"
            />
          </div>
          <Button type="submit" variant="outline" disabled={reportPending} className="rounded-xl border-destructive/30">
            {reportPending ? "جاري الإرسال…" : "إرسال البلاغ"}
          </Button>
        </form>
      </div>
    </section>
  );
}
