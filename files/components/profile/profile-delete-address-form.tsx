"use client";

import { Trash2 } from "lucide-react";
import { deleteAddressProfileAction } from "@/app/actions/profile-addresses";
import { Button } from "@/components/ui/button";

export function ProfileDeleteAddressForm({
  addressId,
  label,
}: {
  addressId: string;
  label: string;
}) {
  return (
    <form
      action={deleteAddressProfileAction}
      className="inline"
      onSubmit={(e) => {
        if (!confirm(`حذف العنوان «${label}»؟ لا يمكن التراجع.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="address_id" value={addressId} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-3.5" aria-hidden />
        حذف
      </Button>
    </form>
  );
}
