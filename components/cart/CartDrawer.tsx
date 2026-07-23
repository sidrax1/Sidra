"use client";

import {
  ShoppingBag,
} from "lucide-react";

import {
  CartItemsList,
} from "@/components/cart/CartItemsList";

import type {
  CartItemProductSnapshot,
} from "@/components/cart/CartItemCard";

import {
  Button,
} from "@/components/ui/Button";

import {
  Drawer,
  DrawerContent,
} from "@/components/ui/Drawer";

import {
  Price,
} from "@/components/ui/Price";

import {
  Separator,
} from "@/components/ui/Separator";

import type {
  CartItem,
} from "@/types/cart";

interface CartDrawerProps {
  readonly open: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly items: readonly CartItem[];
  readonly products: Readonly<
    Record<
      string,
      CartItemProductSnapshot
    >
  >;
  readonly subtotal: number;
  readonly loadingItemIds?: ReadonlySet<string>;
  readonly checkoutLoading?: boolean;
  readonly onQuantityChange: (
    item: CartItem,
    quantity: number
  ) => void | Promise<void>;
  readonly onRemove: (
    item: CartItem
  ) => void | Promise<void>;
  readonly onMoveToWishlist?: (
    item: CartItem
  ) => void | Promise<void>;
  readonly onCheckout: () => void;
  readonly onViewCart: () => void;
}

export function CartDrawer({
 checkoutLoading = false,
 items,

  loadingItemIds,
  onCheckout,
  onMoveToWishlist,
  onOpenChange,
  onQuantityChange,
  onRemove,
  onViewCart,
  open,
  products,
  subtotal,
}: CartDrawerProps): React.JSX.Element {
  const itemCount = items.reduce(
    (
      total,
      item
    ) => total + item.quantity,
    0
  );

 return (
  <Drawer
    open={open}
    onOpenChange={
      onOpenChange
    }
  >
    <DrawerContent
      title="Your Bag"
      description={`${itemCount.toLocaleString("en-IN")} ${
        itemCount === 1
          ? "piece"
          : "pieces"
      } selected`}
      side="right"
      className="w-[min(94vw,560px)]"
    >
      <div className="flex min-h-full flex-col">
        <div className="min-h-0 flex-1">
          <CartItemsList
            items={items}
            products={products}
            loadingItemIds={
              loadingItemIds
            }

  onQuantityChange={
    onQuantityChange
  }
  onRemove={onRemove}
  onMoveToWishlist={
    onMoveToWishlist
  }
 />
</div>

{items.length > 0 ? (
  <footer className="sticky bottom-0 mt-6 border-t border-border bg-card pt-5">
   <div className="flex items-center justify-between gap-4">
    <span className="text-sm text-muted">
     Subtotal
    </span>

   <Price
    amount={subtotal}
    size="lg"
   />
  </div>

  <p className="mt-2 text-xs leading-5 text-muted">
   Shipping and applicable taxes
   are calculated during checkout.
  </p>

  <Separator className="my-5" />

  <div className="grid gap-3 sm:grid-cols-2">
   <Button
    variant="outline"
    fullWidth
    onClick={onViewCart}
   >
    View Bag
   </Button>

   <Button
    fullWidth
    loading={
      checkoutLoading
    }

            loadingLabel="Preparing"
            onClick={onCheckout}
           >
            <ShoppingBag
              aria-hidden={true}
            />
            Checkout
           </Button>
          </div>
        </footer>
      ) : null}
     </div>
    </DrawerContent>
   </Drawer>
 );
}
