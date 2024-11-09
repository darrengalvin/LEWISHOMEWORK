import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { DB_TABLES, TOPICS } from '../config';
import { LoadingSpinner } from './LoadingSpinner';
import { generateContent } from '../lib/database';
import { Book } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface LearningContent {
  topic: string;
  content: string;
}

interface LearningModeProps {
  onExit: () => void;
}

export function LearningMode({ onExit }: LearningModeProps) {
  const [content, setContent] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [readTopics, setReadTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedTopics = localStorage.getItem('readTopics');
    if (savedTopics) {
      setReadTopics(new Set(JSON.parse(savedTopics)));
    }
  }, []);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        console.log('Fetching learning content...');

        const { data, error } = await supabase
          .from(DB_TABLES.LEARNING_CONTENT)
          .select('topic, content');

        if (error) throw error;

        if (!data || data.length === 0) {
          console.log('No content found, generating new content...');
          const generatedContent = await Promise.all(
            TOPICS.map(async (topic) => {
              const content = await generateContent(topic);
              return { topic, content };
            })
          );
          setContent(generatedContent);
        } else {
          setContent(data);
        }
      } catch (err) {
        console.error('Error loading learning content:', err);
        setError('Failed to load learning content. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  const markTopicAsRead = (topic: string) => {
    const newReadTopics = new Set(readTopics).add(topic);
    setReadTopics(newReadTopics);
    localStorage.setItem('readTopics', JSON.stringify([...newReadTopics]));
  };

  if (loading) {
    return <LoadingSpinner message="Loading learning content..." />;
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-500/10 rounded-xl">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[300px,1fr] gap-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-6">Topics</h2>
        {TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => {
              setSelectedTopic(topic);
              markTopicAsRead(topic);
            }}
            className={`w-full text-left p-4 rounded-lg transition-colors ${
              selectedTopic === topic
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Book className="w-5 h-5" />
              <span>{topic}</span>
              {readTopics.has(topic) && (
                <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  Read ✓
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {selectedTopic ? (
          <div className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">{selectedTopic}</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>
                {content.find((c) => c.topic === selectedTopic)?.content || 
                  'Loading content...'}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Select a topic to start learning</p>
          </div>
        )}
      </div>
    </div>
  );
}