export interface LearningContent {
  id: number;
  topic: string;
  content: string;
  created_at: string;
}

export interface QuizQuestion {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correct_answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  created_at: string;
}

export interface UserProgress {
  id: number;
  user_id: string;
  points: number;
  questions_answered: number;
  correct_answers: number;
  practice_mode: boolean;
  created_at: string;
  updated_at: string;
}