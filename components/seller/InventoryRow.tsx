"use client";

import Image from "next/image";
import {
  Minus,
  Plus,
  Save,
} from "lucide-react";

import { InventoryStatusBadge } from "@/components/seller/InventoryStatusBadge";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";

export interface SellerInventoryItem {
  readonly id: string;
  readonly productId: string;
  readonly title: string;
  readonly thumbnailURL?: string;
  readonly sku: string;
  readonly availableQuantity: number;
  readonly reservedQuantity: number;
  readonly lowStockThreshold: number;
  readonly allowBackorder: boolean;
}

interface InventoryRowProps {
  readonly item: SellerInventoryItem;
  readonly quantity: number;
  readonly loading?: boolean;
  readonly onQuantityChange: (quantity: number) => void;
  readonly onSave: () => void | Promise<void>;
}

export function InventoryRow({
  item,
  loading = false,
  onQuantityChange,
  onSave,
  quantity,
}: InventoryRowProps): React.JSX.Element {
  const dirty =
    quantity !== item.availableQuantity;

 return (
  <article className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-4
shadow-[var(--shadow-card)] md:grid-cols-[72px_minmax(0,1fr)_auto] md:items-center">
    <div className="relative aspect-square overflow-hidden rounded-md
bg-[var(--color-gray-100)]">
     {item.thumbnailURL ? (
       <Image
        src={item.thumbnailURL}

         alt={item.title}
         fill
         sizes="72px"
         className="object-cover"
        />
      ):(
        <div className="flex size-full items-center justify-center font-heading text-lg
text-[var(--color-gold-600)]">
         S
        </div>
      )}
    </div>

   <div className="min-w-0">
    <div className="flex flex-wrap items-center gap-3">
     <h3 className="truncate font-medium text-foreground">
       {item.title}
     </h3>

      <InventoryStatusBadge
       availableQuantity={quantity}
       lowStockThreshold={item.lowStockThreshold}
       allowBackorder={item.allowBackorder}
      />
     </div>

    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
     <span>SKU: {item.sku}</span>
     <span>
       Reserved: {item.reservedQuantity.toLocaleString("en-IN")}
     </span>
    </div>
   </div>

   <div className="flex flex-wrap items-center gap-2">
    <IconButton
     label="Decrease quantity"
     icon={<Minus aria-hidden={true} />}
     appearance="ghost"
     size="sm"
     disabled={loading || quantity <= 0}
     onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
    />

      <Input
       type="number"
       min={0}
       value={quantity}
       disabled={loading}
       aria-label={`Available quantity for ${item.title}`}
       className="w-24 text-center"
       onChange={(event) => {
         onQuantityChange(
           Math.max(
             0,
             Number.parseInt(event.target.value, 10) || 0
           )
         );
       }}
      />

      <IconButton
       label="Increase quantity"
       icon={<Plus aria-hidden={true} />}
       appearance="ghost"
       size="sm"
       disabled={loading}
       onClick={() => onQuantityChange(quantity + 1)}
      />

     <Button
       variant="outline"
       size="sm"
       disabled={!dirty}
       loading={loading}
       loadingLabel="Saving"
       onClick={() => {
         void onSave();
       }}
     >
       <Save aria-hidden={true} />
       Save
     </Button>
    </div>
   </article>
 );
}
