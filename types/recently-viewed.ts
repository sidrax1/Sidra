export interface RecentlyViewedItem {
  readonly id: string;
  readonly userId: string;
  readonly entityType: "product" | "studio";
  readonly entityId: string;
  readonly viewedAt: string;
}
