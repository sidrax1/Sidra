"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly disabled?: boolean;
}

export function Pagination({
  currentPage,
  disabled = false,
  onPageChange,
  totalPages,
}: PaginationProps): React.JSX.Element | null {
  if (totalPages <= 1) {
    return null;
  }

 const pages = Array.from(
   { length: totalPages },
   (_, index) => index + 1
 ).filter(
   (page) =>
     page === 1 ||
     page === totalPages ||
     Math.abs(page - currentPage) <= 1
 );

 return (

<nav
 aria-label="Pagination"
 className="flex flex-wrap items-center justify-center gap-2"
>
 <Button
  variant="outline"
  size="icon"
  disabled={disabled || currentPage <= 1}
  aria-label="Previous page"
  onClick={() => onPageChange(currentPage - 1)}
 >
  <ChevronLeft aria-hidden={true} />
 </Button>

 {pages.map((page, index) => {
  const previous = pages[index - 1];
  const showGap =
   previous !== undefined && page - previous > 1;

  return (
   <span key={page} className="contents">
     {showGap ? (
       <span className="px-2 text-muted">…</span>
     ) : null}

      <Button
       variant={page === currentPage ? "primary" : "ghost"}
       size="icon"
       disabled={disabled}
       aria-current={page === currentPage ? "page" : undefined}
       aria-label={`Page ${page}`}
       onClick={() => onPageChange(page)}
      >
       {page}
      </Button>
     </span>
   );
 })}

 <Button
  variant="outline"
  size="icon"
  disabled={disabled || currentPage >= totalPages}
  aria-label="Next page"

     onClick={() => onPageChange(currentPage + 1)}
    >
     <ChevronRight aria-hidden={true} />
    </Button>
   </nav>
 );
}
