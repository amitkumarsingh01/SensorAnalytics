import React from 'react';
import { HumidityChart } from '../components/Charts';
import { useSensorData } from '../hooks/useSensorData';
import DataFilter from '../components/DataFilter';
import { Droplets, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';

const HumidityPage: React.FC = () => {
  const { 
    filteredData, 
    analytics,
    selectedCount,
    setSelectedCount,
    isLoading,
    refetch
  } = useSensorData();
  const latestReading = filteredData[filteredData.length - 1];

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ComponentType<any>;
    color: string;
    trend?: 'up' | 'down' | 'stable';
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500 mr-1" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500 mr-1" />}
          {trend === 'stable' && <Minus className="w-4 h-4 text-gray-500 mr-1" />}
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg mr-4">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Humidity Analytics</h1>
              <p className="text-gray-600 mt-1">Detailed humidity monitoring and analysis</p>
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

      {/* Current Reading */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Current Humidity</h2>
            <p className="text-4xl font-bold">{latestReading?.humidity}%</p>
            <p className="text-sm opacity-90 mt-1">Last updated: {latestReading?.created_at}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Status</p>
            <div className="flex items-center mt-1">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-sm">Normal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Humidity"
          value={`${analytics.avgHumidity.toFixed(1)}%`}
          icon={Droplets}
          color="bg-blue-500"
          trend="down"
        />
        <StatCard
          title="Maximum Humidity"
          value={`${analytics.maxHumidity.toFixed(1)}%`}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title="Minimum Humidity"
          value={`${analytics.minHumidity.toFixed(1)}%`}
          icon={TrendingDown}
          color="bg-red-500"
        />
        <StatCard
          title="Humidity Range"
          value={`${(analytics.maxHumidity - analytics.minHumidity).toFixed(1)}%`}
          icon={Minus}
          color="bg-purple-500"
        />
      </div>

      {/* Chart */}
      <HumidityChart />

      {/* Humidity Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Humidity Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Below 50%</span>
                <span className="font-medium">{filteredData.filter(d => d.humidity < 50).length} readings</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(filteredData.filter(d => d.humidity < 50).length / filteredData.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">50% - 60%</span>
                <span className="font-medium">{filteredData.filter(d => d.humidity >= 50 && d.humidity <= 60).length} readings</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${(filteredData.filter(d => d.humidity >= 50 && d.humidity <= 60).length / filteredData.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Above 60%</span>
                <span className="font-medium">{filteredData.filter(d => d.humidity > 60).length} readings</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(filteredData.filter(d => d.humidity > 60).length / filteredData.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Humidity Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Trend Analysis</h4>
              <p className="text-blue-800 text-sm">
                Humidity shows a gradual decrease from {analytics.maxHumidity.toFixed(1)}% to {analytics.minHumidity.toFixed(1)}% over the monitoring period.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Comfort Level</h4>
              <p className="text-green-800 text-sm">
                Average humidity of {analytics.avgHumidity.toFixed(1)}% is within comfortable range for most environments.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Recommendations</h4>
              <p className="text-yellow-800 text-sm">
                Monitor humidity levels during different times of day to identify optimal conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumidityPage;
