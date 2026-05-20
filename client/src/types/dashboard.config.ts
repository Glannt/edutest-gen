export interface DashBoardConfig {
  id?: string;
  widgetName: string;
  displayName?: string;
  entity: string;
  fields: string[];
  widgetType: 'card' | 'lineChart' | 'barChart' | 'pieChart' | 'table';
  filters?: Record<string, any>;
  order?: number;
  active?: boolean;
  dataSourceMethod?: string;
}
