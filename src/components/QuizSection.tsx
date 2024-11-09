import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuestions, cleanupUsedQuestions } from '../lib/database';
import { TOPICS } from '../config';
import { LoadingSpinner } from './LoadingSpinner';
import { Check, X, Brain, Trophy, Timer, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  topic: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface QuizSectionProps {
  mode: 'practice' | 'points';
  onPoints: (earned: number) => void;
  onExit: () => void;
}

export function QuizSection({ mode, onPoints, onExit }: QuizSectionProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [questionIds, setQuestionIds] = useState<number[]>([]);

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isTimerActive) {
      handleAnswer(-1); // Time's up!
    }
  }, [timeLeft, isTimerActive]);

  useEffect(() => {
    if (selectedTopic) {
      loadQuestions(selectedTopic);
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestion === questions.length - 1 && showExplanation) {
      cleanupUsedQuestions(selectedTopic);
    }
  }, [currentQuestion, showExplanation, questions, selectedTopic]);

  async function loadQuestions(topic: string) {
    setLoading(true);
    setError(null);
    console.log('Loading questions for topic:', topic);
    
    try {
      const newQuestions = await generateQuestions(topic, 5);
      setQuestions(newQuestions);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
      setIsTimerActive(true);
      
      // Store question IDs for marking as used later
      setQuestionIds(newQuestions.map(q => q.id));
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleAnswer = (index: number) => {
    console.log('Question attempted:', {
      topic: selectedTopic,
      questionNumber: currentQuestion + 1,
      selectedAnswer: index,
      correctAnswer: questions[currentQuestion].correct_answer
    });

    setIsTimerActive(false);
    setSelectedAnswer(index);
    setShowExplanation(true);

    const isCorrect = index === questions[currentQuestion].correct_answer;
    
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      console.log('Correct answer! 🎉', {
        streak: newStreak,
        timeLeft,
        pointsEarned: mode === 'points' ? (newStreak >= 3 ? 4 : 2) : 0
      });

      // Celebration effects for correct answers
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      if (mode === 'points') {
        // Bonus points for streaks and quick answers
        let points = 1;
        if (newStreak >= 3) points += 1;
        if (timeLeft > 20) points += 1;
        onPoints(points);

        // Encouraging messages
        const messages = [
          "Great job, Lewis! 🌟",
          "You're getting closer to that £25! 💪",
          "Keep up the amazing work! 🚀",
          "You're mastering this! 🎯"
        ];
        console.log(messages[Math.floor(Math.random() * messages.length)]);
      }
    } else {
      setStreak(0);
      if (mode === 'points') {
        onPoints(-2);
        console.log('Incorrect answer 😔', {
          pointsLost: -2,
          correctAnswer: questions[currentQuestion].options[questions[currentQuestion].correct_answer]
        });

        // Encouraging messages for wrong answers
        const messages = [
          "Don't worry, Lewis! Practice mode is perfect for mastering this topic.",
          "Remember, mistakes help us learn! Try practicing this topic first.",
          "You've got this! Maybe try practice mode to build confidence?",
          "Every mistake is a step toward mastery! Keep going! 💪"
        ];
        console.log(messages[Math.floor(Math.random() * messages.length)]);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
      setIsTimerActive(true);
    }
  };

  function TopicIntro({ mode }: { mode: 'practice' | 'points' }) {
    return (
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                      from-blue-400 via-purple-500 to-pink-500 mb-4">
          {mode === 'points' ? (
            "🎯 Points Challenge Mode"
          ) : (
            "🎓 Practice & Learn Mode"
          )}
        </h3>
        <p className="text-lg text-gray-300">
          {mode === 'points' ? (
            <>
              Each correct answer brings you closer to your £25 reward! 
              <br />
              <span className="text-green-400">+1 point</span> for correct answers, 
              <span className="text-yellow-400">+1 bonus</span> for quick answers, 
              <span className="text-purple-400">+1 streak bonus</span>, but 
              <span className="text-red-400">-2 points</span> for mistakes!
            </>
          ) : (
            "Take your time to learn and practice without any pressure. Perfect for mastering topics!"
          )}
        </p>
      </div>
    );
  }

  function PracticeRecommendation() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                   rounded-lg border border-blue-500/30"
      >
        <p className="text-blue-300">
          💡 <strong>Pro Tip:</strong> Not feeling confident yet? 
          Try Practice Mode first - it's a great way to learn without losing points!
        </p>
      </motion.div>
    );
  }

  // Topic Selection Screen
  if (!selectedTopic) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <TopicIntro mode={mode} />
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-400" />
          Choose Your Topic, Lewis!
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {TOPICS.map((topic) => (
            <motion.button
              key={topic}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTopic(topic)}
              className="p-6 bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-xl 
                        hover:from-purple-700/50 hover:to-pink-700/50 transition-all
                        border border-white/10 text-left"
            >
              <h3 className="text-xl font-semibold mb-2">{topic}</h3>
              <p className="text-sm text-gray-300">Master this topic to earn points!</p>
            </motion.button>
          ))}
        </div>
        {mode === 'points' && <PracticeRecommendation />}
      </motion.div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading questions..." />;
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-500/10 rounded-xl">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => loadQuestions(selectedTopic)}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  if (!question) return null;

  return (
    <div className="space-y-8">
      {/* Quiz Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold">{selectedTopic}</h3>
            {streak >= 3 && (
              <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-500 font-bold">{streak}x Streak!</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${
              timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-gray-400'
            }`}>
              <Timer className="w-5 h-5" />
              <span className="font-mono">{timeLeft}s</span>
            </div>
            <span className="text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
        </div>
        
        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-xl font-medium">{question.question}</p>
        </motion.div>
        
        {/* Options */}
        <div className="space-y-4">
          <AnimatePresence mode="sync">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                className={`
                  w-full p-4 rounded-lg text-left transition-all flex items-center gap-3
                  ${showExplanation
                    ? index === question.correct_answer
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : index === selectedAnswer
                      ? 'bg-red-500/20 border-2 border-red-500'
                      : 'bg-gray-700/50'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 hover:scale-[1.02] active:scale-[0.98]'
                  }
                `}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 
                             border-white/20 font-mono text-sm">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1">{option}</span>
                {showExplanation && (
                  index === question.correct_answer ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : index === selectedAnswer ? (
                    <X className="w-6 h-6 text-red-500" />
                  ) : null
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <div className="p-4 bg-gray-700/50 rounded-lg border border-white/10">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Explanation:
                </h4>
                <p className="text-gray-300">{question.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedTopic(null)}
          className="px-4 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 
                     transition-colors border border-white/10"
        >
          Change Topic
        </motion.button>
        
        {showExplanation && currentQuestion < questions.length - 1 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextQuestion}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                       rounded-lg hover:from-blue-500 hover:to-purple-500 
                       transition-colors font-medium"
          >
            Next Question
          </motion.button>
        )}
      </div>
    </div>
  );
}