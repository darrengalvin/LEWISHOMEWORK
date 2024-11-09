import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateAIContent(topic: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "You are a computer science teacher explaining concepts to a Year 9 student named Lewis Galvin. Keep explanations clear and engaging."
      }, {
        role: "user",
        content: `Create a comprehensive but accessible explanation of ${topic} in computer science, focusing on pseudocode concepts. Include examples and explanations suitable for Lewis.`
      }],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate learning content. Please try again.');
  }
}

export async function generateAIQuestions(topic: string, count: number = 5) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Create engaging multiple-choice questions about computer science concepts for a Year 9 student named Lewis Galvin."
      }, {
        role: "user",
        content: `Generate ${count} multiple-choice questions about ${topic}, focusing on pseudocode concepts. Each question should have 4 options, include an explanation for the correct answer, and be marked as easy, medium, or hard difficulty.`
      }],
      temperature: 0.7,
    });

    const questions = JSON.parse(completion.choices[0].message.content || '[]');
    
    return questions.map((q: any) => ({
      topic,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      difficulty: q.difficulty || 'medium',
      explanation: q.explanation
    }));
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate quiz questions. Please try again.');
  }
}