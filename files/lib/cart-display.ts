import "server-only";

import { getProductById } from "@/lib/api";
import { extractProductFromApiResponse } from "@/lib/product-api-helpers";
import {
  CART_LINE_PLACEHOLDER_IMAGE,
  cartLineImageSrc,
  lineProductId,
} from "@/lib/cart-utils";
import { productImageSrc } from "@/lib/product-utils";

/**
 * When GET /api/cart omits images on lines, resolve from GET /api/products/:id (same as shop cards).
 */
export async function enrichCartLinesForDisplay(
  items: unknown[]
): Promise<{ line: unknown; imageSrc: string }[]> {
  return Promise.all(
    items.map(async (line) => {
      let imageSrc = cartLineImageSrc(line);
      const pid = lineProductId(line);
      if (imageSrc === CART_LINE_PLACEHOLDER_IMAGE && pid) {
        try {
          const res = await getProductById(pid);
          const p = extractProductFromApiResponse(res);
          if (p) imageSrc = productImageSrc(p);
        } catch {
          /* keep placeholder */
        }
      }
      return { line, imageSrc };
    })
  );
}
