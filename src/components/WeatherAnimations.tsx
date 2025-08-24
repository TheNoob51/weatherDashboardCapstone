import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Import weather logos using Vite's asset handling
import cloudyLogo from "../assets/logos/Cloudy.png";
import cloudyNightLogo from "../assets/logos/cloudy-night.png";
import drizzleLogo from "../assets/logos/drizzle.png";
import lessCloudyLogo from "../assets/logos/Less-Cloudy.png";
import moreCloudyLogo from "../assets/logos/more-cloudy.png";
import nightLogo from "../assets/logos/night.png";
import rainLogo from "../assets/logos/rain.png";
import thunderstormLogo from "../assets/logos/Thunderstorm.png";

interface WeatherAnimationsProps {
  condition: string;
  temperature: number;
  windSpeed: number;
  intensity?: "light" | "moderate" | "heavy";
}

const WeatherAnimations: React.FC<WeatherAnimationsProps> = ({
  condition,
  temperature,
  windSpeed,
  intensity = "moderate",
}) => {
  const [previousCondition, setPreviousCondition] = useState<string>("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Function to get the appropriate weather logo
  const getWeatherLogo = (
    weatherCondition: string,
    isNight: boolean = false
  ) => {
    const lowerCondition = weatherCondition.toLowerCase();

    if (
      lowerCondition.includes("thunder") ||
      lowerCondition.includes("storm")
    ) {
      return thunderstormLogo;
    }
    if (lowerCondition.includes("rain")) {
      return rainLogo;
    }
    if (lowerCondition.includes("drizzle")) {
      return drizzleLogo;
    }
    if (lowerCondition.includes("clear") || lowerCondition.includes("sunny")) {
      return isNight ? nightLogo : lessCloudyLogo;
    }
    if (lowerCondition.includes("cloud")) {
      if (isNight) return cloudyNightLogo;
      return lowerCondition.includes("few") ||
        lowerCondition.includes("scattered")
        ? lessCloudyLogo
        : lowerCondition.includes("overcast") ||
          lowerCondition.includes("broken")
        ? moreCloudyLogo
        : cloudyLogo;
    }

    // Default
    return cloudyLogo;
  };

  useEffect(() => {
    if (previousCondition && previousCondition !== condition) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 2000);
      return () => clearTimeout(timer);
    }
    setPreviousCondition(condition);
  }, [condition, previousCondition]);

  // Dramatic Rain Animation
  const RainAnimation = () => {
    const rainDrops =
      intensity === "heavy" ? 200 : intensity === "light" ? 80 : 150;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Weather Logo */}
        <motion.img
          src={getWeatherLogo(condition)}
          alt="Rain weather"
          className="absolute top-8 right-8 w-16 h-16 opacity-60"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Heavy rain drops */}
        {Array.from({ length: rainDrops }).map((_, i) => (
          <motion.div
            key={`rain-${i}`}
            className="absolute w-1 bg-gradient-to-b from-blue-300 via-blue-400 to-transparent opacity-80"
            style={{
              height: Math.random() * 40 + 20,
              left: `${Math.random() * 110 - 5}%`,
              borderRadius: "2px",
            }}
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [0, 1, 1, 0],
              x: windSpeed > 20 ? Math.random() * 50 - 25 : 0,
            }}
            transition={{
              duration: 0.3 + Math.random() * 0.4,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Ground splash effects */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`splash-${i}`}
            className="absolute bottom-0 w-8 h-2 bg-blue-200/30 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scaleX: [0, 1.5, 0],
              scaleY: [0, 0.5, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Rain streaks on screen */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-blue-900/10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
      </div>
    );
  };

  // Intense Thunderstorm Animation
  const ThunderstormAnimation = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Thunderstorm Logo */}
        <motion.img
          src={getWeatherLogo("thunderstorm")}
          alt="Thunderstorm weather"
          className="absolute top-8 right-8 w-20 h-20 opacity-70"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Dark storm clouds */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-800/30 to-transparent"
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        />

        {/* Lightning flashes */}
        <motion.div
          className="absolute inset-0 bg-white"
          animate={{
            opacity: [0, 0, 1, 0, 1, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 4 + Math.random() * 6,
          }}
        />

        {/* Lightning bolts */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.svg
            key={`lightning-${i}`}
            className="absolute text-yellow-100"
            style={{
              top: "10%",
              left: `${20 + i * 30}%`,
              width: "80px",
              height: "400px",
            }}
            viewBox="0 0 40 200"
            fill="currentColor"
            animate={{
              opacity: [0, 1, 0, 1, 0],
              scaleY: [0, 1, 1, 0.8, 0],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatDelay: 3 + i * 2,
              delay: i * 0.5,
            }}
          >
            <path d="M20 0 L12 80 L25 80 L15 140 L8 200 L18 120 L28 120 L35 60 L22 60 L30 0 Z" />
          </motion.svg>
        ))}

        {/* Heavy rain */}
        <RainAnimation />

        {/* Thunder rumble effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            x: [0, 2, -2, 1, -1, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 5,
          }}
        />
      </div>
    );
  };

  // Heavy Snowfall Animation
  const SnowAnimation = () => {
    const snowflakes =
      intensity === "heavy" ? 150 : intensity === "light" ? 50 : 100;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Snow Weather Logo */}
        <motion.img
          src={getWeatherLogo("snow")}
          alt="Snow weather"
          className="absolute top-8 right-8 w-16 h-16 opacity-60"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Large snowflakes */}
        {Array.from({ length: snowflakes }).map((_, i) => {
          const size = Math.random() * 8 + 4;
          return (
            <motion.div
              key={`snow-${i}`}
              className="absolute bg-white rounded-full shadow-lg"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 110 - 5}%`,
                opacity: 0.7 + Math.random() * 0.3,
              }}
              initial={{ y: -50, rotate: 0 }}
              animate={{
                y: window.innerHeight + 50,
                x: [0, Math.sin(i) * 40, Math.sin(i * 2) * -30, 0],
                rotate: 360,
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 4,
              }}
            />
          );
        })}

        {/* Snow accumulation effect */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/20 to-transparent"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />

        {/* Blizzard effect for heavy snow */}
        {intensity === "heavy" && (
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{
              opacity: [0.1, 0.3, 0.1],
              x: [0, 20, -20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        )}
      </div>
    );
  };

  // Dramatic Sunny Animation
  const SunnyAnimation = () => {
    const isHot = temperature > 30;
    const isVeryHot = temperature > 40;
    const currentHour = new Date().getHours();
    const isNight = currentHour < 6 || currentHour > 18;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Clear Weather Logo */}
        <motion.img
          src={getWeatherLogo("clear", isNight)}
          alt="Clear weather"
          className="absolute top-8 right-8 w-16 h-16 opacity-70"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 8, -8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Large animated sun */}
        <motion.div
          className="absolute top-16 right-16"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Sun core */}
          <motion.div
            className={`w-32 h-32 rounded-full ${
              isVeryHot
                ? "bg-red-400"
                : isHot
                ? "bg-orange-400"
                : "bg-yellow-400"
            } shadow-2xl`}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 40px rgba(255, 255, 0, 0.6)",
                "0 0 80px rgba(255, 255, 0, 0.8)",
                "0 0 40px rgba(255, 255, 0, 0.6)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          {/* Sun rays */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className={`absolute w-2 origin-bottom ${
                isVeryHot
                  ? "bg-red-300"
                  : isHot
                  ? "bg-orange-300"
                  : "bg-yellow-300"
              }`}
              style={{
                height: 60,
                left: "50%",
                bottom: "50%",
                transform: `rotate(${i * 30}deg) translateX(-50%)`,
              }}
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>

        {/* Heat wave distortion */}
        {isHot && (
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`heat-${i}`}
                className="absolute w-full h-24 bg-gradient-to-r from-transparent via-orange-200/20 to-transparent"
                style={{ top: `${10 + i * 12}%` }}
                animate={{
                  x: [-200, window.innerWidth + 200],
                  scaleY: [1, 1.3, 1],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 6 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.8,
                }}
              />
            ))}
          </div>
        )}

        {/* Sunshine particles */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className={`absolute w-2 h-2 rounded-full ${
              isHot ? "bg-orange-300/60" : "bg-yellow-300/60"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    );
  };

  // Dramatic Cloudy Animation
  const CloudyAnimation = () => {
    const currentHour = new Date().getHours();
    const isNight = currentHour < 6 || currentHour > 18;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Cloudy Weather Logo */}
        <motion.img
          src={getWeatherLogo("clouds", isNight)}
          alt="Cloudy weather"
          className="absolute top-8 right-8 w-16 h-16 opacity-60"
          animate={{
            y: [0, -6, 0],
            x: [0, 4, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Large moving clouds */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute opacity-40"
            style={{
              top: `${Math.random() * 40 + 10}%`,
            }}
            initial={{ x: -300 }}
            animate={{ x: window.innerWidth + 300 }}
            transition={{
              duration: 25 + i * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 8,
            }}
          >
            {/* Cloud shape */}
            <div className="relative">
              <div className="w-32 h-16 bg-white/30 rounded-full blur-sm" />
              <div className="w-40 h-20 bg-white/25 rounded-full blur-sm -mt-8 ml-8" />
              <div className="w-24 h-12 bg-white/35 rounded-full blur-sm -mt-10 ml-16" />
              <div className="w-28 h-14 bg-white/20 rounded-full blur-sm -mt-6 ml-4" />
            </div>
          </motion.div>
        ))}

        {/* Cloud shadows */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-gray-600/20 via-transparent to-transparent"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </div>
    );
  };

  // Dramatic Wind Animation
  const WindAnimation = () => {
    const particleCount = Math.min(100, windSpeed * 3);

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Wind particles */}
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={`wind-${i}`}
            className="absolute w-16 h-1 bg-white/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{
              x: window.innerWidth + 100,
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: windSpeed > 30 ? 1 : windSpeed > 15 ? 2 : 3,
              repeat: Infinity,
              ease: "easeOut",
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Swaying grass effect */}
        <div className="absolute bottom-0 left-0 right-0 h-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`grass-${i}`}
              className="absolute bottom-0 w-1 h-8 bg-green-400/30 origin-bottom"
              style={{
                left: `${i * 5}%`,
              }}
              animate={{
                rotate: [
                  0,
                  windSpeed > 20 ? 15 : 8,
                  0,
                  windSpeed > 20 ? -10 : -5,
                  0,
                ],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // Fog/Mist Animation
  const FogAnimation = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Thick fog layers */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`fog-${i}`}
            className="absolute w-full h-32 bg-gray-300/20 rounded-full blur-2xl"
            style={{
              top: `${i * 15}%`,
            }}
            initial={{ x: -200, opacity: 0.1 }}
            animate={{
              x: window.innerWidth + 200,
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          />
        ))}

        {/* Ground mist */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/30 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        />
      </div>
    );
  };

  // Transition Effect
  const TransitionEffect = () => {
    if (!isTransitioning) return null;

    return (
      <motion.div
        className="absolute inset-0 bg-white/20 backdrop-blur-sm pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 2 }}
      />
    );
  };

  // Main render function
  const renderWeatherAnimation = () => {
    const lowerCondition = condition.toLowerCase();

    if (
      lowerCondition.includes("thunder") ||
      lowerCondition.includes("storm")
    ) {
      return <ThunderstormAnimation />;
    }

    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      return (
        <>
          <RainAnimation />
          <CloudyAnimation />
          {windSpeed > 15 && <WindAnimation />}
        </>
      );
    }

    if (lowerCondition.includes("snow")) {
      return (
        <>
          <SnowAnimation />
          <CloudyAnimation />
          {windSpeed > 10 && <WindAnimation />}
        </>
      );
    }

    if (lowerCondition.includes("clear") || lowerCondition.includes("sunny")) {
      return (
        <>
          <SunnyAnimation />
          {windSpeed > 5 && <WindAnimation />}
        </>
      );
    }

    if (lowerCondition.includes("cloud")) {
      return (
        <>
          <CloudyAnimation />
          {windSpeed > 10 && <WindAnimation />}
        </>
      );
    }

    if (
      lowerCondition.includes("mist") ||
      lowerCondition.includes("fog") ||
      lowerCondition.includes("haze")
    ) {
      return <FogAnimation />;
    }

    // Default
    return <CloudyAnimation />;
  };

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={condition}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {renderWeatherAnimation()}
        </motion.div>
      </AnimatePresence>
      <TransitionEffect />
    </div>
  );
};

export default WeatherAnimations;
