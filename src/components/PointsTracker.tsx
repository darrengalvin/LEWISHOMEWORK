import React from 'react';
import { Trophy, Star, Gift } from 'lucide-react';
import { POINTS_GOAL, REWARD_AMOUNT, STUDENT_NAME } from '../config';
import confetti from 'canvas-confetti';

interface PointsTrackerProps {
  points: number;
}

export function PointsTracker({ points }: PointsTrackerProps) {
  const progress = (points / POINTS_GOAL) * 100;
  const remaining = POINTS_GOAL - points;

  React.useEffect(() => {
    if (points >= POINTS_GOAL) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [points]);

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl backdrop-blur-sm border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
          <Trophy className="w-8 h-8 text-yellow-500" />
          {STUDENT_NAME}'s Quest for {REWARD_AMOUNT}!
        </h3>
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          <span className="text-2xl font-bold text-white">
            {points} / {POINTS_GOAL}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          {progress >= 20 && (
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              {Math.round(progress)}%
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      {remaining > 0 ? (
        <div className="mt-4 text-center">
          <p className="text-lg text-white/90">
            {remaining === POINTS_GOAL ? (
              "Ready to start your journey to £25? Let's go! 🚀"
            ) : remaining <= 10 ? (
              <span className="text-yellow-400 animate-pulse">
                You're so close, Lewis! Just {remaining} points to go! 🎉
              </span>
            ) : remaining <= 50 ? (
              `Halfway there! ${remaining} points until you earn ${REWARD_AMOUNT}! You're crushing it! 💪`
            ) : (
              `${remaining} points until you earn ${REWARD_AMOUNT}! Every correct answer counts! 🎯`
            )}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Remember: Practice Mode is always available if you want to build confidence! 📚
          </p>
        </div>
      ) : (
        <div className="mt-4 text-center animate-bounce">
          <p className="text-2xl font-bold text-green-400 flex items-center justify-center gap-2">
            <Gift className="w-6 h-6" />
            Congratulations! You've earned your {REWARD_AMOUNT} reward! 
            <Gift className="w-6 h-6" />
          </p>
        </div>
      )}
    </div>
  );
}