import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface NavigationProps {
  onBack: () => void;
  onHome: () => void;
  title: string;
}

export function Navigation({ onBack, onHome, title }: NavigationProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onHome}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Home className="w-6 h-6" />
        </button>
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
}