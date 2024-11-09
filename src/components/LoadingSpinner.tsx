import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Trophy, Star, Rocket } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  mode?: 'practice' | 'points' | 'learning';
}

export function LoadingSpinner({ message = "Loading...", mode }: LoadingSpinnerProps) {
  const loadingMessages = {
    practice: [
      "Getting your practice questions ready...",
      "Time to build your confidence! 💪",
      "No pressure, just learning! 📚",
      "Practice makes perfect! 🎯"
    ],
    points: [
      "Loading your path to £25! 💰",
      "Remember: +1 for correct, -2 for wrong!",
      "Take your time, think carefully! 🤔",
      "Every point counts towards your reward! 🎁"
    ],
    learning: [
      "Preparing your learning materials...",
      "Knowledge is power! 🧠",
      "Getting everything ready for you...",
      "Time to level up your skills! 🚀"
    ]
  };

  const [currentMessage, setCurrentMessage] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage(prev => 
        prev < (mode ? loadingMessages[mode].length - 1 : 0) ? prev + 1 : 0
      );
    }, 2000);
    return () => clearInterval(timer);
  }, [mode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* Animated Icons */}
      <div className="relative mb-8">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          {mode === 'points' ? (
            <Trophy className="w-16 h-16 text-yellow-500" />
          ) : mode === 'practice' ? (
            <Brain className="w-16 h-16 text-blue-500" />
          ) : (
            <Rocket className="w-16 h-16 text-purple-500" />
          )}
        </motion.div>
        
        {/* Orbiting Stars */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24"
        >
          {[0, 1, 2].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 120}deg) translateX(2rem) translateY(-50%)`
              }}
            >
              <Star className="w-4 h-4 text-yellow-400" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Messages */}
      <motion.div
        key={currentMessage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center space-y-4"
      >
        <p className="text-xl font-bold text-white">
          {mode ? loadingMessages[mode][currentMessage] : message}
        </p>
        
        {mode === 'points' && (
          <div className="text-sm text-gray-400 max-w-md mx-auto p-4 bg-gray-800/50 rounded-lg">
            <p className="font-bold text-yellow-400 mb-2">🎯 Quick Rules Reminder:</p>
            <ul className="space-y-1 text-left">
              <li>✅ Correct answer: <span className="text-green-400">+1 point</span></li>
              <li>❌ Wrong answer: <span className="text-red-400">-2 points</span></li>
              <li>⚡ Quick answer bonus: <span className="text-yellow-400">+1 point</span></li>
              <li>🔥 Streak bonus: <span className="text-purple-400">+1 point</span></li>
            </ul>
          </div>
        )}

        {mode === 'practice' && (
          <p className="text-sm text-gray-400">
            Take your time to learn - no points lost here! 😊
          </p>
        )}
      </motion.div>
    </div>
  );
}