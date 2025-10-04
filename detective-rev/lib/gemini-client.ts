import { GeminiRequest, GeminiResponse } from './types';

export async function askGemini(query: string, gameContext?: string): Promise<GeminiResponse> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        gameContext,
      } as GeminiRequest),
    });

    const data: GeminiResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get response');
    }

    return data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      response: 'Sorry, I encountered an error. Please try again.',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}