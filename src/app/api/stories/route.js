import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { storyId, title, content } = await request.json();

    if (!content || !title) {
      return new Response(
        JSON.stringify({ error: "Missing story content or title" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const prompt = `
You are a creative assistant. Given a children's story, perform the following:
1. Reformat the story into a beautiful, well-structured HTML document suitable for a children's book:
   - Use headings, paragraphs, bullet points where needed
   - Add inline CSS styles for colors, spacing, and font sizes
   - Make it visually engaging but simple
   - Don't give images. 

Title: ${title}

Story:
${content}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Use safety fallback for structured response
    const responseText = result?.response?.text || result?.text || "";


    return new Response(
      JSON.stringify({
        storyId,
        rawOutput: responseText, // Optional, in case the frontend wants to parse
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Gemini error:", error);
    return new Response(
      JSON.stringify({ error: "Gemini content generation failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
