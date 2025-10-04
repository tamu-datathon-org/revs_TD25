import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, gameContext } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Construct the prompt for the game
    const gamePrompt = `You are an AI assistant helping with a guessing game. The user is trying to guess the correct answer by asking questions. 

Game Context: ${gameContext || 'General guessing game'}

User's question: ${query}

Please provide a helpful response that guides the user toward the correct answer without giving it away directly. Be encouraging and provide hints when appropriate.`;

    // Make request to Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: gamePrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from Gemini API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract the generated text from Gemini's response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: generatedText,
      success: true
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}