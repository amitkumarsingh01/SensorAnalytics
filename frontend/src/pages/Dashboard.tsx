import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Zap, 
  Sun, 
  TrendingUp, 
  TrendingDown,
  Activity
} from 'lucide-react';
import { sensorData, calculateAnalytics } from '../data/sensorData';

const Dashboard: React.FC = () => {
  const analytics = calculateAnalytics(sensorData);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Solarithm Dashboard</h1>
        <p className="text-gray-600">Real-time monitoring of temperature, humidity, voltage, and LDR sensors</p>
        <div className="flex items-center mt-4">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Last updated: {sensorData[sensorData.length - 1]?.time}</span>
        </div>
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
              <span className="font-semibold">{sensorData[0]?.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Range</span>
              <span className="font-semibold">{sensorData[0]?.time} - {sensorData[sensorData.length - 1]?.time}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trends</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current</span>
              <span className="font-semibold text-red-600">{sensorData[sensorData.length - 1]?.temperature}°C</span>
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
              <span className="font-semibold text-blue-600">{sensorData[sensorData.length - 1]?.humidity}%</span>
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
              {sensorData.slice(-5).reverse().map((reading) => (
                <tr key={reading.sNo} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{reading.time}</td>
                  <td className="py-3 px-4">
                    <span className="text-red-600 font-medium">{reading.temperature}°C</span>
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
