import React from 'react';
import { Cloud, Wind, Droplets, Thermometer, MapPin, RefreshCw } from 'lucide-react';
import { WeatherAPI } from '../services/weatherApi';
import type { WeatherData } from '../services/weatherApi';

interface WeatherWidgetProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  weatherData, 
  isLoading, 
  error, 
  onRefresh 
}) => {
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weather Data</h3>
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-8">
          <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-red-600 font-medium">Failed to load weather data</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weather Data</h3>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weather Data</h3>
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-8">
          <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No weather data available</p>
        </div>
      </div>
    );
  }

  const { locality_weather_data } = weatherData;
  const weatherIcon = WeatherAPI.getWeatherIcon(locality_weather_data.temperature, locality_weather_data.rain_intensity);
  const windDirection = WeatherAPI.getWindDirection(locality_weather_data.wind_direction);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">Current Weather</h3>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Temperature */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 lg:p-4">
          <div className="flex flex-col items-center text-center">
            <Thermometer className="w-6 h-6 lg:w-8 lg:h-8 opacity-80 mb-2" />
            <p className="text-xs lg:text-sm opacity-90 mb-1">Temperature</p>
            <p className="text-lg lg:text-2xl font-bold">{locality_weather_data.temperature}°C</p>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 lg:p-4">
          <div className="flex flex-col items-center text-center">
            <Droplets className="w-6 h-6 lg:w-8 lg:h-8 opacity-80 mb-2" />
            <p className="text-xs lg:text-sm opacity-90 mb-1">Humidity</p>
            <p className="text-lg lg:text-2xl font-bold">{locality_weather_data.humidity}%</p>
          </div>
        </div>

        {/* Wind */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 lg:p-4">
          <div className="flex flex-col items-center text-center">
            <Wind className="w-6 h-6 lg:w-8 lg:h-8 opacity-80 mb-2" />
            <p className="text-xs lg:text-sm opacity-90 mb-1">Wind</p>
            <p className="text-sm lg:text-lg font-bold">{locality_weather_data.wind_speed} m/s</p>
            <p className="text-xs opacity-80">{windDirection}</p>
          </div>
        </div>

        {/* Rain */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 lg:p-4">
          <div className="flex flex-col items-center text-center">
            <Cloud className="w-6 h-6 lg:w-8 lg:h-8 opacity-80 mb-2" />
            <p className="text-xs lg:text-sm opacity-90 mb-1">Rain</p>
            <p className="text-sm lg:text-lg font-bold">{locality_weather_data.rain_intensity} mm/h</p>
            <p className="text-xs opacity-80">Acc: {locality_weather_data.rain_accumulation}mm</p>
          </div>
        </div>
      </div>

      {/* Weather Status */}
      {/* <div className="mt-4 text-center">
        <div className="text-3xl mb-2">{weatherIcon}</div>
        <p className="text-sm opacity-90">
          {locality_weather_data.rain_intensity > 0 
            ? 'Rainy conditions' 
            : locality_weather_data.temperature > 30 
            ? 'Hot and sunny' 
            : 'Pleasant weather'
          }
        </p>
      </div> */}
    </div>
  );
};

export default WeatherWidget;
