import React from 'react';
import { motion } from 'motion/react';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Zap, CloudDrizzle, Eye } from 'lucide-react';

interface AnimatedWeatherIconProps {
  condition: string;
  size?: number;
  temperature?: number;
  className?: string;
}

const AnimatedWeatherIcon: React.FC<AnimatedWeatherIconProps> = ({
  condition,
  size = 24,
  temperature = 20,
  className = ""
}) => {
  const getWeatherIcon = () => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
      return ThunderstormIcon;
    }
    if (lowerCondition.includes('rain')) {
      return RainIcon;
    }
    if (lowerCondition.includes('drizzle')) {
      return DrizzleIcon;
    }
    if (lowerCondition.includes('snow')) {
      return SnowIcon;
    }
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return SunIcon;
    }
    if (lowerCondition.includes('cloud')) {
      return CloudIcon;
    }
    if (lowerCondition.includes('mist') || lowerCondition.includes('fog') || lowerCondition.includes('haze')) {
      return MistIcon;
    }
    if (lowerCondition.includes('wind')) {
      return WindIcon;
    }
    
    return CloudIcon;
  };

  // Dramatic Animated Sun Icon
  const SunIcon = () => {
    const isHot = temperature > 30;
    const isVeryHot = temperature > 40;
    
    return (
      <motion.div 
        className={`relative ${className}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sun 
            size={size} 
            className={`${
              isVeryHot ? 'text-red-500' : isHot ? 'text-orange-500' : 'text-yellow-500'
            } drop-shadow-2xl filter brightness-110`}
          />
        </motion.div>
        
        {/* Intense pulsing glow */}
        <motion.div
          className={`absolute inset-0 ${
            isVeryHot ? 'bg-red-500' : isHot ? 'bg-orange-500' : 'bg-yellow-500'
          } rounded-full blur-lg`}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Radiating rays */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`sun-ray-${i}`}
            className={`absolute w-1 ${
              isVeryHot ? 'bg-red-400' : isHot ? 'bg-orange-400' : 'bg-yellow-400'
            } origin-center`}
            style={{
              height: size * 0.6,
              left: '50%',
              top: '50%',
              transform: `rotate(${i * 45}deg) translateX(-50%) translateY(-100%)`,
            }}
            animate={{
              scaleY: [0.5, 1.5, 0.5],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </motion.div>
    );
  };

  // Dramatic Animated Rain Icon
  const RainIcon = () => (
    <motion.div className={`relative ${className}`}>
      <motion.div
        animate={{
          y: [0, -4, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <CloudRain size={size} className="text-blue-500 drop-shadow-lg filter brightness-110" />
      </motion.div>
      
      {/* Heavy falling raindrops */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`rain-drop-${i}`}
          className="absolute w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"
          style={{
            height: size * 0.3,
            left: `${25 + i * 8}%`,
            top: '70%'
          }}
          animate={{
            y: [0, size * 0.8, 0],
            opacity: [0, 1, 0],
            scaleY: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeIn",
            delay: i * 0.15
          }}
        />
      ))}

      {/* Splash effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-8 h-1 bg-blue-300/60 rounded-full blur-sm"
        style={{ transform: 'translateX(-50%)' }}
        animate={{
          scaleX: [0, 1.5, 0],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.3
        }}
      />
    </motion.div>
  );

  // Intense Thunderstorm Icon
  const ThunderstormIcon = () => (
    <motion.div className={`relative ${className}`}>
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          y: [0, -2, 0]
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 1.5
        }}
      >
        <Cloud size={size} className="text-gray-700 drop-shadow-xl filter brightness-75" />
      </motion.div>
      
      {/* Dramatic lightning bolt */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4"
        animate={{
          opacity: [0, 1, 0, 1, 0],
          scale: [0.8, 1.5, 0.8],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2
        }}
      >
        <Zap size={size * 0.7} className="text-yellow-300 drop-shadow-lg filter brightness-150" />
      </motion.div>

      {/* Screen flash effect */}
      <motion.div
        className="absolute inset-0 bg-white rounded-full blur-xl"
        animate={{
          opacity: [0, 0.8, 0],
          scale: [1, 2, 1]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      />
      
      {/* Heavy rain from storm */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`storm-rain-${i}`}
          className="absolute w-1 bg-gradient-to-b from-blue-300 to-blue-500 rounded-full"
          style={{
            height: size * 0.4,
            left: `${20 + i * 6}%`,
            top: '75%'
          }}
          animate={{
            y: [0, size * 1.2, 0],
            opacity: [0, 1, 0],
            x: Math.random() * 10 - 5
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeIn",
            delay: i * 0.08
          }}
        />
      ))}
    </motion.div>
  );

  // Heavy Snow Icon
  const SnowIcon = () => (
    <motion.div className={`relative ${className}`}>
      <motion.div
        animate={{
          y: [0, -3, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <CloudSnow size={size} className="text-slate-300 drop-shadow-lg filter brightness-110" />
      </motion.div>
      
      {/* Heavy falling snowflakes */}
      {Array.from({ length: 12 }).map((_, i) => {
        const flakeSize = Math.random() * 3 + 2;
        return (
          <motion.div
            key={`snowflake-${i}`}
            className="absolute bg-white rounded-full shadow-sm"
            style={{
              width: `${flakeSize}px`,
              height: `${flakeSize}px`,
              left: `${15 + i * 6}%`,
              top: '65%'
            }}
            animate={{
              y: [0, size * 1.5, 0],
              x: [0, Math.sin(i) * 8, 0],
              opacity: [0, 1, 0],
              rotate: 360
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.2
            }}
          />
        );
      })}

      {/* Snow accumulation glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2 bg-white/40 blur-sm"
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity
        }}
      />
    </motion.div>
  );

  // Dynamic Cloud Icon
  const CloudIcon = () => (
    <motion.div 
      className={`relative ${className}`}
      animate={{
        x: [0, 6, 0],
        y: [0, -4, 0]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Cloud size={size} className="text-gray-400 drop-shadow-lg filter brightness-105" />
      </motion.div>
      
      {/* Drifting cloud shadow */}
      <motion.div
        className="absolute inset-0 bg-gray-400/30 rounded-full blur-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );

  // Dramatic Mist/Fog Icon
  const MistIcon = () => (
    <motion.div className={`relative ${className}`}>
      <motion.div
        animate={{
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      >
        <Eye size={size} className="text-gray-500 drop-shadow-lg" />
      </motion.div>
      
      {/* Thick mist layers */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`mist-layer-${i}`}
          className="absolute bg-gray-300/40 rounded-full blur-md"
          style={{
            width: `${size * 0.9}px`,
            height: `${size * 0.15}px`,
            top: `${35 + i * 15}%`,
            left: '5%'
          }}
          animate={{
            x: [0, 15, 0],
            opacity: [0.2, 0.7, 0.2],
            scaleX: [1, 1.3, 1]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8
          }}
        />
      ))}
    </motion.div>
  );

  // Intense Wind Icon
  const WindIcon = () => (
    <motion.div className={`relative ${className}`}>
      <motion.div
        animate={{
          x: [0, 3, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Wind size={size} className="text-gray-300 drop-shadow-lg filter brightness-110" />
      </motion.div>
      
      {/* Fast-moving wind streaks */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`wind-streak-${i}`}
          className="absolute bg-gray-300/60 rounded-full"
          style={{
            width: `${size * 0.6}px`,
            height: '2px',
            top: `${30 + i * 12}%`,
            right: '0%'
          }}
          animate={{
            x: [0, 20, 0],
            opacity: [0, 1, 0],
            scaleX: [0.5, 1.5, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.15
          }}
        />
      ))}
    </motion.div>
  );

  // Light Drizzle Icon
  const DrizzleIcon = () => (
    <motion.div className={`relative ${className}`}>
      <motion.div
        animate={{
          y: [0, -3, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <CloudDrizzle size={size} className="text-slate-400 drop-shadow-lg" />
      </motion.div>
      
      {/* Light drizzle drops */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`drizzle-${i}`}
          className="absolute w-0.5 h-2 bg-slate-400 rounded-full opacity-70"
          style={{
            left: `${20 + i * 8}%`,
            top: '65%'
          }}
          animate={{
            y: [0, size * 0.6, 0],
            opacity: [0, 0.7, 0]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeIn",
            delay: i * 0.2
          }}
        />
      ))}
    </motion.div>
  );

  const IconComponent = getWeatherIcon();
  
  return <IconComponent />;
};

export default AnimatedWeatherIcon;