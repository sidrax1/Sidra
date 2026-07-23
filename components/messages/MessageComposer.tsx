"use client";

import {
  ImagePlus,
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

interface MessageComposerProps {
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly onAttachFile?: () => void;
  readonly onAttachImage?: () => void;
  readonly onSend: (
    text: string
  ) => void | Promise<void>;
}

export function MessageComposer({
  disabled = false,
  loading = false,
  onAttachFile,
  onAttachImage,
  onSend,
}: MessageComposerProps): React.JSX.Element {
  const [text, setText] =
    useState("");

 const valid =
  text.trim().length > 0;

 return (
  <form
    className="border-t border-border bg-card p-4"
    onSubmit={(event) => {
     event.preventDefault();

     if (!valid) {
       return;
     }

     void Promise.resolve(
       onSend(text.trim())
     ).then(() => {
       setText("");
     });
   }}
  >
   <Textarea
     value={text}
     rows={4}
     disabled={
       disabled || loading
     }
     placeholder="Write a message..."
     onChange={(event) =>
       setText(
         event.target.value
       )
     }
     onKeyDown={(event) => {

   if (
     event.key === "Enter" &&
     !event.shiftKey
   ){
     event.preventDefault();

       if (valid) {
         void Promise.resolve(
           onSend(
             text.trim()
           )
         ).then(() => {
           setText("");
         });
       }
   }
 }}
/>

<div className="mt-3 flex items-center justify-between gap-4">
 <div className="flex items-center gap-1">
  <IconButton
    label="Attach file"
    icon={
      <Paperclip aria-hidden={true} />
    }
    appearance="ghost"
    disabled={
      disabled ||
      loading ||
      !onAttachFile
    }
    onClick={onAttachFile}
  />

   <IconButton
    label="Attach image"
    icon={
      <ImagePlus aria-hidden={true} />
    }
    appearance="ghost"
    disabled={
      disabled ||
      loading ||

         !onAttachImage
        }
        onClick={onAttachImage}
       />
      </div>

      <Button
       type="submit"
       disabled={
         disabled || !valid
       }
       loading={loading}
       loadingLabel="Sending"
      >
       <Send aria-hidden={true} />
       Send
      </Button>
    </div>
   </form>
 );
}
