/**
 * Gemini API utility functions for generating flashcards
 */

export interface FlashcardData {
  front: string;
  back: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface GeminiResponse {
  flashcards: FlashcardData[];
}

/**
 * Generates flashcards from topic content using Gemini API
 * @param apiKey - User's Gemini API key
 * @param topicContent - The content/topic to generate flashcards from
 * @returns Array of flashcard data
 */
export async function generateFlashcards(
  apiKey: string,
  topicContent: string
): Promise<FlashcardData[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const prompt = `Generate flashcards from the following topic content. Return ONLY a valid JSON array of flashcards, where each flashcard has:
- "front": the question or prompt (string)
- "back": the answer or explanation (string)
- "difficulty": optional difficulty level ("easy", "medium", or "hard")

Topic content:
${topicContent}

Return format (JSON array only, no markdown, no code blocks):
[
  {
    "front": "Question here",
    "back": "Answer here",
    "difficulty": "easy"
  }
]`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "Failed to generate flashcards";
    
    if (response.status === 400) {
      errorMessage = "Invalid API key or request format";
    } else if (response.status === 429) {
      errorMessage = "API rate limit exceeded. Please try again later.";
    } else if (response.status === 403) {
      errorMessage = "API key does not have permission to access Gemini API";
    } else {
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        errorMessage = `API error: ${response.status} ${response.statusText}`;
      }
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  
  // Extract text from Gemini response
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textContent) {
    throw new Error("No content received from Gemini API");
  }

  // Parse JSON from response (handle markdown code blocks if present)
  let jsonText = textContent.trim();
  
  // Remove markdown code blocks if present
  jsonText = jsonText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");
  jsonText = jsonText.trim();

  let flashcards: FlashcardData[];
  
  try {
    flashcards = JSON.parse(jsonText);
  } catch (parseError) {
    throw new Error(
      `Failed to parse flashcards from API response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`
    );
  }

  // Validate flashcards structure
  if (!Array.isArray(flashcards)) {
    throw new Error("API response is not an array of flashcards");
  }

  // Validate each flashcard
  for (const card of flashcards) {
    if (!card.front || !card.back) {
      throw new Error("Invalid flashcard format: missing front or back");
    }
    
    if (typeof card.front !== "string" || typeof card.back !== "string") {
      throw new Error("Invalid flashcard format: front and back must be strings");
    }
    
    if (card.difficulty && !["easy", "medium", "hard"].includes(card.difficulty)) {
      throw new Error(`Invalid difficulty level: ${card.difficulty}`);
    }
  }

  return flashcards;
}
