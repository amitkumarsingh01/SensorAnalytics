import type { SensorData, AnalyticsSummary, TimeSeriesData } from '../types/sensor';

// Hardcoded sensor data based on the CSV
export const sensorData: SensorData[] = [
  { sNo: 1, date: '2025-10-22', time: '10:00:00', voltage: 4.87, ldr: 75, temperature: 25.4, humidity: 62 },
  { sNo: 2, date: '2025-10-22', time: '10:05:00', voltage: 4.9, ldr: 72, temperature: 25.5, humidity: 61 },
  { sNo: 3, date: '2025-10-22', time: '10:10:00', voltage: 4.75, ldr: 65, temperature: 25.6, humidity: 60 },
  { sNo: 4, date: '2025-10-22', time: '10:15:00', voltage: 4.6, ldr: 50, temperature: 25.8, humidity: 60 },
  { sNo: 5, date: '2025-10-22', time: '10:20:00', voltage: 4.55, ldr: 48, temperature: 25.9, humidity: 59 },
  { sNo: 6, date: '2025-10-22', time: '10:25:00', voltage: 4.92, ldr: 78, temperature: 26, humidity: 58 },
  { sNo: 7, date: '2025-10-22', time: '10:30:00', voltage: 4.95, ldr: 80, temperature: 26.2, humidity: 57 },
  { sNo: 8, date: '2025-10-22', time: '10:35:00', voltage: 4.98, ldr: 85, temperature: 26.3, humidity: 57 },
  { sNo: 9, date: '2025-10-22', time: '10:40:00', voltage: 4.99, ldr: 88, temperature: 26.4, humidity: 56 },
  { sNo: 10, date: '2025-10-22', time: '10:45:00', voltage: 4.88, ldr: 87, temperature: 26.5, humidity: 55 },
  { sNo: 11, date: '2025-10-22', time: '10:50:00', voltage: 4.85, ldr: 86, temperature: 26.6, humidity: 55 },
  { sNo: 12, date: '2025-10-22', time: '10:55:00', voltage: 4.7, ldr: 80, temperature: 26.8, humidity: 54 },
  { sNo: 13, date: '2025-10-22', time: '11:00:00', voltage: 4.65, ldr: 77, temperature: 26.9, humidity: 54 },
  { sNo: 14, date: '2025-10-22', time: '11:05:00', voltage: 4.5, ldr: 60, temperature: 27, humidity: 53 },
  { sNo: 15, date: '2025-10-22', time: '11:10:00', voltage: 4.45, ldr: 55, temperature: 27.1, humidity: 53 },
  { sNo: 16, date: '2025-10-22', time: '11:15:00', voltage: 4.9, ldr: 70, temperature: 27.2, humidity: 52 },
  { sNo: 17, date: '2025-10-22', time: '11:20:00', voltage: 4.93, ldr: 74, temperature: 27.3, humidity: 52 },
  { sNo: 18, date: '2025-10-22', time: '11:25:00', voltage: 4.96, ldr: 78, temperature: 27.4, humidity: 51 },
  { sNo: 19, date: '2025-10-22', time: '11:30:00', voltage: 4.98, ldr: 82, temperature: 27.5, humidity: 51 },
  { sNo: 20, date: '2025-10-22', time: '11:35:00', voltage: 4.99, ldr: 85, temperature: 27.6, humidity: 50 },
  { sNo: 21, date: '2025-10-22', time: '11:40:00', voltage: 4.95, ldr: 88, temperature: 27.7, humidity: 50 },
  { sNo: 22, date: '2025-10-22', time: '11:45:00', voltage: 4.9, ldr: 90, temperature: 27.8, humidity: 49 },
  { sNo: 23, date: '2025-10-22', time: '11:50:00', voltage: 4.8, ldr: 85, temperature: 27.9, humidity: 49 },
  { sNo: 24, date: '2025-10-22', time: '11:55:00', voltage: 4.7, ldr: 80, temperature: 28, humidity: 48 },
  { sNo: 25, date: '2025-10-22', time: '12:00:00', voltage: 4.6, ldr: 75, temperature: 28.1, humidity: 48 },
  { sNo: 26, date: '2025-10-22', time: '12:05:00', voltage: 4.5, ldr: 70, temperature: 28.2, humidity: 47 },
  { sNo: 27, date: '2025-10-22', time: '12:10:00', voltage: 4.4, ldr: 65, temperature: 28.3, humidity: 47 },
  { sNo: 28, date: '2025-10-22', time: '12:15:00', voltage: 4.3, ldr: 60, temperature: 28.4, humidity: 46 },
  { sNo: 29, date: '2025-10-22', time: '12:20:00', voltage: 4.2, ldr: 55, temperature: 28.5, humidity: 46 },
  { sNo: 30, date: '2025-10-22', time: '12:25:00', voltage: 4.1, ldr: 50, temperature: 28.6, humidity: 45 }
];

export const calculateAnalytics = (data: SensorData[]): AnalyticsSummary => {
  const temperatures = data.map(d => d.temperature);
  const humidities = data.map(d => d.humidity);
  const voltages = data.map(d => d.voltage);
  const ldrs = data.map(d => d.ldr);

  return {
    avgTemperature: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
    avgHumidity: humidities.reduce((a, b) => a + b, 0) / humidities.length,
    avgVoltage: voltages.reduce((a, b) => a + b, 0) / voltages.length,
    avgLDR: ldrs.reduce((a, b) => a + b, 0) / ldrs.length,
    maxTemperature: Math.max(...temperatures),
    minTemperature: Math.min(...temperatures),
    maxHumidity: Math.max(...humidities),
    minHumidity: Math.min(...humidities),
    maxVoltage: Math.max(...voltages),
    minVoltage: Math.min(...voltages),
    maxLDR: Math.max(...ldrs),
    minLDR: Math.min(...ldrs),
    totalReadings: data.length
  };
};

export const getTimeSeriesData = (data: SensorData[]): TimeSeriesData => {
  return {
    temperature: data.map(d => ({ time: d.time, value: d.temperature })),
    humidity: data.map(d => ({ time: d.time, value: d.humidity })),
    voltage: data.map(d => ({ time: d.time, value: d.voltage })),
    ldr: data.map(d => ({ time: d.time, value: d.ldr }))
  };
};