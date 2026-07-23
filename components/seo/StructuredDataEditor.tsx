"use client";

import {
  useMemo,
} from "react";

import {
  Braces,
  CheckCircle2,
  TriangleAlert,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";

interface StructuredDataEditorProps {
  readonly value?: Record<
    string,
    unknown
  >;
  readonly disabled?: boolean;
  readonly onChange: (
    value:
     | Record<string, unknown>
     | undefined
  ) => void;

}

export function StructuredDataEditor({
  disabled = false,
  onChange,
  value,
}: StructuredDataEditorProps): React.JSX.Element {
  const serialized =
   useMemo(
     () =>
       value
        ? JSON.stringify(
            value,
            null,
            2
          )
        : "",
     [value]
   );

    const valid =
     useMemo(() => {
      if (!serialized.trim()) {
        return true;
      }

       try {
         JSON.parse(serialized);
         return true;
       } catch {
         return false;
       }
     }, [serialized]);

 return (
   <Surface className="grid gap-5">
    <header className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
       <Braces
        aria-hidden={true}
        className="size-5"
       />

 </span>

 <div>
  <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
   Structured Data
  </h2>

  <p className="mt-2 text-sm leading-6 text-muted">
   Add valid JSON-LD properties for enhanced search presentation.
  </p>
 </div>
</header>

<Textarea
 value={serialized}
 disabled={disabled}
 rows={16}
 spellCheck={false}
 className="font-mono text-xs leading-6"
 onChange={(event) => {
  const nextValue =
    event.target.value;

  if (!nextValue.trim()) {
    onChange(undefined);
    return;
  }

  try {
    const parsed =
     JSON.parse(
       nextValue
     ) as Record<
       string,
       unknown
     >;

     onChange(parsed);
   } catch {
     return;
   }
 }}
/>

    <Alert
     variant={
       valid
         ? "success"
         : "error"
     }
     title={
       valid
         ? "Valid structured data"
         : "Invalid JSON"
     }
     description={
       valid
         ? "The current structured data is syntactically valid."
         : "Correct the JSON syntax before saving."
     }
     icon={
       valid ? (
         <CheckCircle2
           aria-hidden={true}
           className="size-5"
         />
       ):(
         <TriangleAlert
           aria-hidden={true}
           className="size-5"
         />
       )
     }
    />
   </Surface>
 );
}
