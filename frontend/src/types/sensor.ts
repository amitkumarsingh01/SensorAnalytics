export interface SensorData {
  sNo: number;
  date: string;
  time: string;
  voltage: number;
  ldr: number;
  temperature: number;
  humidity: number;
}

export interface AnalyticsSummary {
  avgTemperature: number;
  avgHumidity: number;
  avgVoltage: number;
  avgLDR: number;
  maxTemperature: number;
  minTemperature: number;
  maxHumidity: number;
  minHumidity: number;
  maxVoltage: number;
  minVoltage: number;
  maxLDR: number;
  minLDR: number;
  totalReadings: number;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  label?: string;
}

export interface TimeSeriesData {
  temperature: ChartDataPoint[];
  humidity: ChartDataPoint[];
  voltage: ChartDataPoint[];
  ldr: ChartDataPoint[];
}
