"use client";

import {
  Menu,
} from "lucide-react";
import {
  useState,
} from "react";

import { AccountSidebar } from "@/components/account/AccountSidebar";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

export function AccountMobileNavigation(): React.JSX.Element {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="lg:hidden"
        onClick={() =>
          setOpen(true)
        }
      >
        <Menu
          aria-hidden="true"
          className="size-4"
        />
        Account Menu
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto p-4">
          <DialogHeader className="sr-only">
            <DialogTitle>
              Account Navigation
            </DialogTitle>
          </DialogHeader>

          <AccountSidebar />
        </DialogContent>
      </Dialog>
    </>
  );
}
