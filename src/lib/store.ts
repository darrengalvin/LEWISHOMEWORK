import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LearningContent, QuizQuestion, UserProgress } from '../types/database';

interface AppState {
  learningContent: Record<string, LearningContent>;
  quizQuestions: Record<string, QuizQuestion[]>;
  userProgress: UserProgress | null;
  setLearningContent: (topic: string, content: LearningContent) => void;
  setQuizQuestions: (topic: string, questions: QuizQuestion[]) => void;
  setUserProgress: (progress: UserProgress) => void;
  updatePoints: (points: number, isCorrect: boolean, practiceMode: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      learningContent: {},
      quizQuestions: {},
      userProgress: null,
      setLearningContent: (topic, content) =>
        set((state) => ({
          learningContent: { ...state.learningContent, [topic]: content },
        })),
      setQuizQuestions: (topic, questions) =>
        set((state) => ({
          quizQuestions: { ...state.quizQuestions, [topic]: questions },
        })),
      setUserProgress: (progress) =>
        set(() => ({
          userProgress: progress,
        })),
      updatePoints: (points, isCorrect, practiceMode) =>
        set((state) => {
          if (!state.userProgress) return state;
          
          return {
            userProgress: {
              ...state.userProgress,
              points: practiceMode ? state.userProgress.points : points,
              questions_answered: state.userProgress.questions_answered + 1,
              correct_answers: isCorrect
                ? state.userProgress.correct_answers + 1
                : state.userProgress.correct_answers,
              practice_mode: practiceMode,
              updated_at: new Date().toISOString(),
            },
          };
        }),
    }),
    {
      name: 'cs-exam-helper-storage',
    }
  )
);