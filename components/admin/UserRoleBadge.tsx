import { Badge } from "@/components/ui/Badge";
import type { UserRole } from "@/constants/roles";

interface UserRoleBadgeProps {
  readonly role: UserRole;
}

const labels: Record<UserRole, string> = {
  guest: "Guest",
  customer: "Customer",
  seller: "Seller",
  seller_manager: "Seller Manager",
  moderator: "Moderator",
  support: "Support",
  content_manager: "Content Manager",
  finance_manager: "Finance Manager",
  admin: "Admin",
  super_admin: "Super Admin",
  founder: "Founder",
};

export function UserRoleBadge({
  role,
}: UserRoleBadgeProps): React.JSX.Element {
  const variant =
   role === "founder" || role === "super_admin"
     ? "gold"
     : role === "admin" ||
         role === "finance_manager" ||
         role === "content_manager"
       ? "warning"
       : role === "seller" || role === "seller_manager"
         ? "success"
         : "neutral";

  return <Badge variant={variant}>{labels[role]}</Badge>;
}
