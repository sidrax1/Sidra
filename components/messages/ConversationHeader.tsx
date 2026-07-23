import {
  MoreHorizontal,
  Phone,
  Video,
} from "lucide-react";

import {
  Avatar,
} from "@/components/ui/Avatar";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  IconButton,
} from "@/components/ui/IconButton";

interface ConversationHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly avatarURL?: string | null;
  readonly online?: boolean;
  readonly onVoiceCall?: () => void;
  readonly onVideoCall?: () => void;
  readonly onMore?: () => void;
}

export function ConversationHeader({
  avatarURL,
  online = false,
  onMore,
  onVideoCall,
  onVoiceCall,
  subtitle,
  title,
}: ConversationHeaderProps): React.JSX.Element {
  return (
    <header className="flex items-center justify-between gap-5 border-b border-border bg-card
p-5">
      <div className="flex min-w-0 items-center gap-4">
       <Avatar
         name={title}
         src={avatarURL}
         size="md"
       />

    <div className="min-w-0">
     <div className="flex items-center gap-3">
      <h2 className="truncate font-heading text-2xl font-medium tracking-[-0.025em]">
        {title}
      </h2>

       <Badge
        variant={
          online
           ? "success"
           : "neutral"
        }
       >
        {online
          ? "Online"

      : "Offline"}
   </Badge>
  </div>

  {subtitle ? (
    <p className="mt-1 truncate text-xs text-muted">
      {subtitle}
    </p>
  ) : null}
 </div>
</div>

<div className="flex shrink-0 items-center gap-1">
 {onVoiceCall ? (
   <IconButton
     label="Start voice call"
     icon={
       <Phone aria-hidden={true} />
     }
     appearance="ghost"
     onClick={onVoiceCall}
   />
 ) : null}

 {onVideoCall ? (
   <IconButton
     label="Start video call"
     icon={
       <Video aria-hidden={true} />
     }
     appearance="ghost"
     onClick={onVideoCall}
   />
 ) : null}

 {onMore ? (
  <IconButton
   label="Conversation options"
   icon={
     <MoreHorizontal aria-hidden={true} />
   }
   appearance="ghost"
   onClick={onMore}
  />

     ) : null}
    </div>
   </header>
 );
}
