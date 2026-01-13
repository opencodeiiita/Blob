import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import {type AIConfig} from './config.js';
import
{

  type StudyMaterialRequest,
  type StudyMaterialResponse,
  StudyMaterialSchema

  
}from './types.js';

export class StudyMaterialSDK
{
  private config: AIConfig;

  constructor(config: AIConfig)
  {
    this.config = config;
  }

  private getModel()
  {
    switch(this.config.provider)
    {
      case 'google':
        return createGoogleGenerativeAI({ 
          apiKey: this.config.apiKey 
        })(this.config.model);
      case 'openai':
        return createOpenAI({ 
          apiKey: this.config.apiKey 
        })(this.config.model);
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }
  }

async generateStudyMaterial(input: StudyMaterialRequest): Promise<StudyMaterialResponse> {
    const { object } = await generateObject({
      model: this.getModel(),
      schema: StudyMaterialSchema,
      system: `You are an expert educator. Create structured study material for a ${input.expertiseLevel} student.`,
      prompt: `Topic: ${input.topic}. ${input.additionalContext || ''}`,
    });

    return object;
  }
}