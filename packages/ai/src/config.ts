export type AIProvider = 'google' | 'openai';

export interface AIConfig
{
  provider: AIProvider;
  apiKey: string;
  model: string;
}
