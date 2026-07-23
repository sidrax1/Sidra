"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import type { SellerApplication } from "@/types/seller-application";

type ApplicationDecision =
  | "approve"
  | "reject"
  | "requestMoreInfo"
  | "hold";

interface SellerApplicationReviewPanelProps {
  readonly application: SellerApplication;
  readonly loading?: boolean;
  readonly onSubmit: (input: {
    readonly application: SellerApplication;
    readonly decision: ApplicationDecision;
    readonly reviewNotes?: string;
  }) => void | Promise<void>;
}

const decisionOptions = [
  {
    value: "approve",
    label: "Approve Application",
  },
  {
    value: "requestMoreInfo",
    label: "Request More Information",
  },
  {
    value: "hold",
    label: "Place on Hold",
  },
  {
    value: "reject",
    label: "Reject Application",
  },
] as const;

export function SellerApplicationReviewPanel({
  application,
  loading = false,
  onSubmit,
}: SellerApplicationReviewPanelProps): React.JSX.Element {
  const [decision, setDecision] =
    useState<ApplicationDecision>("approve");
  const [reviewNotes, setReviewNotes] = useState("");

 useEffect(() => {
   setDecision("approve");
   setReviewNotes("");
 }, [application.id]);

 const notesRequired = decision !== "approve";
 const valid =
  !notesRequired || reviewNotes.trim().length >= 10;

 return (
  <Surface className="grid gap-6">
    <header>
     <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
      Review Decision
     </h2>

 <p className="mt-2 text-sm leading-6 text-muted">
  Record a clear decision for {application.studioName}. Every action is
  securely audited.
 </p>
</header>

<FormField
 label="Decision"
 labelFor="seller-application-decision"
 required
>
 <Select
   id="seller-application-decision"
   value={decision}
   options={decisionOptions}
   disabled={loading}
   onChange={(event) =>
     setDecision(event.target.value as ApplicationDecision)
   }
 />
</FormField>

<FormField
 label="Review Notes"
 labelFor="seller-application-review-notes"
 required={notesRequired}
 optional={!notesRequired}
>
 <Textarea
   id="seller-application-review-notes"
   rows={7}
   value={reviewNotes}
   disabled={loading}
   onChange={(event) => setReviewNotes(event.target.value)}
 />
</FormField>

<div className="flex justify-end border-t border-border pt-5">
 <Button
  disabled={!valid}
  loading={loading}
  loadingLabel="Submitting Decision"
  variant={decision === "reject" ? "danger" : "primary"}
  onClick={() => {

        void onSubmit({
          application,
          decision,
          reviewNotes: reviewNotes.trim() || undefined,
        });
      }}
     >
      Submit Decision
     </Button>
    </div>
   </Surface>
 );
}
