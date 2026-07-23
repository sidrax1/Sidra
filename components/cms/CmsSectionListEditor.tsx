"use client";

import { Plus } from "lucide-react";

import { CmsSectionEditor } from "@/components/cms/CmsSectionEditor";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CmsSection } from "@/types/cms";

interface CmsSectionListEditorProps {
  readonly sections: readonly CmsSection[];
  readonly disabled?: boolean;
  readonly onChange: (sections: readonly CmsSection[]) => void;
  readonly onAddSection: () => void;
}

function reorderSections(
  sections: readonly CmsSection[],
  sourceIndex: number,
  destinationIndex: number
): CmsSection[] {
  const nextSections = [...sections];
  const [movedSection] = nextSections.splice(sourceIndex, 1);

 if (!movedSection) {
   return nextSections;
 }

 nextSections.splice(destinationIndex, 0, movedSection);

    return nextSections.map((section, index) => ({
      ...section,
      order: index,
    }));
}

export function CmsSectionListEditor({
  disabled = false,
  onAddSection,
  onChange,
  sections,
}: CmsSectionListEditorProps): React.JSX.Element {
  if (sections.length === 0) {
    return (
      <EmptyState
       title="No page sections"
       description="Add a structured section to begin composing this page."
       action={
         <Button
           disabled={disabled}
           onClick={onAddSection}
         >
           <Plus aria-hidden="true" />
           Add Section
         </Button>
       }
      />
    );
  }

    return (
     <section className="grid gap-5">
       <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
         <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
           Page Sections
         </h2>

        <p className="mt-2 text-sm text-muted">
         Arrange reusable content blocks in the order they should appear.
        </p>
       </div>

       <Button

  variant="outline"
  disabled={disabled}
  onClick={onAddSection}
 >
  <Plus aria-hidden="true" />
  Add Section
 </Button>
</header>

<div className="grid gap-4">
 {sections.map((section, index) => (
  <CmsSectionEditor
    key={section.id}
    section={section}
    index={index}
    totalSections={sections.length}
    disabled={disabled}
    onChange={(updatedSection) => {
      onChange(
        sections.map((currentSection) =>
          currentSection.id === updatedSection.id
            ? updatedSection
            : currentSection
        )
      );
    }}
    onMove={(sourceIndex, destinationIndex) => {
      onChange(
        reorderSections(
          sections,
          sourceIndex,
          destinationIndex
        )
      );
    }}
    onDuplicate={(sectionToDuplicate) => {
      const duplicatedSection: CmsSection = {
        ...sectionToDuplicate,
        id: crypto.randomUUID(),
        order: index + 1,
      };

    const nextSections = [...sections];
    nextSections.splice(index + 1, 0, duplicatedSection);

           onChange(
             nextSections.map((currentSection, nextIndex) => ({
               ...currentSection,
               order: nextIndex,
             }))
           );
         }}
         onDelete={(sectionToDelete) => {
           onChange(
             sections
               .filter(
                 (currentSection) =>
                   currentSection.id !== sectionToDelete.id
               )
               .map((currentSection, nextIndex) => ({
                 ...currentSection,
                 order: nextIndex,
               }))
           );
         }}
       />
     ))}
    </div>
   </section>
 );
}
