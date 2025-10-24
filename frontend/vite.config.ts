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
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add the API key header
            proxyReq.setHeader('x-zomato-api-key', '836c2e57ca92b87556bc4141b9915ba3');
          });
        },
      },
    },
  },
})
