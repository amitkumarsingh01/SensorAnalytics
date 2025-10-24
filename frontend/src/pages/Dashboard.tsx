import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Zap, 
  Sun, 
  TrendingUp, 
  TrendingDown,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useSensorData } from '../hooks/useSensorData';
import { useWeatherData } from '../hooks/useWeatherData';
import { useOpenWeather } from '../hooks/useOpenWeather';
import DataFilter from '../components/DataFilter';
import WeatherWidget from '../components/WeatherWidget';
import WeatherForecast from '../components/WeatherForecast';

const Dashboard: React.FC = () => {
  const { 
    filteredData, 
    analytics, 
    isLoading, 
    error, 
    selectedCount, 
    setSelectedCount, 
    refetch 
  } = useSensorData();

  const { 
    weatherData, 
    isLoading: weatherLoading, 
    error: weatherError, 
    refetch: refetchWeather 
  } = useWeatherData();

  const { 
    weatherData: openWeatherData, 
    isLoading: openWeatherLoading, 
    error: openWeatherError
  } = useOpenWeather();

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ComponentType<any>;
    color: string;
    trend?: 'up' | 'down' | 'stable';
    subtitle?: string;
  }> = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500 mr-1" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500 mr-1" />}
          {trend === 'stable' && <Activity className="w-4 h-4 text-gray-500 mr-1" />}
          <span className={`text-sm ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
          </span>
        </div>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-red-900 mb-2">Error Loading Data</h1>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Solarithm Dashboard</h1>
            <p className="text-gray-600">Real-time monitoring of temperature, humidity, voltage, and LDR sensors</p>
            <div className="flex items-center mt-4">
              <div className={`w-3 h-3 rounded-full mr-2 ${isLoading ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
              <span className="text-sm text-gray-600">
                {isLoading ? 'Loading...' : `Last updated: ${filteredData[filteredData.length - 1]?.created_at || 'No data'}`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DataFilter 
              selectedCount={selectedCount}
              onCountChange={setSelectedCount}
              isLoading={isLoading}
              compact={true}
            />
            <button
              onClick={refetch}
              disabled={isLoading}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Weather Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* <WeatherWidget 
          weatherData={weatherData}
          isLoading={weatherLoading}
          error={weatherError}
          onRefresh={refetchWeather}
        /> */}
        <WeatherForecast 
          weatherData={openWeatherData}
          isLoading={openWeatherLoading}
          error={openWeatherError}
        />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Temperature"
          value={`${analytics.avgTemperature.toFixed(1)}°C`}
          icon={Thermometer}
          color="bg-red-500"
          trend="up"
          subtitle={`Range: ${analytics.minTemperature.toFixed(1)}°C - ${analytics.maxTemperature.toFixed(1)}°C`}
        />
        <StatCard
          title="Average Humidity"
          value={`${analytics.avgHumidity.toFixed(1)}%`}
          icon={Droplets}
          color="bg-blue-500"
          trend="down"
          subtitle={`Range: ${analytics.minHumidity.toFixed(1)}% - ${analytics.maxHumidity.toFixed(1)}%`}
        />
        <StatCard
          title="Average Voltage"
          value={`${analytics.avgVoltage.toFixed(2)}V`}
          icon={Zap}
          color="bg-yellow-500"
          trend="stable"
          subtitle={`Range: ${analytics.minVoltage.toFixed(2)}V - ${analytics.maxVoltage.toFixed(2)}V`}
        />
        <StatCard
          title="Average LDR"
          value={`${analytics.avgLDR.toFixed(1)}%`}
          icon={Sun}
          color="bg-orange-500"
          trend="stable"
          subtitle={`Range: ${analytics.minLDR.toFixed(1)}% - ${analytics.maxLDR.toFixed(1)}%`}
        />
      </div>

      {/* Sensor vs Weather Comparison */}
      {weatherData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor vs Weather Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Your Sensors</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-semibold text-red-600">
                    {filteredData[filteredData.length - 1]?.temp}°C
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Humidity</span>
                  <span className="font-semibold text-blue-600">
                    {filteredData[filteredData.length - 1]?.humidity}%
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Weather API</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-semibold text-red-600">
                    {weatherData.locality_weather_data.temperature}°C
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Humidity</span>
                  <span className="font-semibold text-blue-600">
                    {weatherData.locality_weather_data.humidity}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Difference:</strong> Temperature difference of{' '}
              {Math.abs((filteredData[filteredData.length - 1]?.temp || 0) - weatherData.locality_weather_data.temperature).toFixed(1)}°C,{' '}
              Humidity difference of{' '}
              {Math.abs((filteredData[filteredData.length - 1]?.humidity || 0) - weatherData.locality_weather_data.humidity).toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Readings</span>
              <span className="font-semibold">{analytics.totalReadings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date Range</span>
              <span className="font-semibold">{filteredData[0]?.created_at?.split(' ')[0] || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Range</span>
              <span className="font-semibold">
                {filteredData[0]?.created_at?.split(' ')[1] || 'N/A'} - {filteredData[filteredData.length - 1]?.created_at?.split(' ')[1] || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trends</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current</span>
              <span className="font-semibold text-red-600">{filteredData[filteredData.length - 1]?.temp}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Peak</span>
              <span className="font-semibold">{analytics.maxTemperature.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Low</span>
              <span className="font-semibold">{analytics.minTemperature.toFixed(1)}°C</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Humidity Trends</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current</span>
              <span className="font-semibold text-blue-600">{filteredData[filteredData.length - 1]?.humidity}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Peak</span>
              <span className="font-semibold">{analytics.maxHumidity.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Low</span>
              <span className="font-semibold">{analytics.minHumidity.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Readings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Readings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Temperature</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Humidity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Voltage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">LDR</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(-5).reverse().map((reading) => (
                <tr key={reading.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{reading.created_at}</td>
                  <td className="py-3 px-4">
                    <span className="text-red-600 font-medium">{reading.temp}°C</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-blue-600 font-medium">{reading.humidity}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-yellow-600 font-medium">{reading.voltage}V</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-orange-600 font-medium">{reading.ldr}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
