import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Thermometer } from "lucide-react";
import { Card } from "@/components/ui/card";

// WeatherData structure: location, temperature, condition, humidity, windSpeed

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate weather data - Replace with real API call to Open-Meteo or similar free service
    const fetchWeather = async () => {
      try {
        // For demo purposes, using mock data
        // Real implementation would use: https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true
        setTimeout(() => {
          setWeather({
            location: "New York Office",
            temperature: 22,
            condition: "Partly Cloudy",
            humidity: 65,
            windSpeed: 12
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Weather fetch error:", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition) => {
    if (condition.includes("rain") || condition.includes("Rain")) {
      return <CloudRain className="w-8 h-8 text-blue-medium" />;
    } else if (condition.includes("cloud") || condition.includes("Cloud")) {
      return <Cloud className="w-8 h-8 text-muted-foreground" />;
    } else {
      return <Sun className="w-8 h-8 text-warning" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-4 bg-gradient-to-br from-blue-light to-white border-blue-medium/20">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-medium/20 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-blue-medium/20 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="p-4 bg-gradient-to-br from-blue-light to-white border-blue-medium/20">
        <p className="text-sm text-muted-foreground">Weather unavailable</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-light to-white border-blue-medium/20 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-foreground">{weather.location}</h3>
        {getWeatherIcon(weather.condition)}
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        <Thermometer className="w-5 h-5 text-blue-medium" />
        <span className="text-2xl font-bold text-blue-dark">{weather.temperature}°C</span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">{weather.condition}</p>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/50 rounded p-2">
          <span className="text-muted-foreground">Humidity</span>
          <p className="font-semibold text-blue-dark">{weather.humidity}%</p>
        </div>
        <div className="bg-white/50 rounded p-2">
          <span className="text-muted-foreground">Wind</span>
          <p className="font-semibold text-blue-dark">{weather.windSpeed} km/h</p>
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;