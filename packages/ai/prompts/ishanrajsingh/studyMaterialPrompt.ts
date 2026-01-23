import type { ExpertiseLevel } from '../../src/types';

export const generateStudyMaterialPrompt = (
  topic: string,
  expertiseLevel: ExpertiseLevel,
  additionalContext?: string
): string => {
  // Record type for type-safe indexed access
  const levelGuidelines: Record<ExpertiseLevel, string> = {
    beginner: "Use simple language, focus on fundamental concepts, provide detailed explanations with real-world analogies.",
    intermediate: "Assume basic familiarity, introduce more complex terminology, connect concepts to practical applications.",
    advanced: "Use technical terminology, explore nuanced relationships, challenge with edge cases and deep conceptual questions."
  };

  return `You are an expert educational content creator specializing in personalized learning materials. Generate comprehensive study materials for the following topic.

**Topic**: ${topic}
**Expertise Level**: ${expertiseLevel}
${additionalContext ? `**Additional Context**: ${additionalContext}` : ''}

**Guidelines for ${expertiseLevel} level**: ${levelGuidelines[expertiseLevel]}

**FLASHCARDS (Generate 8-10 cards)**:
- Create concise question-answer pairs
- Front: Clear, focused question or prompt
- Back: Comprehensive answer (2-4 sentences) with key terminology
- Cover core concepts, definitions, and practical applications
- Progress from foundational to more complex concepts
- Include memory aids or mnemonics where appropriate

**QUIZ QUESTIONS (Generate 5-7 questions)**:
- Craft challenging but fair multiple-choice questions
- Question: Clear, unambiguous stem testing understanding
- Options: 4 plausible choices with one correct answer
- Correct Answer: Must be definitively correct
- Explanation: Detailed reasoning (3-4 sentences) explaining why the correct answer is right and why others are wrong
- Mix question types: factual recall, application, analysis, and conceptual understanding
- Avoid "all of the above" or "none of the above" options

**MIND MAP**:
- Root: Central concept (${topic})
- Nodes: 8-15 hierarchical nodes representing key subtopics and concepts
- Structure: Clear parent-child relationships showing logical connections
- Coverage: Comprehensive overview of topic domains
- Each node: Concise label (2-5 words) representing a distinct concept
- Organization: Group related concepts together, maintain logical flow

**Quality Standards**:
- Accuracy: All information must be factually correct
- Clarity: Use precise language appropriate for ${expertiseLevel} level
- Relevance: Stay focused on the topic without unnecessary tangents
- Pedagogical value: Design materials that enhance learning and retention
- Diversity: Cover different aspects and dimensions of the topic

Generate study materials that are engaging, educationally sound, and tailored to ${expertiseLevel} learners.`;
};
