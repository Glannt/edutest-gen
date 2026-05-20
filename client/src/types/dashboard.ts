// types/dashboard.ts
export interface KeyMetrics {
  teachers: number;
  // có thể mở rộng các metric khác
}

export interface UserActivity {
  [date: string]: number; // ví dụ: "2025-10-30": 25
}

export interface DashboardMetricsDTO {
  keyMetrics: KeyMetrics;
  userActivity: UserActivity;
}
