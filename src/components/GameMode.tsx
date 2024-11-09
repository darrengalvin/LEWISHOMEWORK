import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface GameModeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  locked?: boolean;
  onUnlock?: (password: string) => void;
  className?: string;
}

export default function GameMode({ 
  icon, 
  title, 
  description, 
  onClick, 
  locked = false, 
  onUnlock,
  className = ''
}: GameModeProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleClick = (e: React.MouseEvent) => {
    if (locked) {
      e.stopPropagation();
      setShowPassword(true);
    } else {
      onClick();
    }
  };

  const handleUnlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Attempting to unlock with password:', password);
    
    if (password.toLowerCase() === 'lewisgalvinpass') {
      console.log('Password correct!');
      onUnlock?.(password);
      setShowPassword(false);
      setPassword('');
      setError('');
    } else {
      console.log('Password incorrect');
      setError('Wrong password! Ask your teacher for help.');
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 
        backdrop-blur-lg rounded-xl p-4 sm:p-6 cursor-pointer
        border border-white/10 hover:border-white/20 transition-all
        ${className}
      `}
      onClick={handleClick}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="text-white p-3 bg-white/10 rounded-lg">{icon}</div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <p className="text-gray-300">{description}</p>
      
      {locked && showPassword && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 bg-black/80 
                     backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-md space-y-4 bg-gray-800 p-6 rounded-xl border border-white/10">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white">Points Mode Access</h3>
              <p className="text-gray-300 text-sm mt-2">
                This is where you'll earn points towards your £25 reward!
              </p>
            </div>
            
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Enter your secret password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUnlock(e as unknown as React.MouseEvent);
                  }
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 focus:border-transparent"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
            </div>
            
            <div className="flex gap-2 pt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPassword(false);
                  setPassword('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 
                           rounded-lg transition-colors text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUnlock}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 
                           hover:from-purple-500 hover:to-pink-500 rounded-lg 
                           transition-colors text-white font-medium"
              >
                Start Earning Points!
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}