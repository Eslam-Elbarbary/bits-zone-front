import toast from "react-hot-toast";
import Swal from "sweetalert2";

// ─────────────────────────────────────────
// Toast helpers  (non-destructive feedback)
// ─────────────────────────────────────────
export const notify = {
  success: (message: string) =>
    toast.success(message, { duration: 3000 }),

  error: (message: string) =>
    toast.error(message, { duration: 4000 }),

  info: (message: string) =>
    toast(message, { icon: "ℹ️", duration: 3000 }),

  loading: (message: string) =>
    toast.loading(message),

  dismiss: (id?: string) =>
    toast.dismiss(id),

  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => toast.promise(promise, messages),
};

// ─────────────────────────────────────────
// SweetAlert2 helpers (confirmations only)
// ─────────────────────────────────────────
export const alert = {
  confirm: async (options?: {
    title?: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
  }) => {
    const result = await Swal.fire({
      title: options?.title ?? "Are you sure?",
      text: options?.text ?? "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: options?.confirmText ?? "Yes, proceed",
      cancelButtonText: options?.cancelText ?? "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });
    return result.isConfirmed;
  },

  success: (title: string, text?: string) =>
    Swal.fire({ title, text, icon: "success", confirmButtonColor: "#10b981" }),

  error: (title: string, text?: string) =>
    Swal.fire({ title, text, icon: "error", confirmButtonColor: "#ef4444" }),

  info: (title: string, text?: string) =>
    Swal.fire({ title, text, icon: "info", confirmButtonColor: "#3b82f6" }),
};
