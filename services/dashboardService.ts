import { callableFunction } from "@/firebase/functions";
import type { DashboardMetric } from "@/types/dashboard";

export interface CustomerDashboardSummary {
  readonly metrics: readonly DashboardMetric[];
  readonly activeOrderCount: number;
  readonly wishlistCount: number;
  readonly unreadNotificationCount: number;
}

export interface SellerDashboardSummary {
  readonly metrics: readonly DashboardMetric[];
  readonly pendingOrderCount: number;
  readonly lowStockProductCount: number;
  readonly unreadMessageCount: number;
}

export interface AdminDashboardSummary {
  readonly metrics: readonly DashboardMetric[];
  readonly pendingSellerApplications: number;
  readonly pendingProductModeration: number;
  readonly unresolvedSupportTickets: number;
}

const customerDashboardCallable = callableFunction<
 Record<string, never>,
 CustomerDashboardSummary
>("getCustomerDashboardSummary");

const sellerDashboardCallable = callableFunction<
 {
   readonly studioId: string;
 },
 SellerDashboardSummary
>("getSellerDashboardSummary");

const adminDashboardCallable = callableFunction<
 Record<string, never>,
 AdminDashboardSummary
>("getAdminDashboardSummary");

export async function getCustomerDashboardSummary():
Promise<CustomerDashboardSummary> {
 const result =
  await customerDashboardCallable({});

    return result.data;
}

export async function getSellerDashboardSummary(
  studioId: string
): Promise<SellerDashboardSummary> {
  const result =
   await sellerDashboardCallable({
     studioId,
   });

    return result.data;
}

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
 const result =
  await adminDashboardCallable({});

  return result.data;
}
