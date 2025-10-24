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

// Using local proxy to avoid CORS issues
const OPENWEATHER_API_URL = '/api/openweather';

export class OpenWeatherAPI {
  static async fetchWeatherData(latitude: number = 12.9716, longitude: number = 77.5946): Promise<OpenWeatherResponse> {
    try {
      const response = await fetch(`${OPENWEATHER_API_URL}?lat=${latitude}&lon=${longitude}`, {
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
      
      // Return mock data when API fails
      return this.getMockWeatherData(latitude, longitude);
    }
  }

  static getMockWeatherData(latitude: number = 12.9716, longitude: number = 77.5946): OpenWeatherResponse {
    const now = new Date();
    const dailyForecast: OpenWeatherCurrent[] = [];
    
    // Generate 7 days of forecast data for Bangalore
    const weatherConditions = [
      { main: 'Clear', description: 'clear sky', icon: '01d' },
      { main: 'Clouds', description: 'few clouds', icon: '02d' },
      { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
      { main: 'Rain', description: 'light rain', icon: '10d' },
      { main: 'Rain', description: 'moderate rain', icon: '10d' },
      { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
      { main: 'Clear', description: 'clear sky', icon: '01d' }
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      // Bangalore weather patterns (typical for the city)
      const baseTemp = 22 + Math.sin(i * 0.5) * 3; // 19-25°C range
      const tempVariation = Math.random() * 4 - 2; // ±2°C variation
      const finalTemp = baseTemp + tempVariation;
      
      const condition = weatherConditions[i % weatherConditions.length];
      
      dailyForecast.push({
        dt: Math.floor(date.getTime() / 1000),
        main: {
          temp: finalTemp,
          feels_like: finalTemp + Math.random() * 2 - 1,
          humidity: 60 + Math.random() * 30, // 60-90% (typical for Bangalore)
          pressure: 1010 + Math.random() * 10 // 1010-1020 hPa
        },
        weather: [{
          id: 800 + i,
          main: condition.main,
          description: condition.description,
          icon: condition.icon
        }],
        wind: {
          speed: 2 + Math.random() * 8, // 2-10 m/s
          deg: Math.random() * 360
        },
        visibility: 8000 + Math.random() * 2000, // 8-10 km
        sys: {
          sunrise: Math.floor(date.getTime() / 1000) - 3600,
          sunset: Math.floor(date.getTime() / 1000) + 3600
        },
        name: i === 0 ? 'Bangalore' : ''
      });
    }

    return {
      current: dailyForecast[0], // Today's weather
      daily: dailyForecast,
      lat: latitude,
      lon: longitude,
      timezone: 'Asia/Kolkata',
      timezone_offset: 19800 // UTC+5:30 for Bangalore
    };
  }

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
