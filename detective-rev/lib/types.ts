export interface GeminiRequest {
  query: string;
  gameContext?: string;
}

export interface GeminiResponse {
  response: string;
  success: boolean;
  error?: string;
}

export interface GeminiAPIResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}