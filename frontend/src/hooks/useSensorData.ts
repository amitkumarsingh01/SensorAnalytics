import { useState, useEffect, useCallback } from 'react';
import { SensorAPI } from '../services/api';
import type { SensorData, AnalyticsSummary, TimeSeriesData } from '../services/api';

interface UseSensorDataReturn {
  data: SensorData[];
  filteredData: SensorData[];
  analytics: AnalyticsSummary;
  timeSeriesData: TimeSeriesData;
  isLoading: boolean;
  error: string | null;
  selectedCount: number;
  setSelectedCount: (count: number) => void;
  refetch: () => void;
}

export const useSensorData = (): UseSensorDataReturn => {
  const [data, setData] = useState<SensorData[]>([]);
  const [filteredData, setFilteredData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState(50); // Default to last 50

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const sensorData = await SensorAPI.fetchSensorData();
      setData(sensorData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sensor data');
      console.error('Error fetching sensor data:', err);
      // Set empty data array to prevent crashes
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterData = useCallback((allData: SensorData[], count: number) => {
    const filtered = SensorAPI.filterDataByCount(allData, count);
    setFilteredData(filtered);
  }, []);

  const handleCountChange = useCallback((count: number) => {
    setSelectedCount(count);
    filterData(data, count);
  }, [data, filterData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data when data or selectedCount changes
  useEffect(() => {
    if (data.length > 0) {
      filterData(data, selectedCount);
    }
  }, [data, selectedCount, filterData]);

  // Calculate analytics and time series data
  const analytics = filteredData.length > 0 ? SensorAPI.calculateAnalytics(filteredData) : {
    avgTemperature: 0,
    avgHumidity: 0,
    avgVoltage: 0,
    avgLDR: 0,
    maxTemperature: 0,
    minTemperature: 0,
    maxHumidity: 0,
    minHumidity: 0,
    maxVoltage: 0,
    minVoltage: 0,
    maxLDR: 0,
    minLDR: 0,
    totalReadings: 0
  };

  const timeSeriesData = filteredData.length > 0 ? SensorAPI.getTimeSeriesData(filteredData) : {
    temperature: [],
    humidity: [],
    voltage: [],
    ldr: []
  };

  return {
    data,
    filteredData,
    analytics,
    timeSeriesData,
    isLoading,
    error,
    selectedCount,
    setSelectedCount: handleCountChange,
    refetch
  };
};
