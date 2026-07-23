"use client";

import {
  Building2,
  Search,
} from "lucide-react";

import {
  SearchInput,
} from "@/components/ui/SearchInput";
import {
  cn,
} from "@/lib/utils";

interface ServicePartnerSearchBarProps {
  readonly value: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly placeholder?: string;
  readonly onChange: (
    value: string
  ) => void;
}

export function ServicePartnerSearchBar({
  className,
  disabled = false,
  onChange,
  placeholder = "Search service partner, city, capability or partner number",
  value,
}: ServicePartnerSearchBarProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "relative",
        className
      )}
    >
      <SearchInput
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        leadingIcon={
          value.trim().length > 0 ? (
            <Search
              aria-hidden={true}
              className="size-4"
            />
          ) : (
            <Building2
              aria-hidden={true}
              className="size-4"
            />
          )
        }
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        onClear={() =>
          onChange("")
        }
      />
    </div>
  );
}
