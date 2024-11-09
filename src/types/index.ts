export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  timestamp: number;
  mode: 'practice' | 'points';
  questions: {
    questionId: string;
    selectedAnswer: number;
    correct: boolean;
    pointsEarned?: number;
  }[];
  totalPoints: number;
}

export interface UserProgress {
  totalPoints: number;
  attempts: QuizAttempt[];
}