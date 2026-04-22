import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { getUserFacingErrorDescription } from "@/lib/user-facing-errors";

export const notify = {
  success: (message: string) =>
    toast.success(message, { duration: 3600 }),

  /** Raw error string from API / catch — sanitized for end users. */
  actionError: (raw: string | undefined | null) =>
    toast.error(getUserFacingErrorDescription(raw ?? ""), { duration: 4800 }),

  error: (message: string) =>
    toast.error(message, { duration: 4500 }),

  info: (message: string) =>
    toast(message, { icon: "ℹ️", duration: 3000 }),

  loading: (message: string) => toast.loading(message),

  dismiss: (id?: string) => toast.dismiss(id),

  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => toast.promise(promise, messages),
};

export const alert = {
  confirm: async (options?: {
    title?: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
  }) => {
    const result = await Swal.fire({
      title: options?.title ?? "هل أنت متأكد؟",
      text: options?.text ?? "لا يمكن التراجع عن هذا الإجراء.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: options?.confirmText ?? "نعم، تابع",
      cancelButtonText: options?.cancelText ?? "إلغاء",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });
    return result.isConfirmed;
  },

  success: (title: string, text?: string) =>
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#10b981",
    }),

  error: (title: string, text?: string) =>
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonColor: "#ef4444",
    }),

  info: (title: string, text?: string) =>
    Swal.fire({
      title,
      text,
      icon: "info",
      confirmButtonColor: "#0284c7",
    }),
};
