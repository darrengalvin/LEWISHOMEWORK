import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface PasswordPromptProps {
  onSubmit: (password: string) => void;
  onClose: () => void;
}

export function PasswordPrompt({ onSubmit, onClose }: PasswordPromptProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md mx-4 relative shadow-2xl border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Lock className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold">Points Mode Access</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Enter Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your secret password"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            Unlock Points Mode
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400 text-center">
          Hint: Ask your teacher for the password! 🤫
        </p>
      </div>
    </div>
  );
}