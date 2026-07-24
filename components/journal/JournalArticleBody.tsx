import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

interface JournalArticleBodyProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function JournalArticleBody({
  children,
  className,
}: JournalArticleBodyProps): React.JSX.Element {
  return (
    <Container
     as="section"
     spacing="md"
    >
     <div
      className={cn(
        "prose prose-lg mx-auto max-w-3xl",
        "prose-headings:font-heading prose-headings:font-medium",
        "prose-headings:tracking-[-0.035em]",
        "prose-p:leading-8 prose-p:text-muted",
        "prose-a:text-[var(--color-gold-600)]",
        "prose-strong:text-foreground",
        "prose-blockquote:border-[var(--color-gold-500)]",
        "prose-blockquote:text-foreground",
        "dark:prose-invert",
        className
      )}
     >
      {children}
     </div>
    </Container>
  );
}
