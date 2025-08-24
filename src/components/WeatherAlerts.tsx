import React, { useEffect } from 'react';
import { AlertTriangle, Wind, Zap, Thermometer, Snowflake, X } from 'lucide-react';
import { toast } from 'sonner';
import type { WeatherAlert } from '../services/weatherService';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  onDismiss?: (alertId: string) => void;
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts, onDismiss }) => {
  const getSeverityColor = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'minor': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-100';
      case 'moderate': return 'bg-orange-500/20 border-orange-500/30 text-orange-100';
      case 'severe': return 'bg-red-500/20 border-red-500/30 text-red-100';
      case 'extreme': return 'bg-purple-500/20 border-purple-500/30 text-purple-100';
      default: return 'bg-blue-500/20 border-blue-500/30 text-blue-100';
    }
  };

  const getAlertIcon = (tags: string[]) => {
    if (tags.includes('wind')) return Wind;
    if (tags.includes('storm') || tags.includes('lightning')) return Zap;
    if (tags.includes('heat')) return Thermometer;
    if (tags.includes('cold')) return Snowflake;
    return AlertTriangle;
  };

  // Show toast notifications for new severe alerts
  useEffect(() => {
    alerts.forEach(alert => {
      if (alert.severity === 'severe' || alert.severity === 'extreme') {
        toast.error(alert.title, {
          description: alert.description,
          duration: 10000,
        });
      } else if (alert.severity === 'moderate') {
        toast.warning(alert.title, {
          description: alert.description,
          duration: 6000,
        });
      }
    });
  }, [alerts]);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const IconComponent = getAlertIcon(alert.tags);
        const endTime = new Date(alert.end).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        return (
          <div
            key={alert.id}
            className={`rounded-lg border backdrop-blur-sm p-4 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start gap-3">
              <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium">{alert.title}</h4>
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <p className="text-sm opacity-90 mt-1">{alert.description}</p>
                
                <div className="flex items-center gap-4 mt-2 text-xs opacity-75">
                  <span className="capitalize">{alert.severity} alert</span>
                  <span>Until {endTime}</span>
                  {alert.tags.length > 0 && (
                    <div className="flex gap-1">
                      {alert.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherAlerts;