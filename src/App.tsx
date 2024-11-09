import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LearningMode } from './components/LearningMode';
import { QuizSection } from './components/QuizSection';
import { PointsTracker } from './components/PointsTracker';
import { Navigation } from './components/Navigation';
import { useStore } from './store/useStore';
import { checkDatabaseTables } from './lib/database';
import { Brain, GraduationCap, Trophy, Rocket, Lock, Sparkles } from 'lucide-react';
import { LoadingSpinner } from './components/LoadingSpinner';
import GameMode from './components/GameMode';

type Mode = 'menu' | 'practice' | 'points' | 'learning';

function App() {
  const [mode, setMode] = useState<Mode>('menu');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { points, updatePoints } = useStore();

  useEffect(() => {
    async function initializeApp() {
      try {
        await checkDatabaseTables();
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError('Failed to initialize the application. Please try again.');
        setIsLoading(false);
      }
    }

    initializeApp();
  }, []);

  const handlePasswordCheck = (password: string) => {
    console.log('Password check:', password);
    if (password.toLowerCase() === 'lewisgalvinpass') {
      console.log('Password correct, unlocking points mode');
      setIsAuthenticated(true);
      setMode('points');
    } else {
      console.log('Password incorrect');
      alert('Incorrect password! Ask your teacher for the correct password.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Getting everything ready for you, Lewis! 🚀" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg 
                     hover:from-blue-500 hover:to-purple-500 transition-all transform
                     hover:scale-105 active:scale-95"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const renderContent = () => {
    switch (mode) {
      case 'menu':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-5xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-12 px-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 
                               text-transparent bg-clip-text mb-4">
                  Lewis's £25 Challenge! 🎯
                </h1>
                <div className="max-w-2xl mx-auto space-y-4">
                  <p className="text-xl text-gray-300">
                    Welcome to your personalised Computer Science revision journey!
                  </p>
                  <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-xl border border-white/10">
                    <h2 className="text-lg font-bold text-white mb-2">How to Earn Your £25:</h2>
                    <ul className="text-left space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span> Answer questions correctly in Points Mode
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-400">✗</span> Be careful! Wrong answers lose 2 points
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">⚡</span> Fast answers earn bonus points
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">🔥</span> Keep a streak going for extra points
                      </li>
                    </ul>
                  </div>
                  <p className="text-lg text-yellow-400 font-medium">
                    Get to 100 points to claim your £25 reward! 🎁
                  </p>
                  <p className="text-gray-400">
                    Top Tip: Use Practice Mode to build your confidence before trying Points Mode!
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Mode Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 px-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GameMode
                  icon={<Rocket className="w-8 h-8" />}
                  title="Practice Mode"
                  description="Train your skills without pressure! Perfect for mastering new concepts. 🎯"
                  onClick={() => setMode('practice')}
                  locked={false}
                  className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GameMode
                  icon={<Trophy className="w-8 h-8" />}
                  title="Points Mode"
                  description={`Earn points towards your £25 reward! Currently at ${points} points! 🏆`}
                  onClick={() => setMode('points')}
                  locked={!isAuthenticated}
                  onUnlock={handlePasswordCheck}
                  className="bg-gradient-to-br from-purple-600/20 to-pink-600/20"
                />
              </motion.div>
            </div>

            {/* Learning Mode - Full width on mobile */}
            <div className="px-4 mt-4 sm:mt-8">
              <GameMode
                icon={<GraduationCap className="w-8 h-8" />}
                title="Learning Hub"
                description="Explore interactive lessons and boost your understanding! 📚"
                onClick={() => setMode('learning')}
                locked={false}
                className="bg-gradient-to-br from-green-600/20 to-emerald-600/20"
              />
            </div>

            {/* Points Tracker */}
            {points > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <PointsTracker points={points} />
              </motion.div>
            )}
          </motion.div>
        );

      case 'practice':
      case 'points':
        return (
          <>
            <Navigation
              onBack={() => setMode('menu')}
              onHome={() => setMode('menu')}
              title={mode === 'practice' ? '🎯 Practice Mode' : '🏆 Points Challenge'}
            />
            <QuizSection
              mode={mode}
              onPoints={(earned) => updatePoints(points + earned)}
              onExit={() => setMode('menu')}
            />
            {mode === 'points' && <PointsTracker points={points} />}
          </>
        );

      case 'learning':
        return (
          <>
            <Navigation
              onBack={() => setMode('menu')}
              onHome={() => setMode('menu')}
              title="📚 Learning Hub"
            />
            <LearningMode onExit={() => setMode('menu')} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;