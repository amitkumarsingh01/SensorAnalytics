import React, { useState } from 'react';
import { Power } from 'lucide-react';
import { RelayAPI } from '../services/api';

interface RelayToggleProps {
  voltage?: number;
}

const RelayToggle: React.FC<RelayToggleProps> = ({ voltage }) => {
  const [isOn, setIsOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine if it's the right time based on voltage
  const shouldBeOn = voltage !== undefined && voltage > 6;
  const shouldBeOff = voltage !== undefined && voltage < 6;

  const handleToggle = async () => {
    const newStatus = !isOn;
    setIsLoading(true);
    setError(null);

    try {
      await RelayAPI.setRelayStatus(!newStatus);
      setIsOn(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update relay status');
      console.error('Relay toggle error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Relay Control</h3>
          <p className="text-sm text-gray-600">
            {isOn ? 'Relay is ON' : 'Relay is OFF'}
          </p>
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`
            relative w-16 h-8 rounded-full transition-all duration-300 ease-in-out
            ${isOn ? 'bg-green-500' : 'bg-gray-300'}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          `}
        >
          <span
            className={`
              absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md
              transform transition-transform duration-300 ease-in-out
              ${isOn ? 'translate-x-8' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Power className={`w-5 h-5 ${isOn ? 'text-green-500' : 'text-gray-400'}`} />
        <span className={`text-sm font-medium ${isOn ? 'text-green-600' : 'text-gray-600'}`}>
          {isLoading ? 'Updating...' : isOn ? 'ON' : 'OFF'}
        </span>
      </div>
      
      {/* Voltage-based indication */}
      {voltage !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            This is the right time to turn {shouldBeOn ? 'on' : 'off'} relay
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Voltage: {voltage.toFixed(2)}V</span>
            {shouldBeOn && (
              <span className="text-xs font-medium text-green-600">→ Should be ON</span>
            )}
            {shouldBeOff && (
              <span className="text-xs font-medium text-red-600">→ Should be OFF</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelayToggle;

