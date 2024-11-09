import { useStore } from './store';
import type { LearningContent, QuizQuestion } from '../types/database';

const SAMPLE_CONTENT: Record<string, LearningContent> = {
  'Variables and Data Types': {
    id: 1,
    topic: 'Variables and Data Types',
    content: `# Variables and Data Types

In pseudocode, variables are used to store data that can be used and modified throughout a program. Here are the common data types:

- INTEGER: Whole numbers (e.g., 1, -5, 100)
- FLOAT/REAL: Decimal numbers (e.g., 3.14, -0.5)
- STRING: Text data (e.g., "Hello", "Name")
- BOOLEAN: True/False values
- CHAR: Single characters (e.g., 'A', '1')

Example declarations:
\`\`\`
DECLARE name : STRING
DECLARE age : INTEGER
DECLARE isStudent : BOOLEAN
\`\`\``,
    created_at: new Date().toISOString(),
  },
};

const SAMPLE_QUESTIONS: Record<string, QuizQuestion[]> = {
  'Variables and Data Types': [
    {
      id: 1,
      topic: 'Variables and Data Types',
      question: 'Which data type would you use to store a person\'s age?',
      options: ['STRING', 'INTEGER', 'FLOAT', 'BOOLEAN'],
      correct_answer: 1,
      difficulty: 'easy',
      explanation: 'Age is typically stored as an INTEGER since it represents a whole number.',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      topic: 'Variables and Data Types',
      question: 'What is the correct way to declare a variable named "temperature" that stores decimal numbers?',
      options: [
        'DECLARE temperature : INTEGER',
        'DECLARE temperature : STRING',
        'DECLARE temperature : FLOAT',
        'DECLARE temperature : CHAR',
      ],
      correct_answer: 2,
      difficulty: 'easy',
      explanation: 'Temperature often includes decimal points, so FLOAT is the appropriate data type.',
      created_at: new Date().toISOString(),
    },
  ],
};

export async function getLearningContent(topic: string): Promise<LearningContent> {
  const store = useStore.getState();
  
  if (store.learningContent[topic]) {
    return store.learningContent[topic];
  }

  // Use sample content for development
  const content = SAMPLE_CONTENT[topic];
  if (content) {
    store.setLearningContent(topic, content);
    return content;
  }

  throw new Error(`No content found for topic: ${topic}`);
}

export async function getQuizQuestions(topic: string): Promise<QuizQuestion[]> {
  const store = useStore.getState();
  
  if (store.quizQuestions[topic]) {
    return store.quizQuestions[topic];
  }

  // Use sample questions for development
  const questions = SAMPLE_QUESTIONS[topic];
  if (questions) {
    store.setQuizQuestions(topic, questions);
    return questions;
  }

  throw new Error(`No questions found for topic: ${topic}`);
}

export function initializeUserProgress(userId: string): void {
  const store = useStore.getState();
  
  if (!store.userProgress) {
    store.setUserProgress({
      id: 1,
      user_id: userId,
      points: 0,
      questions_answered: 0,
      correct_answers: 0,
      practice_mode: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
}