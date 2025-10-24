import type { SensorData } from './api';

// Generate mock sensor data for development/testing
export const generateMockSensorData = (count: number = 100): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 5 * 60 * 1000); // 5 minutes apart
    
    data.push({
      id: i + 1,
      temp: 20 + Math.random() * 15 + Math.sin(i * 0.1) * 5, // 20-35°C with some variation
      humidity: 40 + Math.random() * 40 + Math.sin(i * 0.05) * 10, // 40-80% with variation
      voltage: 4.5 + Math.random() * 0.5 + Math.sin(i * 0.02) * 0.2, // 4.5-5V with variation
      ldr: Math.random() * 100, // 0-100% light level
      created_at: timestamp.toISOString().replace('T', ' ').substring(0, 19)
    });
  }
  
  return data;
};

// Check if we should use mock data (when API is not available)
export const shouldUseMockData = (): boolean => {
  // You can modify this condition based on your needs
  // For now, we'll use mock data when in development mode
  return import.meta.env.DEV;
};
