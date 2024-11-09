import React from 'react';
import { Trophy, BookOpen } from 'lucide-react';

interface ModeSelectionProps {
  onSelect: (mode: 'practice' | 'points') => void;
}

export function ModeSelection({ onSelect }: ModeSelectionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <button
        onClick={() => onSelect('practice')}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all text-white group"
      >
        <BookOpen className="w-12 h-12 mb-4 text-white/80 group-hover:text-white transition-colors" />
        <h3 className="text-xl font-semibold mb-2">Practice Mode</h3>
        <p className="text-white/80">Learn and practice without pressure</p>
      </button>
      <button
        onClick={() => onSelect('points')}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all text-white group"
      >
        <Trophy className="w-12 h-12 mb-4 text-white/80 group-hover:text-white transition-colors" />
        <h3 className="text-xl font-semibold mb-2">Points Mode</h3>
        <p className="text-white/80">Earn points towards your reward</p>
      </button>
    </div>
  );
}