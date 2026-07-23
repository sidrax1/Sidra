export interface DashboardMetric {
  readonly id: string;

 readonly label: string;

 readonly value: number;

 readonly previousValue?: number;

 readonly percentageChange?: number;
}
