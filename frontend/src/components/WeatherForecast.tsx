import React from 'react';
import { Calendar, Droplets, Wind, Eye, Gauge } from 'lucide-react';
import { OpenWeatherAPI } from '../services/openWeatherApi';
import type { OpenWeatherResponse } from '../services/openWeatherApi';

interface WeatherForecastProps {
  weatherData: OpenWeatherResponse | null;
  isLoading: boolean;
  error: string | null;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ 
  weatherData, 
  isLoading, 
  error 
}) => {
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Weather Forecast</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 text-sm">Failed to load weather forecast</div>
          <div className="text-gray-500 text-xs mt-1">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Weather Forecast</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <div className="text-gray-600">Loading forecast...</div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Weather Forecast</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500">No forecast data available</div>
        </div>
      </div>
    );
  }

  const { current, daily } = weatherData;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Calendar className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Weather Forecast</h3>
      </div>

      {/* Current Weather */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm opacity-90 mb-1">Current Weather</h4>
            <div className="flex items-center">
              <span className="text-3xl font-bold">{Math.round(current.temp)}°C</span>
              <div className="ml-3">
                <div className="text-sm opacity-90">{current.weather[0].description}</div>
                <div className="text-xs opacity-75">Feels like {Math.round(current.feels_like)}°C</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-2">
              {OpenWeatherAPI.getWeatherIcon(current.weather[0].icon)}
            </div>
            <div className="text-xs opacity-75">
              {OpenWeatherAPI.formatTime(current.dt)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
          <div className="flex items-center">
            <Droplets className="w-4 h-4 mr-2 opacity-80" />
            <span>{current.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="w-4 h-4 mr-2 opacity-80" />
            <span>{current.wind_speed} m/s</span>
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-2 opacity-80" />
            <span>{(current.visibility / 1000).toFixed(1)} km</span>
          </div>
          <div className="flex items-center">
            <Gauge className="w-4 h-4 mr-2 opacity-80" />
            <span>{current.pressure} hPa</span>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">7-Day Forecast</h4>
        <div className="space-y-3">
          {daily.slice(0, 7).map((day, index) => (
            <div key={day.dt} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <div className="w-12 text-sm font-medium text-gray-700">
                  {index === 0 ? 'Today' : OpenWeatherAPI.formatDate(day.dt)}
                </div>
                <div className="ml-4">
                  <div className="text-2xl">
                    {OpenWeatherAPI.getWeatherIcon(day.weather[0].icon)}
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm text-gray-600">{day.weather[0].description}</div>
                  <div className="text-xs text-gray-500">
                    {Math.round(day.pop * 100)}% chance of rain
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{day.wind_speed} m/s</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{day.humidity}%</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {Math.round(day.temp.max)}°/{Math.round(day.temp.min)}°
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
