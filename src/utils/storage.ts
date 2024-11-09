import { UserProgress, QuizAttempt } from '../types';

const STORAGE_KEY = 'cs-exam-progress';

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function loadProgress(): UserProgress {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { totalPoints: 0, attempts: [] };
  }
  return JSON.parse(stored);
}

export function saveAttempt(attempt: QuizAttempt, isPointsMode: boolean): void {
  const progress = loadProgress();
  progress.attempts.push(attempt);
  if (isPointsMode) {
    progress.totalPoints += attempt.totalPoints;
  }
  saveProgress(progress);
}