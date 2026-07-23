"use client";

import {
  Building2,
  Edit3,
  Home,
  MapPin,
  MoreVertical,
  Phone,
  Trash2,
} from "lucide-react";

import { AddressTypeBadge } from "@/components/addresses/AddressTypeBadge";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";

export type AddressType =
  | "home"
  | "work"
  | "other";

export interface CustomerAddress {
  readonly id: string;
  readonly userId: string;
  readonly type: AddressType;
  readonly fullName: string;
  readonly mobile: string;
  readonly line1: string;
  readonly line2?: string;
  readonly landmark?: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: "India";
  readonly isDefault: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface AddressCardProps {
  readonly address: CustomerAddress;
  readonly selected?: boolean;
  readonly disabled?: boolean;
  readonly onSelect?: (
    address: CustomerAddress
  ) => void;
  readonly onEdit?: (
    address: CustomerAddress
  ) => void;
  readonly onDelete?: (
    address: CustomerAddress
  ) => void;
  readonly onSetDefault?: (
    address: CustomerAddress
  ) => void | Promise<void>;
}

export function AddressCard({
  address,
  disabled = false,
  onDelete,
  onEdit,
  onSelect,
  onSetDefault,
  selected = false,
}: AddressCardProps): React.JSX.Element {
  const TypeIcon =
    address.type === "home"
      ? Home
      : address.type === "work"
        ? Building2
        : MapPin;

  return (
    <Card
      className={[
        "relative p-5 transition-[border-color,box-shadow]",
        selected
          ? "border-[var(--color-gold-500)] shadow-[var(--shadow-gold-glow)]"
          : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <TypeIcon
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <button
          type="button"
          disabled={
            disabled ||
            !onSelect
          }
          className="min-w-0 flex-1 text-left disabled:cursor-default"
          onClick={() =>
            onSelect?.(address)
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-medium text-foreground">
              {address.fullName}
            </h3>

            <AddressTypeBadge
              type={address.type}
            />

            {address.isDefault ? (
              <Badge variant="gold">
                Default
              </Badge>
            ) : null}
          </div>

          <p className="mt-3 text-sm leading-7 text-muted">
            {address.line1}
            {address.line2
              ? `, ${address.line2}`
              : ""}
            {address.landmark
              ? `, ${address.landmark}`
              : ""}
            <br />
            {address.city},{" "}
            {address.state}{" "}
            {address.postalCode}
            <br />
            {address.country}
          </p>

          <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted">
            <Phone
              aria-hidden={true}
              className="size-3.5"
            />
            {address.mobile}
          </p>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              label="Address actions"
              icon={
                <MoreVertical aria-hidden={true} />
              }
              appearance="ghost"
              size="sm"
              disabled={disabled}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {onEdit ? (
              <DropdownMenuItem
                onSelect={() =>
                  onEdit(address)
                }
              >
                <Edit3
                  aria-hidden={true}
                  className="size-4"
                />
                Edit address
              </DropdownMenuItem>
            ) : null}

            {!address.isDefault &&
            onSetDefault ? (
              <DropdownMenuItem
                onSelect={() => {
                  void onSetDefault(
                    address
                  );
                }}
              >
                <Home
                  aria-hidden={true}
                  className="size-4"
                />
                Set as default
              </DropdownMenuItem>
            ) : null}

            {onDelete ? (
              <DropdownMenuItem
                destructive
                onSelect={() =>
                  onDelete(address)
                }
              >
                <Trash2
                  aria-hidden={true}
                  className="size-4"
                />
                Delete address
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
