"use client";

import {
 SearchCheck,

} from "lucide-react";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import type { SeoMetadata } from "@/types/seo";

type SeoMetadataInput = Omit<
  SeoMetadata,
  | "id"
  | "createdAt"
  | "updatedAt"
>;

interface SeoMetadataEditorProps {
  readonly value: SeoMetadataInput;
  readonly disabled?: boolean;
  readonly onChange: (
    value: SeoMetadataInput
  ) => void;
}

export function SeoMetadataEditor({
  disabled = false,
  onChange,
  value,
}: SeoMetadataEditorProps): React.JSX.Element {
  return (
   <Surface className="grid gap-6">
     <header className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
       <SearchCheck
         aria-hidden={true}
         className="size-5"
       />
      </span>

     <div>
      <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
       Metadata

  </h2>

  <p className="mt-2 text-sm leading-6 text-muted">
   Configure canonical, search and social metadata for this entity.
  </p>
 </div>
</header>

<FormField
 label="Canonical Path"
 labelFor="seo-canonical-path"
 required
>
 <Input
   id="seo-canonical-path"
   value={value.canonicalPath}
   disabled={disabled}
   onChange={(event) =>
     onChange({
       ...value,
       canonicalPath:
         event.target.value,
     })
   }
 />
</FormField>

<FormField
 label="SEO Title"
 labelFor="seo-title"
 required
 description={`${value.title.length}/70 characters`}
>
 <Input
   id="seo-title"
   value={value.title}
   disabled={disabled}
   maxLength={70}
   onChange={(event) =>
     onChange({
       ...value,
       title:
         event.target.value,
     })

  }
 />
</FormField>

<FormField
 label="SEO Description"
 labelFor="seo-description"
 required
 description={`${value.description.length}/170 characters`}
>
 <Textarea
   id="seo-description"
   value={value.description}
   disabled={disabled}
   maxLength={170}
   rows={5}
   onChange={(event) =>
     onChange({
       ...value,
       description:
         event.target.value,
     })
   }
 />
</FormField>

<FormField
 label="Keywords"
 labelFor="seo-keywords"
 optional
 description="Separate keywords with commas."
>
 <Input
   id="seo-keywords"
   value={value.keywords.join(
     ", "
   )}
   disabled={disabled}
   onChange={(event) =>
     onChange({
       ...value,
       keywords:
         event.target.value
           .split(",")

       .map((keyword) =>
         keyword.trim()
       )
       .filter(Boolean),
    })
  }
 />
</FormField>

<FormField
 label="Open Graph Image"
 labelFor="seo-og-image"
 optional
>
 <Input
   id="seo-og-image"
   type="url"
   value={
     value.openGraphImageURL ??
     ""
   }
   disabled={disabled}
   onChange={(event) =>
     onChange({
       ...value,
       openGraphImageURL:
         event.target.value ||
         undefined,
     })
   }
 />
</FormField>

<div className="grid gap-5 md:grid-cols-2">
 <Switch
  checked={value.noIndex}
  disabled={disabled}
  label="No Index"
  description="Prevent search engines from indexing this entity."
  onCheckedChange={(checked) =>
    onChange({
      ...value,
      noIndex: checked,
    })

       }
      />

     <Switch
      checked={value.noFollow}
      disabled={disabled}
      label="No Follow"
      description="Ask crawlers not to follow links from this entity."
      onCheckedChange={(checked) =>
        onChange({
          ...value,
          noFollow: checked,
        })
      }
     />
    </div>
   </Surface>
 );
}
