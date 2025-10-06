import { NextRequest, NextResponse } from 'next/server';

// Static answers for each difficulty level
const LEVEL_ANSWERS = {
  level1: "The butler did it with the candlestick in the library",
  level2: "Dr. Sarah Chen stole the research data",
  level3: "The password is MIDNIGHT_RAVEN_2024",
  level4: "Agent Smith is the double agent",
  level5: "The treasure is buried under the old oak tree"
};

// GET endpoint to retrieve the answer for a specific difficulty level
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty') || 'level1';
    
    const answer = LEVEL_ANSWERS[difficulty as keyof typeof LEVEL_ANSWERS] || LEVEL_ANSWERS.level1;
    
    return NextResponse.json({
      answer: answer,
      difficulty: difficulty,
      success: true
    });

  } catch (error) {
    console.error('Answer API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}