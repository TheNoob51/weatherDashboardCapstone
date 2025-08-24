import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Sunrise, Sunset, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Toaster, toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useGeolocation } from '../hooks/useGeolocation';
import { weatherService, type WeatherData, type HourlyForecast, type DailyForecast, type WeatherAlert } from '../services/weatherService';
import { locationService, type SearchLocation } from '../services/locationService';
import WeatherAlerts from './WeatherAlerts';
import WeatherAnimations from './WeatherAnimations';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';
import WeatherTransition from './WeatherTransition';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [selectedLocation, setSelectedLocation] = useState<SearchLocation | null>(null);
  const [usingGeolocation, setUsingGeolocation] = useState(true);
  const [previousCondition, setPreviousCondition] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { latitude, longitude, error: locationError, loading: locationLoading, refetch } = useGeolocation();

  const fetchWeatherData = async (lat: number, lon: number, locationName?: string) => {
    setLoading(true);
    try {
      const [current, hourly, daily, alerts] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon),
        weatherService.getHourlyForecast(lat, lon),
        weatherService.getDailyForecast(lat, lon),
        weatherService.getWeatherAlerts(lat, lon),
      ]);

      // Check if weather condition changed for transition effect
      if (weatherData && weatherData.condition !== current.condition) {
        setPreviousCondition(weatherData.condition);
        setIsTransitioning(true);
        
        // Delay setting new weather data for smooth transition
        setTimeout(() => {
          setWeatherData(current);
          setIsTransitioning(false);
        }, 1000);
      } else {
        setWeatherData(current);
      }

      setHourlyForecast(hourly);
      setDailyForecast(daily);
      setWeatherAlerts(alerts);
      
      if (alerts.length > 0) {
        toast.info(`${alerts.length} weather alert${alerts.length > 1 ? 's' : ''} in ${locationName || current.location}`);
      }
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      toast.error('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle geolocation-based weather
  useEffect(() => {
    if (latitude && longitude && usingGeolocation) {
      fetchWeatherData(latitude, longitude);
      
      // Try to get location name from coordinates
      locationService.reverseGeocode(latitude, longitude).then(location => {
        if (location) {
          setSelectedLocation(location);
        }
      }).catch(console.error);
    }
  }, [latitude, longitude, usingGeolocation]);

  useEffect(() => {
    if (locationError) {
      toast.error('Location access required', {
        description: locationError,
        action: {
          label: 'Retry',
          onClick: refetch,
        },
      });
    }
  }, [locationError, refetch]);

  const handleLocationSelect = (location: SearchLocation) => {
    setSelectedLocation(location);
    setUsingGeolocation(false);
    fetchWeatherData(location.lat, location.lon, location.displayName);
    toast.success(`Weather updated for ${location.displayName}`);
  };

  const handleUseCurrentLocation = () => {
    if (latitude && longitude) {
      setUsingGeolocation(true);
      fetchWeatherData(latitude, longitude);
      toast.success('Using your current location');
    } else {
      refetch();
    }
  };

  const handleRefresh = () => {
    if (selectedLocation && !usingGeolocation) {
      fetchWeatherData(selectedLocation.lat, selectedLocation.lon, selectedLocation.displayName);
    } else if (latitude && longitude) {
      fetchWeatherData(latitude, longitude);
    } else {
      refetch();
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return Sun;
      case 'rain': case 'drizzle': return CloudRain;
      case 'snow': return CloudSnow;
      case 'clouds': return Cloud;
      default: return Cloud;
    }
  };

  const getAnimationIntensity = (): 'light' | 'moderate' | 'heavy' => {
    if (!weatherData) return 'moderate';
    
    const condition = weatherData.condition.toLowerCase();
    const windSpeed = weatherData.windSpeed;
    
    if (condition.includes('heavy') || condition.includes('storm') || windSpeed > 30) return 'heavy';
    if (condition.includes('light') || windSpeed < 10) return 'light';
    return 'moderate';
  };

  const getWindData = () => {
    return hourlyForecast.slice(0, 6).map((hour, index) => ({
      time: `${hour.hour}:00`,
      value: hour.windSpeed,
    }));
  };

  const getTemperatureData = () => {
    return hourlyForecast.map(hour => ({
      hour: hour.hour,
      temp: hour.temp,
    }));
  };

  const getSunData = () => {
    if (!weatherData) return [];
    
    const now = Date.now() / 1000;
    const sunriseTime = weatherData.sunrise;
    const sunsetTime = weatherData.sunset;
    
    const dayLength = sunsetTime - sunriseTime;
    const currentProgress = Math.max(0, Math.min(1, (now - sunriseTime) / dayLength));
    
    return [
      { name: 'Daylight', value: currentProgress * 100, fill: '#fbbf24' },
      { name: 'Night', value: (1 - currentProgress) * 100, fill: '#1f2937' },
    ];
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    }) + ' | ' + new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getBackgroundImage = () => {
    if (!weatherData) return "https://images.unsplash.com/photo-1706178182179-c008245a1255?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9ybSUyMGNsb3VkcyUyMGRhcmslMjBkcmFtYXRpYyUyMHNreXxlbnwxfHx8fDE3NTU5NzA0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080";
    
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes('clear') || condition.includes('sun')) {
      return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhciUyMHNreSUyMHN1bm55fGVufDF8fHx8MTc1NTk3MDQ4NXww&ixlib=rb-4.1.0&q=80&w=1080";
    } else if (condition.includes('rain') || condition.includes('storm')) {
      return "https://images.unsplash.com/photo-1706178182179-c008245a1255?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9ybSUyMGNsb3VkcyUyMGRhcmslMjBkcmFtYXRpYyUyMHNreXxlbnwxfHx8fDE3NTU5NzA0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080";
    } else {
      return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhciUyMHNreSUyMHN1bm55fGVufDF8fHx8MTc1NTk3MDQ4NXww&ixlib=rb-4.1.0&q=80&w=1080";
    }
  };

  const filteredAlerts = weatherAlerts.filter(alert => !dismissedAlerts.has(alert.id));

  if (locationLoading && usingGeolocation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Cloud className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl mb-2">Getting your location...</h2>
          <p className="text-white/70">Please allow location access for personalized weather</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <Toaster theme="dark" position="top-right" />
      
      {/* Background Image */}
      <div className="absolute inset-0 opacity-60">
        <ImageWithFallback
          src={getBackgroundImage()}
          alt="Weather background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Weather Animations Overlay */}
      {weatherData && !isTransitioning && (
        <WeatherAnimations
          condition={weatherData.condition}
          temperature={weatherData.temperature}
          windSpeed={weatherData.windSpeed}
          intensity={getAnimationIntensity()}
        />
      )}

      {/* Weather Transition Effect */}
      <WeatherTransition
        isTransitioning={isTransitioning}
        fromCondition={previousCondition}
        toCondition={weatherData?.condition || ''}
        onComplete={() => setIsTransitioning(false)}
      />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" style={{ zIndex: 2 }}></div>

      {/* Main Content */}
      <div className="relative p-4 max-w-7xl mx-auto" style={{ zIndex: 3 }}>
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AnimatedWeatherIcon 
              condition={weatherData?.condition || 'clouds'} 
              size={32}
              temperature={weatherData?.temperature}
              className="text-blue-400"
            />
            <span className="text-xl font-medium">forecast now</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm text-white/80">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh weather data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              {!usingGeolocation && latitude && longitude && (
                <button
                  onClick={handleUseCurrentLocation}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Use current location"
                >
                  <MapPin className="w-4 h-4" />
                </button>
              )}
              
              <AnimatedWeatherIcon condition="wind" size={16} />
              <AnimatedWeatherIcon condition="clear" size={16} />
              
              {filteredAlerts.length > 0 && (
                <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-black font-medium">{filteredAlerts.length}</span>
                </div>
              )}
            </div>
            
            <div className="text-right text-sm">
              <div className="text-white/60">{getCurrentTime()}</div>
            </div>
            
            <div className="flex items-center gap-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwYXZhdGFyJTIwdXNlcnxlbnwxfHx8fDE3NTU5NzA0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-sm">
                <div className="text-white">Sam Rose</div>
                <div className="text-white/60 text-xs">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Location Error (if any) */}
        {locationError && usingGeolocation && (
          <div className="mb-6 p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-100">Location Access Required</h4>
                <p className="text-sm text-orange-200/80 mt-1">{locationError}</p>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={refetch}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather Alerts */}
        {filteredAlerts.length > 0 && (
          <div className="mb-8">
            <WeatherAlerts alerts={filteredAlerts} onDismiss={handleDismissAlert} />
          </div>
        )}

        {/* Main Weather Display - Compact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Main Weather */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-start gap-4">
              <div className="flex-1">
                <h1 className="text-5xl font-light mb-3 capitalize drop-shadow-2xl">
                  {weatherData?.description || 'Loading...'}
                </h1>
                <p className="text-xl text-white/90 mb-4 drop-shadow-lg">
                  {weatherData ? `Current conditions in ${weatherData.location}` : 'Getting weather data...'}
                </p>
                <p className="text-white/80 max-w-md leading-relaxed text-base">
                  {weatherData ? (
                    `Humidity: ${weatherData.humidity}% • Pressure: ${weatherData.pressure} hPa • Visibility: ${weatherData.visibility} km`
                  ) : (
                    'Loading detailed weather information...'
                  )}
                </p>
              </div>
              
              {/* Large animated weather icon */}
              {weatherData && (
                <div className="flex-shrink-0">
                  <AnimatedWeatherIcon 
                    condition={weatherData.condition} 
                    size={120}
                    temperature={weatherData.temperature}
                    className="drop-shadow-2xl filter brightness-110"
                  />
                </div>
              )}
            </div>

            <div className="flex items-end gap-6">
              <div className="text-7xl font-light drop-shadow-2xl">
                {weatherData ? `${weatherData.temperature}°` : '--°'}
              </div>
              <div className="text-sm text-white/80 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{weatherData ? `${weatherData.location}, ${weatherData.country}` : 'Unknown location'}</span>
                </div>
                <div className="mb-1">UV Index: {weatherData?.uvIndex || '--'}</div>
                {!usingGeolocation && selectedLocation && (
                  <div className="text-xs text-blue-300 mt-2">
                    📍 Custom location
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-4">
            {/* Wind Status */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-base">Wind status</span>
                <span className="text-2xl font-light">
                  {weatherData ? weatherData.windSpeed : '--'} <span className="text-sm">km/h</span>
                </span>
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getWindData()}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#60a5fa" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sunrise/Sunset */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-base">Sunrise</span>
                <span className="text-white/80 text-base">Sunset</span>
              </div>
              
              <div className="relative h-20 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getSunData()}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={35}
                      outerRadius={55}
                      dataKey="value"
                    >
                      {getSunData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-end justify-center pb-1">
                  <AnimatedWeatherIcon condition="clear" size={20} />
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>{weatherData ? formatTime(weatherData.sunrise) : '--:--'}</span>
                <span>{weatherData ? formatTime(weatherData.sunset) : '--:--'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Layout for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Temperature Chart */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <h3 className="text-lg mb-4">24-Hour Temperature</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTemperatureData()}>
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Area 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#60a5fa" 
                    strokeWidth={2}
                    fill="url(#gradient)"
                    fillOpacity={0.4}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Forecast - Compact */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <h3 className="text-lg mb-4">7-Day Forecast</h3>
            <div className="grid grid-cols-7 gap-2">
              {dailyForecast.map((day, index) => {
                return (
                  <div key={day.day} className="text-center">
                    <div className="text-xs text-white/80 mb-2">{day.day}</div>
                    <div className="text-lg mb-1">{day.temp}°</div>
                    <div className="text-xs text-white/60 mb-2">
                      {day.tempMax}°/{day.tempMin}°
                    </div>
                    
                    {/* Compact Weather Icon */}
                    <div className="relative mb-2">
                      <div className="w-8 h-8 mx-auto rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <AnimatedWeatherIcon 
                          condition={day.condition} 
                          size={16}
                          temperature={day.temp}
                        />
                      </div>
                    </div>
                    
                    <div className="text-xs text-white/70 capitalize truncate">
                      {day.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;