"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addTicketMessage as apiAddMessage,
  createTicket as apiCreateTicket,
  deleteTicket as apiDeleteTicket,
  updateTicketStatus as apiUpdateTicketStatus,
} from "@/lib/api";
import { ROUTES } from "@/constants";
import { rethrowIfRedirect } from "@/lib/server-actions";
import { extractTicket } from "@/lib/ticket-utils";

function ticketCreateFormSource(formData: FormData): "contact" | "new-ticket" {
  const raw = String(formData.get("ticket_form_source") ?? "").trim();
  return raw === "contact" ? "contact" : "new-ticket";
}

export async function createTicketAction(formData: FormData): Promise<void> {
  const source = ticketCreateFormSource(formData);
  const errorBase = source === "contact" ? ROUTES.contact : ROUTES.ticketNew;

  const subject = String(formData.get("subject") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!subject) {
    redirect(`${errorBase}?error=${encodeURIComponent("أدخل عنوان التذكرة")}`);
  }
  if (!description) {
    redirect(`${errorBase}?error=${encodeURIComponent("أدخل وصف المشكلة")}`);
  }

  const files = formData.getAll("attachments");
  const attachments: File[] = [];
  for (const f of files) {
    if (f instanceof File && f.size > 0) attachments.push(f);
  }

  try {
    const res = await apiCreateTicket({
      subject,
      description,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
    const t = extractTicket(res.data);
    revalidatePath(ROUTES.tickets);
    revalidatePath(ROUTES.contact);
    if (source === "contact") {
      if (t?.id != null) {
        redirect(`${ROUTES.contact}?created=1&ticket=${encodeURIComponent(String(t.id))}`);
      }
      redirect(`${ROUTES.contact}?created=1`);
    }
    if (t?.id != null) {
      redirect(`${ROUTES.ticket(t.id)}?ok=created`);
    }
    redirect(`${ROUTES.tickets}?ok=created`);
  } catch (e) {
    rethrowIfRedirect(e);
    const msg = e instanceof Error ? e.message : "تعذر إنشاء التذكرة";
    redirect(`${errorBase}?error=${encodeURIComponent(msg)}`);
  }
}

export async function addTicketMessageFormAction(formData: FormData): Promise<void> {
  const ticketId = String(formData.get("ticket_id") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!ticketId) redirect(ROUTES.tickets);
  if (!message) {
    redirect(`${ROUTES.ticket(ticketId)}?error=${encodeURIComponent("اكتب رسالة قبل الإرسال")}`);
  }
  try {
    await apiAddMessage(ticketId, message);
    revalidatePath(ROUTES.tickets);
    revalidatePath(ROUTES.ticket(ticketId));
    redirect(`${ROUTES.ticket(ticketId)}?ok=message`);
  } catch (e) {
    rethrowIfRedirect(e);
    const msg = e instanceof Error ? e.message : "تعذر إرسال الرسالة";
    redirect(`${ROUTES.ticket(ticketId)}?error=${encodeURIComponent(msg)}`);
  }
}

export async function deleteTicketFormAction(formData: FormData): Promise<void> {
  const ticketId = String(formData.get("ticket_id") ?? "").trim();
  if (!ticketId) redirect(ROUTES.tickets);
  try {
    await apiDeleteTicket(ticketId);
    revalidatePath(ROUTES.tickets);
    redirect(`${ROUTES.tickets}?ok=deleted`);
  } catch (e) {
    rethrowIfRedirect(e);
    const msg = e instanceof Error ? e.message : "تعذر حذف التذكرة";
    redirect(`${ROUTES.ticket(ticketId)}?error=${encodeURIComponent(msg)}`);
  }
}

export async function updateTicketStatusFormAction(formData: FormData): Promise<void> {
  const ticketId = String(formData.get("ticket_id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  if (!ticketId) redirect(ROUTES.tickets);
  if (!status) {
    redirect(`${ROUTES.ticket(ticketId)}?error=${encodeURIComponent("اختر الحالة")}`);
  }
  try {
    await apiUpdateTicketStatus(ticketId, status);
    revalidatePath(ROUTES.tickets);
    revalidatePath(ROUTES.ticket(ticketId));
    redirect(`${ROUTES.ticket(ticketId)}?ok=status`);
  } catch (e) {
    rethrowIfRedirect(e);
    const msg = e instanceof Error ? e.message : "تعذر تحديث الحالة";
    redirect(`${ROUTES.ticket(ticketId)}?error=${encodeURIComponent(msg)}`);
  }
}
