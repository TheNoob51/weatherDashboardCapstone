import React from 'react';
import { motion } from 'motion/react';

interface WeatherTransitionProps {
  isTransitioning: boolean;
  fromCondition: string;
  toCondition: string;
  onComplete?: () => void;
}

const WeatherTransition: React.FC<WeatherTransitionProps> = ({
  isTransitioning,
  fromCondition,
  toCondition,
  onComplete
}) => {
  if (!isTransitioning) return null;

  const getTransitionEffect = () => {
    const from = fromCondition.toLowerCase();
    const to = toCondition.toLowerCase();

    // Rain to Sun - clearing up effect
    if (from.includes('rain') && (to.includes('clear') || to.includes('sunny'))) {
      return (
        <motion.div className="absolute inset-0 pointer-events-none">
          {/* Clouds parting */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-gray-600/40 to-transparent"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2 }}
          />
          
          {/* Sun breaking through */}
          <motion.div
            className="absolute top-16 right-16 w-24 h-24 bg-yellow-400/60 rounded-full blur-xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 0.8 }}
            transition={{ duration: 2, delay: 1 }}
          />
          
          {/* Last few raindrops */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={`last-drop-${i}`}
              className="absolute w-1 h-4 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '20%'
              }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 400, opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>
      );
    }

    // Sun to Rain - storm approaching
    if ((from.includes('clear') || from.includes('sunny')) && to.includes('rain')) {
      return (
        <motion.div className="absolute inset-0 pointer-events-none">
          {/* Clouds rolling in */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-600/60"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2.5 }}
          />
          
          {/* Sun dimming */}
          <motion.div
            className="absolute top-16 right-16 w-24 h-24 bg-yellow-400/80 rounded-full blur-lg"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0.2, scale: 0.7 }}
            transition={{ duration: 2 }}
          />
          
          {/* First raindrops starting */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`first-drop-${i}`}
              className="absolute w-1 h-3 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '10%'
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: 400, opacity: 1 }}
              transition={{
                duration: 2,
                delay: 1 + i * 0.2
              }}
            />
          ))}
        </motion.div>
      );
    }

    // Snow to Rain - melting transition
    if (from.includes('snow') && to.includes('rain')) {
      return (
        <motion.div className="absolute inset-0 pointer-events-none">
          {/* Temperature rising effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-blue-200/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 2 }}
          />
          
          {/* Snowflakes melting into raindrops */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`melt-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
              }}
              initial={{ 
                width: '4px', 
                height: '4px', 
                backgroundColor: 'white',
                opacity: 1 
              }}
              animate={{ 
                width: '2px', 
                height: '8px', 
                backgroundColor: '#3b82f6',
                y: 200,
                opacity: 0.8 
              }}
              transition={{
                duration: 2,
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>
      );
    }

    // Generic transition - swirling effect
    return (
      <motion.div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: [0, 0.6, 0], rotate: 180 }}
          transition={{ duration: 3 }}
          onAnimationComplete={onComplete}
        />
        
        {/* Swirling particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`swirl-${i}`}
            className="absolute w-2 h-2 bg-white/60 rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{ 
              x: 0, 
              y: 0,
              scale: 0 
            }}
            animate={{ 
              x: Math.cos(i * 18 * Math.PI / 180) * 200,
              y: Math.sin(i * 18 * Math.PI / 180) * 200,
              scale: [0, 1, 0],
              rotate: 360
            }}
            transition={{
              duration: 2,
              delay: i * 0.1
            }}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="absolute inset-0"
      style={{ zIndex: 10 }}
      onAnimationComplete={onComplete}
    >
      {getTransitionEffect()}
    </motion.div>
  );
};

export default WeatherTransition;