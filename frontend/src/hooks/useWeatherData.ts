import { useState, useEffect, useCallback } from 'react';
import { WeatherAPI } from '../services/weatherApi';
import type { WeatherData } from '../services/weatherApi';

interface UseWeatherDataReturn {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useWeatherData = (): UseWeatherDataReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await WeatherAPI.fetchWeatherData();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Error fetching weather data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Initial data fetch
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return {
    weatherData,
    isLoading,
    error,
    refetch
  };
};
