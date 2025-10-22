import React from 'react';
import { 
  TemperatureChart, 
  HumidityChart, 
  VoltageChart, 
  LDRChart 
} from '../components/Charts';
import { sensorData, calculateAnalytics } from '../data/sensorData';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Thermometer,
  Droplets,
  Zap,
  Sun
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
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
        <div className="flex items-center">
          <div className="p-3 bg-purple-500 rounded-lg mr-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comprehensive Analytics</h1>
            <p className="text-gray-600 mt-1">Advanced analytics and insights across all sensor data</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Data Points"
          value={analytics.totalReadings.toString()}
          icon={Activity}
          color="bg-purple-500"
          subtitle="Total sensor readings"
        />
        <StatCard
          title="Monitoring Duration"
          value="2.5 hours"
          icon={Activity}
          color="bg-blue-500"
          subtitle="Continuous monitoring"
        />
        <StatCard
          title="Data Quality"
          value="99.8%"
          icon={Activity}
          color="bg-green-500"
          subtitle="Sensor reliability"
        />
        <StatCard
          title="Update Frequency"
          value="5 min"
          icon={Activity}
          color="bg-orange-500"
          subtitle="Reading interval"
        />
      </div>

      {/* All Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TemperatureChart />
        <HumidityChart />
        <VoltageChart />
        <LDRChart />
      </div>

      {/* Correlation Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sensor Correlation Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <Thermometer className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h4 className="font-semibold text-red-900">Temperature</h4>
            <p className="text-sm text-red-700 mt-1">
              Range: {analytics.minTemperature.toFixed(1)}°C - {analytics.maxTemperature.toFixed(1)}°C
            </p>
            <p className="text-xs text-red-600 mt-2">
              Avg: {analytics.avgTemperature.toFixed(1)}°C
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-900">Humidity</h4>
            <p className="text-sm text-blue-700 mt-1">
              Range: {analytics.minHumidity.toFixed(1)}% - {analytics.maxHumidity.toFixed(1)}%
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Avg: {analytics.avgHumidity.toFixed(1)}%
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-semibold text-yellow-900">Voltage</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Range: {analytics.minVoltage.toFixed(2)}V - {analytics.maxVoltage.toFixed(2)}V
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Avg: {analytics.avgVoltage.toFixed(2)}V
            </p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Sun className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h4 className="font-semibold text-orange-900">LDR</h4>
            <p className="text-sm text-orange-700 mt-1">
              Range: {analytics.minLDR.toFixed(1)}% - {analytics.maxLDR.toFixed(1)}%
            </p>
            <p className="text-xs text-orange-600 mt-2">
              Avg: {analytics.avgLDR.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Temperature Trend</h4>
              <p className="text-blue-800 text-sm">
                Temperature shows a steady increase from {analytics.minTemperature.toFixed(1)}°C to {analytics.maxTemperature.toFixed(1)}°C, 
                indicating warming environmental conditions over the monitoring period.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Humidity Pattern</h4>
              <p className="text-green-800 text-sm">
                Humidity decreases from {analytics.maxHumidity.toFixed(1)}% to {analytics.minHumidity.toFixed(1)}%, 
                showing an inverse relationship with temperature changes.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Power Stability</h4>
              <p className="text-yellow-800 text-sm">
                Voltage remains stable with minimal fluctuation ({analytics.maxVoltage - analytics.minVoltage}V range), 
                ensuring reliable sensor operation.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Monitoring Frequency</h4>
              <p className="text-purple-800 text-sm">
                Consider increasing monitoring frequency during peak temperature hours to capture more detailed patterns.
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-semibold text-indigo-900 mb-2">Data Collection</h4>
              <p className="text-indigo-800 text-sm">
                Implement automated alerts for temperature and humidity thresholds to enable proactive environmental control.
              </p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <h4 className="font-semibold text-pink-900 mb-2">System Optimization</h4>
              <p className="text-pink-800 text-sm">
                Regular calibration of LDR sensor recommended to maintain accuracy across different lighting conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-sm p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{analytics.totalReadings}</p>
            <p className="text-sm opacity-90">Total Readings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{(analytics.maxTemperature - analytics.minTemperature).toFixed(1)}°C</p>
            <p className="text-sm opacity-90">Temp Range</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{(analytics.maxHumidity - analytics.minHumidity).toFixed(1)}%</p>
            <p className="text-sm opacity-90">Humidity Range</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{(analytics.maxVoltage - analytics.minVoltage).toFixed(2)}V</p>
            <p className="text-sm opacity-90">Voltage Range</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
