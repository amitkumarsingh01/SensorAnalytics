export interface OpenWeatherCurrent {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
  name: string;
}

export interface OpenWeatherResponse {
  current: OpenWeatherCurrent;
  daily: OpenWeatherCurrent[]; // For now, we'll use current weather data
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
}

// Use Vercel API route to avoid CORS issues
const OPENWEATHER_API_URL = '/api/openweather';

export class OpenWeatherAPI {
  static async fetchWeatherData(latitude: number = 12.9716, longitude: number = 77.5946): Promise<OpenWeatherResponse> {
    try {
      // Build URL for Vercel API route
      const url = `${OPENWEATHER_API_URL}?lat=${latitude}&lon=${longitude}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the Current Weather API response to match our interface
      return {
        current: data,
        daily: [data], // Use current weather as daily data for now
        lat: data.coord?.lat || latitude,
        lon: data.coord?.lon || longitude,
        timezone: 'UTC',
        timezone_offset: 0
      };
    } catch (error) {
      console.error('Error fetching OpenWeather data:', error);
      throw error; // Don't use mock data, throw the error
    }
  }

  // No mock data - only real API data

  static getWeatherIcon(iconCode: string): string {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  }

  static getTemperatureColor(temperature: number): string {
    if (temperature > 35) return 'text-red-600';
    if (temperature > 30) return 'text-orange-600';
    if (temperature > 25) return 'text-yellow-600';
    if (temperature > 20) return 'text-green-600';
    return 'text-blue-600';
  }

  static getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  static formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  static formatTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
