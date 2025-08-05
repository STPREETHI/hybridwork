const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get weather data
// @route   GET /api/weather
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Using Open-Meteo API (free weather service)
    const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
        hourly: 'temperature_2m,relative_humidity_2m,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
        forecast_days: 7
      }
    });

    const weatherData = weatherResponse.data;

    // Weather code mapping for Open-Meteo
    const getWeatherDescription = (code) => {
      const weatherCodes = {
        0: { description: 'Clear sky', icon: '☀️' },
        1: { description: 'Mainly clear', icon: '🌤️' },
        2: { description: 'Partly cloudy', icon: '⛅' },
        3: { description: 'Overcast', icon: '☁️' },
        45: { description: 'Fog', icon: '🌫️' },
        48: { description: 'Depositing rime fog', icon: '🌫️' },
        51: { description: 'Light drizzle', icon: '🌦️' },
        53: { description: 'Moderate drizzle', icon: '🌦️' },
        55: { description: 'Dense drizzle', icon: '🌧️' },
        61: { description: 'Slight rain', icon: '🌧️' },
        63: { description: 'Moderate rain', icon: '🌧️' },
        65: { description: 'Heavy rain', icon: '⛈️' },
        71: { description: 'Slight snow', icon: '🌨️' },
        73: { description: 'Moderate snow', icon: '❄️' },
        75: { description: 'Heavy snow', icon: '❄️' },
        80: { description: 'Slight rain showers', icon: '🌦️' },
        81: { description: 'Moderate rain showers', icon: '🌧️' },
        82: { description: 'Violent rain showers', icon: '⛈️' },
        95: { description: 'Thunderstorm', icon: '⛈️' },
        96: { description: 'Thunderstorm with hail', icon: '⛈️' },
        99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
      };

      return weatherCodes[code] || { description: 'Unknown', icon: '❓' };
    };

    const currentWeather = weatherData.current_weather;
    const currentWeatherInfo = getWeatherDescription(currentWeather.weather_code);

    // Format response
    const formattedWeather = {
      current: {
        temperature: Math.round(currentWeather.temperature),
        description: currentWeatherInfo.description,
        icon: currentWeatherInfo.icon,
        windSpeed: currentWeather.wind_speed,
        windDirection: currentWeather.wind_direction,
        time: currentWeather.time
      },
      daily: weatherData.daily.time.map((date, index) => {
        const weatherInfo = getWeatherDescription(weatherData.daily.weather_code[index]);
        return {
          date,
          maxTemp: Math.round(weatherData.daily.temperature_2m_max[index]),
          minTemp: Math.round(weatherData.daily.temperature_2m_min[index]),
          description: weatherInfo.description,
          icon: weatherInfo.icon
        };
      }),
      location: city || `${lat}, ${lon}`,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: formattedWeather
    });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch weather data'
    });
  }
});

module.exports = router;