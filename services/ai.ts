
import { GoogleGenAI } from "@google/genai";

export class AIService {
  private static instance: AIService;
  private ai: GoogleGenAI;

  private constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateDescription(title: string, tags: string[]): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a professional and exciting description for a coding event titled "${title}". 
        The event is related to: ${tags.join(', ')}. 
        Include sections for "Overview", "What to Expect", and "Prerequisites". 
        Keep it concise and appealing to computer science students.`
      });
      return response.text || 'Failed to generate description.';
    } catch (error) {
      console.error('AI generation error:', error);
      return 'An error occurred while generating the description.';
    }
  }
}

export const aiService = AIService.getInstance();
