export interface WeatherData {
  status: string;
  message: string;
  device_type: number;
  locality_weather_data: {
    temperature: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number;
    rain_intensity: number;
    rain_accumulation: number;
    aqi_pm_10: number | null;
    aqi_pm_2_point_5: number | null;
  };
}

// Using local proxy to avoid CORS issues
const WEATHER_API_URL = '/api/weather';

export class WeatherAPI {
  static async fetchWeatherData(latitude: number = 12.933756, longitude: number = 77.625825): Promise<WeatherData> {
    try {
      const response = await fetch(`${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  static getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  static getWeatherIcon(temperature: number, rainIntensity: number): string {
    if (rainIntensity > 0) {
      return '🌧️';
    } else if (temperature > 30) {
      return '☀️';
    } else if (temperature > 20) {
      return '🌤️';
    } else {
      return '🌥️';
    }
  }

  static getTemperatureColor(temperature: number): string {
    if (temperature > 35) return 'text-red-600';
    if (temperature > 30) return 'text-orange-600';
    if (temperature > 25) return 'text-yellow-600';
    if (temperature > 20) return 'text-green-600';
    return 'text-blue-600';
  }

  static getHumidityColor(humidity: number): string {
    if (humidity > 80) return 'text-blue-600';
    if (humidity > 60) return 'text-green-600';
    if (humidity > 40) return 'text-yellow-600';
    return 'text-orange-600';
  }
}
