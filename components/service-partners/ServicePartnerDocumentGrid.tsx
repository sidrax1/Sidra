import {
  ServicePartnerDocumentCard,
} from "@/components/service-partners/ServicePartnerDocumentCard";
import {
  EmptyState,
} from "@/components/ui/EmptyState";
import type {
  ServicePartnerDocument,
} from "@/types/service-partner";

interface ServicePartnerDocumentGridProps {
  readonly documents: readonly ServicePartnerDocument[];
}

export function ServicePartnerDocumentGrid({
  documents,
}: ServicePartnerDocumentGridProps): React.JSX.Element {
  if (documents.length === 0) {
    return (
      <EmptyState
        title="No verification documents"
        description="Business, banking, identity and quality documents will appear here."
      />
    );
  }

  const orderedDocuments = [
    ...documents,
  ].sort((first, second) => {
    const verificationDifference =
      Number(second.verified) -
      Number(first.verified);

    if (
      verificationDifference !==
      0
    ) {
      return verificationDifference;
    }

    return second.uploadedAt.localeCompare(
      first.uploadedAt
    );
  });

  return (
    <section
      aria-label="Service partner documents"
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      {orderedDocuments.map(
        (document) => (
          <ServicePartnerDocumentCard
            key={document.id}
            document={document}
          />
        )
      )}
    </section>
  );
}
