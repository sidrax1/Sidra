import { Bell, Search } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";

interface DashboardHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly userName: string;
  readonly userImage?: string | null;
}

export function DashboardHeader({
  description,
  title,
  userImage,
  userName,
}: DashboardHeaderProps): React.JSX.Element {
  return (
    <header className="sticky top-0 z-30 border-b border-border
bg-[color:rgb(247_244_239_/_0.88)] px-5 py-4 backdrop-blur-xl
dark:bg-[color:rgb(17_17_17_/_0.88)] md:px-8">
      <div className="flex items-center justify-between gap-6">
       <div>
         <h1 className="font-heading text-3xl font-medium tracking-[-0.025em]">
          {title}

       </h1>

       {description ? (
         <p className="mt-1 text-sm text-muted">{description}</p>
       ) : null}
      </div>

      <div className="flex items-center gap-2">
       <IconButton
        label="Search"
        icon={<Search aria-hidden={true} />}
        appearance="ghost"
       />

       <IconButton
        label="Notifications"
        icon={<Bell aria-hidden={true} />}
        appearance="ghost"
       />

      <Avatar name={userName} src={userImage} />
     </div>
    </div>
   </header>
 );
}
