"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { IconButton } from "@/components/ui/IconButton";

interface CopyButtonProps {
  readonly value: string;
  readonly label?: string;
}

export function CopyButton({
  label = "Copy",
  value,
}: CopyButtonProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);

 const copy = async (): Promise<void> => {
  await navigator.clipboard.writeText(value);

      setCopied(true);

   window.setTimeout(() => {
     setCopied(false);
   }, 1800);
 };

 return (
   <IconButton
    label={copied ? "Copied" : label}
    icon={
      copied ? (
        <Check aria-hidden="true" />
      ):(
        <Copy aria-hidden="true" />
      )
    }
    appearance="ghost"
    size="sm"
    onClick={() => {
      void copy();
    }}
   />
 );
}
