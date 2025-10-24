import React, { useState, useEffect, useRef } from 'react';
import { Filter, Database, Clock, BarChart3, ChevronDown } from 'lucide-react';

interface DataFilterProps {
  selectedCount: number;
  onCountChange: (count: number) => void;
  isLoading?: boolean;
  compact?: boolean;
}

const DataFilter: React.FC<DataFilterProps> = ({ selectedCount, onCountChange, isLoading = false, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const filterOptions = [
    { value: 10, label: 'Last 10', icon: Clock, color: 'bg-green-500' },
    { value: 50, label: 'Last 50', icon: BarChart3, color: 'bg-blue-500' },
    { value: 100, label: 'Last 100', icon: Database, color: 'bg-purple-500' },
    { value: -1, label: 'All Data', icon: Database, color: 'bg-orange-500' }
  ];

  const selectedOption = filterOptions.find(option => option.value === selectedCount) || filterOptions[2];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className={`
            flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium
            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            transition-all duration-200
          `}
        >
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-gray-700">{selectedOption.label}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="py-2">
              {filterOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = selectedCount === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onCountChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2 text-sm text-left
                      ${isSelected 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                      transition-colors duration-150
                    `}
                  >
                    <div className={`p-1 rounded-full ${isSelected ? option.color + ' text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <span className="font-medium">{option.label}</span>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Filter</h3>
            <p className="text-sm text-gray-600">Select the number of data points to display</p>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center bg-white rounded-lg px-3 py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading...</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {filterOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedCount === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => onCountChange(option.value)}
              disabled={isLoading}
              className={`
                relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform
                ${isSelected 
                  ? 'bg-white shadow-lg scale-105 border-2 border-blue-500' 
                  : 'bg-white hover:shadow-md hover:scale-102 border border-gray-200'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-300'}
                group
              `}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`
                  p-3 rounded-full mb-3 transition-colors duration-300
                  ${isSelected ? option.color + ' text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'}
                `}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <p className={`
                  text-sm font-medium transition-colors duration-300
                  ${isSelected ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}
                `}>
                  {option.label}
                </p>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DataFilter;
