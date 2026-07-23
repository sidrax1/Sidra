import type { BaseEntity } from "@/types/common";

export interface AnalyticsMetric {
  readonly current: number;
  readonly previous: number;
  readonly percentageChange: number;
}

export interface StudioAnalytics extends BaseEntity {
  readonly studioId: string;
  readonly period: "day" | "week" | "month" | "year" | "lifetime";
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly views: AnalyticsMetric;
  readonly productViews: AnalyticsMetric;
  readonly followers: AnalyticsMetric;
  readonly orders: AnalyticsMetric;
  readonly conversionRate: AnalyticsMetric;
  readonly grossRevenuePaise: AnalyticsMetric;
  readonly netRevenuePaise: AnalyticsMetric;
  readonly averageOrderValuePaise: AnalyticsMetric;
}
