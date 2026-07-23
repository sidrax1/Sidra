"use client";

import { useState } from "react";
import {
  Command,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";

interface FounderCommandResult {
  readonly executionId: string;
  readonly status: "completed" | "confirmationRequired";
  readonly message: string;
  readonly affectedEntityIds: readonly string[];
  readonly confirmationToken?: string;
}

interface FounderCommandPanelProps {
  readonly loading?: boolean;
  readonly onExecute: (input: {
    readonly command: string;
    readonly confirmationToken?: string;
  }) => Promise<FounderCommandResult>;
}

export function FounderCommandPanel({
  loading = false,
  onExecute,
}: FounderCommandPanelProps): React.JSX.Element {
  const [command, setCommand] = useState("");
  const [result, setResult] = useState<FounderCommandResult | null>(
    null
  );

 const valid = command.trim().length >= 5;

 const execute = async (confirmationToken?: string): Promise<void> => {
  const nextResult = await onExecute({
    command: command.trim(),
    confirmationToken,
  });

  setResult(nextResult);

   if (nextResult.status === "completed") {
     setCommand("");
   }
 };

 return (

   <Surface
    className="grid gap-6 border-[color:rgb(200_169_106_/_0.35)]"
    shadow="hover"
   >
    <header className="flex items-start gap-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.35)] bg-[color:rgb(200_169_106_/_0.1)]
text-[var(--color-gold-600)] shadow-[var(--shadow-gold-glow)]">
       <Command aria-hidden={true} className="size-5" />
      </span>

      <div>
       <p className="text-xs font-semibold uppercase tracking-[0.18em]
text-[var(--color-gold-600)]">
        Founder Access
       </p>

      <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em]">
       Command Centre
      </h2>

     <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
      Execute authorised administrative commands using natural language.
      Sensitive actions require explicit confirmation.
     </p>
    </div>
   </header>

   <Textarea
    value={command}
    rows={6}
    disabled={loading}
    placeholder="Example: Approve the verified payment for customer@example.com"
    onChange={(event) => {
      setCommand(event.target.value);
      setResult(null);
    }}
   />

   <div className="flex justify-end">
    <Button
     disabled={!valid}
     loading={loading}
     loadingLabel="Executing"

    onClick={() => {
      void execute();
    }}
   >
    <Sparkles aria-hidden={true} />
    Execute Command
   </Button>
  </div>

   {result ? (
     <Alert
       variant={
         result.status === "completed"
           ? "success"
           : "warning"
       }
       title={
         result.status === "completed"
           ? "Command Completed"
           : "Confirmation Required"
       }
       description={result.message}
       icon={
         <ShieldAlert aria-hidden={true} className="size-5" />
       }
       action={
         result.status === "confirmationRequired" &&
         result.confirmationToken ? (
           <Button
             size="sm"
             loading={loading}
             loadingLabel="Confirming"
             onClick={() => {
               void execute(result.confirmationToken);
             }}
           >
             Confirm Action
           </Button>
         ) : undefined
       }
     />
   ) : null}
  </Surface>
);

}
