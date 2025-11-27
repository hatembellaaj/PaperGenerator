import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const assistantId = process.env.OPENAI_ASSISTANT_ID;

// Helper to ensure keys are present
export function assertEnv() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required');
  }

  if (!assistantId) {
    throw new Error('OPENAI_ASSISTANT_ID is required');
  }
}
