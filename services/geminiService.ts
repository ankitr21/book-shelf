import { GoogleGenAI, Type } from "@google/genai";
import { Book } from '../types';

const apiKey = process.env.API_KEY || '';

// Singleton-like access, though instantiated per call in this simple setup
// In a real app, you might manage the instance more centrally.

export const getBookRecommendations = async (
  userPreferences: string,
  currentBooks: Book[]
): Promise<{ recommendations: Book[], reason: string }> => {
  if (!apiKey) {
    console.warn("API Key not found for Gemini");
    return { recommendations: [], reason: "API Key missing" };
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const bookTitles = currentBooks.map(b => b.title).join(", ");
  
  const prompt = `
    Based on the user's request: "${userPreferences}" 
    and their current library containing: ${bookTitles},
    recommend 3 books.
    Return a JSON object with a 'reason' string explaining the selection and a 'recommendations' array.
    Each recommendation should include title, author (as a string, if multiple join with comma), and a short description.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reason: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["title", "author", "description"],
              }
            }
          },
          required: ["reason", "recommendations"],
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      // Transform to match our Book interface roughly
      const books: Book[] = parsed.recommendations.map((rec: any, index: number) => ({
        id: `gemini-rec-${index}-${Date.now()}`,
        title: rec.title,
        authors: [rec.author],
        description: rec.description,
        // Note: We don't get real thumbnails from Gemini text gen easily, 
        // in a real app we would search Google Books API with these titles to fill in the metadata.
        thumbnail: `https://via.placeholder.com/128x192.png?text=${encodeURIComponent(rec.title)}`,
        pageCount: 300, // Placeholder
      }));
      return { recommendations: books, reason: parsed.reason };
    }
    return { recommendations: [], reason: "No response generated." };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { recommendations: [], reason: "Failed to generate recommendations." };
  }
};

export const generateBookSummary = async (title: string, author: string): Promise<string> => {
    if (!apiKey) return "API Key missing.";

    const ai = new GoogleGenAI({ apiKey });
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a concise, engaging 2-sentence summary (hook) for the book "${title}" by ${author}. Do not give spoilers.`,
        });
        return response.text || "Summary unavailable.";
    } catch (e) {
        console.error(e);
        return "Could not generate summary.";
    }
}
