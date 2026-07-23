"use client";

import {
  Paperclip,
  Send,
} from "lucide-react";
import {
  useState,
} from "react";

import {
  Button,
} from "@/components/ui/Button";
import {
  IconButton,
} from "@/components/ui/IconButton";
import {
  Textarea,
} from "@/components/ui/Textarea";

interface SupportReplyComposerProps {
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly onAttach?: () => void;

    readonly onSend: (
      message: string
    ) => void | Promise<void>;
}

export function SupportReplyComposer({
  disabled = false,
  loading = false,
  onAttach,
  onSend,
}: SupportReplyComposerProps): React.JSX.Element {
  const [message, setMessage] =
    useState("");

    const valid =
     message.trim().length > 0;

    return (
     <form
       className="grid gap-3 border-t border-border pt-5"
       onSubmit={(event) => {
        event.preventDefault();

       if (!valid) {
         return;
       }

        void Promise.resolve(
          onSend(
            message.trim()
          )
        ).then(() => {
          setMessage("");
        });
      }}
     >
      <Textarea
        value={message}
        rows={5}
        disabled={
          disabled || loading
        }
        placeholder="Write a reply..."
        onChange={(event) =>

           setMessage(
             event.target.value
           )
       }
      />

      <div className="flex items-center justify-between gap-4">
       <IconButton
        label="Attach files"
        icon={
          <Paperclip aria-hidden={true} />
        }
        appearance="ghost"
        disabled={
          disabled ||
          loading ||
          !onAttach
        }
        onClick={onAttach}
       />

      <Button
       type="submit"
       disabled={
         disabled || !valid
       }
       loading={loading}
       loadingLabel="Sending"
      >
       <Send aria-hidden={true} />
       Send Reply
      </Button>
    </div>
   </form>
 );
}
