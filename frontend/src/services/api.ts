// No mock data - only real API data

export interface SensorData {
  id: number;
  temp: number;
  humidity: number;
  voltage: number;
  ldr: number;
  created_at: string;
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

export interface TimeSeriesData {
  temperature: Array<{ time: string; value: number }>;
  humidity: Array<{ time: string; value: number }>;
  voltage: Array<{ time: string; value: number }>;
  ldr: Array<{ time: string; value: number }>;
}

// Use Vercel API route to avoid CORS issues
const API_BASE_URL = '/api/sensors';

export class SensorAPI {
  static async fetchSensorData(): Promise<SensorData[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error; // Don't use mock data, throw the error
    }
  }

  static calculateAnalytics(data: SensorData[]): AnalyticsSummary {
    const temperatures = data.map(d => d.temp);
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
  }

  static getTimeSeriesData(data: SensorData[]): TimeSeriesData {
    return {
      temperature: data.map(d => ({ time: d.created_at, value: d.temp })),
      humidity: data.map(d => ({ time: d.created_at, value: d.humidity })),
      voltage: data.map(d => ({ time: d.created_at, value: d.voltage })),
      ldr: data.map(d => ({ time: d.created_at, value: d.ldr }))
    };
  }

  static filterDataByCount(data: SensorData[], count: number): SensorData[] {
    if (count === -1) return data; // -1 means all data
    return data.slice(-count);
  }
}
