import { supabase } from './supabase';
import axios from 'axios';
import { TOPICS } from '../config';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function checkDatabaseTables() {
  console.log('Checking database tables...');
  try {
    // Check if tables exist by querying them
    const { data: learningContent } = await supabase
      .from('learning_content')
      .select('count');

    const { data: quizQuestions } = await supabase
      .from('quiz_questions')
      .select('count');

    console.log('Database tables ready');
    return true;
  } catch (error) {
    console.error('Database setup error:', error);
    throw error;
  }
}

export async function generateContent(topic: string): Promise<string> {
  console.log('Attempting to generate content for:', topic);
  
  try {
    // First check if content exists
    const { data: existingContent } = await supabase
      .from('learning_content')
      .select('content')
      .eq('topic', topic)
      .single();

    if (existingContent) {
      console.log('Found existing content for:', topic);
      return existingContent.content;
    }

    console.log('No existing content found, calling OpenAI API...');
    
    // Verify API key
    if (!API_KEY) {
      throw new Error('OpenAI API key is missing. Check your environment variables.');
    }

    const response = await axios.post(API_URL, {
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are a friendly computer science teacher creating content for Lewis, a Year 9 student.
                 Make the content engaging, fun, and easy to understand.`
      }, {
        role: "user",
        content: `Create an engaging learning guide about ${topic} in computer science.
        Format it in markdown with these sections:
        
        # ${topic} 🚀

        ## What You'll Learn 🎯
        [Brief overview of what Lewis will learn]

        ## Real-World Examples 🌍
        [2-3 examples of where this is used in real life]

        ## Key Concepts Made Simple 📚
        [Main points with emojis and simple explanations]

        ## Try It Yourself! 💻
        [2-3 simple practice examples]

        ## Common Mistakes to Avoid ⚠️
        [List of typical mistakes students make]

        ## Quick Quiz Prep 🎮
        [3 practice questions to help prepare for the quiz]

        ## Pro Tips 🌟
        [Helpful hints for remembering key concepts]

        ---
        Remember Lewis: Understanding this will help you earn points! 🏆
        `
      }],
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('Received response from OpenAI');
    const content = response.data.choices[0].message.content;

    // Store in database
    console.log('Storing content in database...');
    const { error: dbError } = await supabase
      .from('learning_content')
      .insert({ 
        topic, 
        content
      });

    if (dbError) {
      console.error('Database storage error:', dbError);
      throw dbError;
    }

    console.log('Content successfully generated and stored');
    return content;
  } catch (error) {
    console.error('Content generation error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your configuration.');
      }
      throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || 'Unknown error'}`);
    }
    throw new Error('Failed to generate content. Please try again.');
  }
}

export async function generateQuestions(topic: string, count: number = 5): Promise<any[]> {
  console.log('Getting questions for:', topic);
  
  try {
    // Check for existing unused questions
    const { data: existingQuestions, error: fetchError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('topic', topic)
      .eq('used', false)
      .limit(count);

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      throw new Error('Failed to fetch existing questions');
    }

    // Check if we have enough valid questions
    if (existingQuestions && existingQuestions.length >= count) {
      console.log('Using existing questions');
      return existingQuestions;
    }

    console.log('Generating new questions with GPT-4...');
    const response = await axios.post(API_URL, {
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "You are a computer science teacher creating multiple choice questions. Respond with a valid JSON array of questions."
      }, {
        role: "user",
        content: `Generate ${count} multiple choice questions about ${topic}. 
        Each question should follow this exact format:
        {
          "question": "What is the question text?",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correct_answer": 0,
          "explanation": "Why this answer is correct"
        }
        Return as a JSON array of questions.`
      }],
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('Received response from GPT-4');
    let questions;
    try {
      const content = response.data.choices[0].message.content.trim();
      console.log('Parsing response:', content);
      questions = JSON.parse(content);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      console.error('Failed to parse GPT response:', parseError);
      console.log('Raw response:', response.data.choices[0].message.content);
      throw new Error('Invalid response format from AI. Please try again.');
    }

    console.log('Successfully parsed questions:', questions);

    // Store in database with used flag
    const formattedQuestions = questions.map(q => ({
      topic,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      used: false
    }));

    const { error } = await supabase
      .from('quiz_questions')
      .insert(formattedQuestions);

    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }

    console.log('Questions stored in database');
    return formattedQuestions;
  } catch (error) {
    console.error('Question generation error:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI response. Please try again.');
    }
    throw new Error('Failed to load questions. Please try again.');
  }
}

export async function markQuestionsAsUsed(questionIds: number[]) {
  try {
    const { error } = await supabase
      .from('quiz_questions')
      .update({ used: true })
      .in('id', questionIds);

    if (error) throw error;
    console.log('Questions marked as used');
  } catch (error) {
    console.error('Error marking questions as used:', error);
  }
}

export async function cleanupUsedQuestions(topic: string | null) {
  if (!topic) return;
  
  console.log('Cleaning up used questions for:', topic);
  try {
    // Delete used questions
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('topic', topic)
      .eq('used', true);

    if (error) throw error;
    console.log('Used questions cleaned up');

    // Generate new questions in background
    generateQuestions(topic, 5).catch(err => 
      console.error('Failed to generate new questions:', err)
    );
  } catch (error) {
    console.error('Error cleaning up questions:', error);
  }
}