import { useState, useEffect, useCallback } from 'react';
import { OpenWeatherAPI } from '../services/openWeatherApi';
import type { OpenWeatherResponse } from '../services/openWeatherApi';

interface UseOpenWeatherReturn {
  weatherData: OpenWeatherResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useOpenWeather = (latitude: number = 12.933756, longitude: number = 77.625825): UseOpenWeatherReturn => {
  const [weatherData, setWeatherData] = useState<OpenWeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await OpenWeatherAPI.fetchWeatherData(latitude, longitude);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Error fetching OpenWeather data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return {
    weatherData,
    isLoading,
    error,
    refetch: fetchWeatherData,
  };
};
