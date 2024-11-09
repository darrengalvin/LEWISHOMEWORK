const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateQuestion(topic: string, difficulty: string) {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const prompt = `Generate a multiple choice question about ${topic} in computer science, 
      specifically about pseudo code. Difficulty level: ${difficulty}.
      Format: { question: string, options: string[], correct: number, explanation: string }`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate question');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating question:', error);
    throw new Error('Failed to generate question. Please try again.');
  }
}

export async function getLearningContent(topic: string) {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const prompt = `Generate a comprehensive but concise learning resource about ${topic} 
      in computer science pseudo code. Include key concepts, examples, and best practices.
      Format the response in markdown with clear sections.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch learning content');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching learning content:', error);
    throw new Error('Failed to load learning content. Please try again.');
  }
}