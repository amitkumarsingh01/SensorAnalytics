import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/weather': {
        target: 'https://www.weatherunion.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, '/gw/weather/external/v0/get_weather_data'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            // Add the API key header
            proxyReq.setHeader('x-zomato-api-key', '836c2e57ca92b87556bc4141b9915ba3');
          });
        },
      },
      '/api/openweather': {
        target: 'https://api.openweathermap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openweather/, '/data/2.5/weather'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            // Parse the original URL to get lat/lon parameters
            const originalUrl = new URL(proxyReq.path, 'http://localhost:5176');
            const lat = originalUrl.searchParams.get('lat');
            const lon = originalUrl.searchParams.get('lon');
            
            // Build the correct OpenWeatherMap API URL (using free Current Weather API)
            const apiUrl = new URL('/data/2.5/weather', 'https://api.openweathermap.org');
            apiUrl.searchParams.set('lat', lat || '12.933756');
            apiUrl.searchParams.set('lon', lon || '77.625825');
            apiUrl.searchParams.set('appid', process.env.VITE_OPENWEATHER_API_KEY || 'ef7f95ba032ed07cc1cd62e6fc657d4a');
            apiUrl.searchParams.set('units', 'metric');
            
            proxyReq.path = apiUrl.pathname + apiUrl.search;
          });
        },
      },
      '/api/sensors': {
        target: 'http://31.97.231.29:4354',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sensors/, '/sensors'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            // Add necessary headers for the sensor API
            proxyReq.setHeader('accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
          });
        },
      },
    },
  },
})
