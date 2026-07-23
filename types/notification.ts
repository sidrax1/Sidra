import type { BaseEntity } from "@/types/common";

export type NotificationChannel =
 | "inApp"
 | "email"
 | "push";

export type NotificationPriority =
 | "low"
 | "normal"
 | "high"
 | "critical";

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  read: boolean;
  readAt?: string;
  actionURL?: string;
  imageURL?: string;
  metadata?: Record<string, unknown>;
}
