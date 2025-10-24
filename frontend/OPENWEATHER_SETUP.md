# OpenWeatherMap API Setup Guide

## Getting Your API Key

1. **Sign up for OpenWeatherMap**
   - Go to [OpenWeatherMap.org](https://openweathermap.org)
   - Click "Sign Up" and create a free account
   - Verify your email address

2. **Get Your API Key**
   - Log in to your account
   - Go to "My API Keys" section
   - Copy your API key (it will look like: `a553ca1c4b774cfdb9f71012252410`)

3. **Update the Configuration**
   - Open `frontend/vite.config.ts`
   - Find the line: `url.searchParams.set('appid', 'YOUR_OPENWEATHER_API_KEY');`
   - Replace `YOUR_OPENWEATHER_API_KEY` with your actual API key

## API Limits (Free Tier)
- **1,000 calls per day**
- **60 calls per minute**
- **Current weather and 5-day forecast**
- **Historical data (last 5 days)**

## Features Included
- ✅ Current weather conditions
- ✅ 7-day weather forecast
- ✅ Temperature, humidity, wind speed
- ✅ Weather icons and descriptions
- ✅ Probability of precipitation
- ✅ UV index and visibility

## Troubleshooting
- **CORS errors**: The proxy configuration handles this automatically
- **API key errors**: Make sure your API key is correct and activated
- **Rate limiting**: The free tier has limits, but should be sufficient for development

## Example API Key Format
```typescript
url.searchParams.set('appid', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6');
```
