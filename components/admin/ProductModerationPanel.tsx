"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import type { Product } from "@/types/product";

type ProductModerationDecision =
  | "approve"
  | "reject"
  | "archive";

interface ProductModerationPanelProps {
  readonly product: Product;
  readonly loading?: boolean;
  readonly onSubmit: (input: {

      readonly product: Product;
      readonly decision: ProductModerationDecision;
      readonly reason?: string;
    }) => void | Promise<void>;
}

const options = [
  {
    value: "approve",
    label: "Approve Product",
  },
  {
    value: "reject",
    label: "Reject Product",
  },
  {
    value: "archive",
    label: "Archive Product",
  },
] as const;

export function ProductModerationPanel({
  loading = false,
  onSubmit,
  product,
}: ProductModerationPanelProps): React.JSX.Element {
  const [decision, setDecision] =
    useState<ProductModerationDecision>("approve");
  const [reason, setReason] = useState("");

    useEffect(() => {
      setDecision("approve");
      setReason("");
    }, [product.id]);

    const reasonRequired = decision !== "approve";
    const valid = !reasonRequired || reason.trim().length >= 10;

    return (
     <Surface className="grid gap-6">
       <header>
        <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
         Moderation Decision
        </h2>

 <p className="mt-2 text-sm leading-6 text-muted">
  Review quality, accuracy, imagery and policy compliance before
  publishing {product.title}.
 </p>
</header>

<FormField
 label="Decision"
 labelFor="product-moderation-decision"
 required
>
 <Select
   id="product-moderation-decision"
   value={decision}
   options={options}
   disabled={loading}
   onChange={(event) =>
     setDecision(event.target.value as ProductModerationDecision)
   }
 />
</FormField>

<FormField
 label="Reason"
 labelFor="product-moderation-reason"
 required={reasonRequired}
 optional={!reasonRequired}
>
 <Textarea
   id="product-moderation-reason"
   value={reason}
   rows={6}
   disabled={loading}
   onChange={(event) => setReason(event.target.value)}
 />
</FormField>

<div className="flex justify-end border-t border-border pt-5">
 <Button
  disabled={!valid}
  variant={decision === "reject" ? "danger" : "primary"}
  loading={loading}
  loadingLabel="Submitting Decision"

      onClick={() => {
        void onSubmit({
          product,
          decision,
          reason: reason.trim() || undefined,
        });
      }}
     >
      Submit Decision
     </Button>
    </div>
   </Surface>
 );
}
