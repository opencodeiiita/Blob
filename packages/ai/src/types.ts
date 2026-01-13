import { z } from 'zod';


export type ExpertiseLevel = 'beginner' | 'intermediate' | 'advanced';

export const FlashcardSchema = z.object
(
    {
        front: z.string(),
        back: z.string(),
    }
);

export const QuizQuestionSchema = z.object(
    {
        question: z.string(),
        options: z.array(z.string()).length(4),
        correctAnswer: z.string(),
        explanation: z.string(),
    }
)

export const MindMapSchema = z.object({
  root: z.string(),
  nodes: z.array(z.object({
    id: z.string(),
    label: z.string(),
    parentId: z.string().optional()
  }))
});

export const StudyMaterialSchema = z.object
(
    {
        flashcards: z.array(FlashcardSchema),
        quiz:  z.array(QuizQuestionSchema),
        mindmap: MindMapSchema,
    }
);

export type StudyMaterialResponse = z.infer<typeof StudyMaterialSchema>;

export interface StudyMaterialRequest
{
    topic: string;
    expertiseLevel: ExpertiseLevel;
    additionalContext?: string;
}


