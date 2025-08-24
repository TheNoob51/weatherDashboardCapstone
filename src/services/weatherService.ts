interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  description: string;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  icon: string;
}

interface HourlyForecast {
  time: string;
  hour: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

interface DailyForecast {
  day: string;
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: number;
  end: number;
  tags: string[];
}

class WeatherService {
  private apiKey = 'a4138b895f333ca8ccb2a890434e74b6';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        location: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        condition: data.weather[0].main.toLowerCase(),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: data.wind.deg,
        pressure: data.main.pressure,
        uvIndex: 0, // UV Index requires separate API call
        visibility: Math.round((data.visibility || 10000) / 1000),
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  }

  async getHourlyForecast(lat: number, lon: number): Promise<HourlyForecast[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toISOString(),
        hour: new Date(item.dt * 1000).getHours().toString().padStart(2, '0'),
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      }));
    } catch (error) {
      console.error('Error fetching hourly forecast:', error);
      throw error;
    }
  }

  async getDailyForecast(lat: number, lon: number): Promise<DailyForecast[]> {
    try {
      // OpenWeather's 5-day forecast API
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Group by day and get daily averages
      const dailyData: { [key: string]: any[] } = {};
      
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(item);
      });

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      return Object.entries(dailyData).slice(0, 7).map(([dateStr, dayData]) => {
        const date = new Date(dateStr);
        const temps = dayData.map(d => d.main.temp);
        const conditions = dayData.map(d => d.weather[0]);
        
        // Get the most common condition for the day
        const conditionCounts = conditions.reduce((acc: any, condition) => {
          acc[condition.main] = (acc[condition.main] || 0) + 1;
          return acc;
        }, {});
        
        const mostCommonCondition = Object.entries(conditionCounts)
          .sort(([,a]: any, [,b]: any) => b - a)[0][0] as string;
        
        const matchingCondition = conditions.find(c => c.main === mostCommonCondition);
        
        return {
          day: days[date.getDay()],
          date: date.toLocaleDateString(),
          temp: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
          tempMin: Math.round(Math.min(...temps)),
          tempMax: Math.round(Math.max(...temps)),
          condition: mostCommonCondition.toLowerCase(),
          description: matchingCondition.description,
          icon: matchingCondition.icon,
          humidity: Math.round(dayData.reduce((sum, d) => sum + d.main.humidity, 0) / dayData.length),
          windSpeed: Math.round(dayData.reduce((sum, d) => sum + d.wind.speed, 0) / dayData.length * 3.6),
        };
      });
    } catch (error) {
      console.error('Error fetching daily forecast:', error);
      throw error;
    }
  }

  async getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    try {
      // Note: Weather alerts require OpenWeather One Call API (subscription)
      // For demo purposes, we'll create mock alerts based on current conditions
      const currentWeather = await this.getCurrentWeather(lat, lon);
      const alerts: WeatherAlert[] = [];

      // Generate alerts based on conditions
      if (currentWeather.windSpeed > 50) {
        alerts.push({
          id: 'wind-warning',
          title: 'High Wind Warning',
          description: `Strong winds of ${currentWeather.windSpeed} km/h detected. Secure loose objects and avoid unnecessary travel.`,
          severity: 'moderate',
          start: Date.now(),
          end: Date.now() + (6 * 60 * 60 * 1000), // 6 hours
          tags: ['wind'],
        });
      }

      if (currentWeather.condition.includes('storm') || currentWeather.condition.includes('thunder')) {
        alerts.push({
          id: 'storm-warning',
          title: 'Thunderstorm Alert',
          description: 'Thunderstorms with heavy rain and lightning are in your area. Stay indoors and avoid outdoor activities.',
          severity: 'severe',
          start: Date.now(),
          end: Date.now() + (4 * 60 * 60 * 1000), // 4 hours
          tags: ['storm', 'rain', 'lightning'],
        });
      }

      if (currentWeather.temperature > 35) {
        alerts.push({
          id: 'heat-warning',
          title: 'Extreme Heat Warning',
          description: `Temperature of ${currentWeather.temperature}°C poses health risks. Stay hydrated and avoid prolonged sun exposure.`,
          severity: 'moderate',
          start: Date.now(),
          end: Date.now() + (8 * 60 * 60 * 1000), // 8 hours
          tags: ['heat'],
        });
      }

      if (currentWeather.temperature < -10) {
        alerts.push({
          id: 'cold-warning',
          title: 'Extreme Cold Warning',
          description: `Temperature of ${currentWeather.temperature}°C poses risk of frostbite. Dress warmly and limit outdoor exposure.`,
          severity: 'severe',
          start: Date.now(),
          end: Date.now() + (12 * 60 * 60 * 1000), // 12 hours
          tags: ['cold'],
        });
      }

      return alerts;
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  }

  getWeatherIconComponent(iconCode: string, condition: string) {
    // Map OpenWeather icon codes to Lucide icons
    const iconMap: { [key: string]: string } = {
      '01d': 'Sun', '01n': 'Moon',
      '02d': 'CloudSun', '02n': 'CloudMoon',
      '03d': 'Cloud', '03n': 'Cloud',
      '04d': 'Clouds', '04n': 'Clouds',
      '09d': 'CloudRain', '09n': 'CloudRain',
      '10d': 'CloudRainSun', '10n': 'CloudRain',
      '11d': 'Zap', '11n': 'Zap',
      '13d': 'CloudSnow', '13n': 'CloudSnow',
      '50d': 'Haze', '50n': 'Haze',
    };

    return iconMap[iconCode] || 'Cloud';
  }
}

export const weatherService = new WeatherService();
export type { WeatherData, HourlyForecast, DailyForecast, WeatherAlert };