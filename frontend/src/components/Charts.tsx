import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { useSensorData } from '../hooks/useSensorData';

interface ChartProps {
  title: string;
  data: any[];
  color: string;
  unit: string;
  type?: 'line' | 'area' | 'bar';
}

const Chart: React.FC<ChartProps> = ({ 
  title, 
  data, 
  color, 
  unit, 
  type = 'line' 
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{`Time: ${label}`}</p>
          <p className="font-semibold" style={{ color }}>
            {`${title}: ${payload[0].value}${unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill={color} />
          </BarChart>
        );
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TemperatureChart: React.FC = () => {
  const { timeSeriesData } = useSensorData();
  return (
    <Chart
      title="Temperature Over Time"
      data={timeSeriesData.temperature}
      color="#ef4444"
      unit="°C"
      type="area"
    />
  );
};

export const HumidityChart: React.FC = () => {
  const { timeSeriesData } = useSensorData();
  return (
    <Chart
      title="Humidity Over Time"
      data={timeSeriesData.humidity}
      color="#3b82f6"
      unit="%"
      type="area"
    />
  );
};

export const VoltageChart: React.FC = () => {
  const { timeSeriesData } = useSensorData();
  return (
    <Chart
      title="Voltage Over Time"
      data={timeSeriesData.voltage}
      color="#eab308"
      unit="V"
      type="line"
    />
  );
};

export const LDRChart: React.FC = () => {
  const { timeSeriesData } = useSensorData();
  return (
    <Chart
      title="LDR (Light) Over Time"
      data={timeSeriesData.ldr}
      color="#f97316"
      unit="%"
      type="bar"
    />
  );
};

export default Chart;
