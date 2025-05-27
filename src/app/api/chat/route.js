import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY  });

export async function POST(request) {
  try {
    // Parse the JSON body correctly
    const { message } = await request.json();
    console.log("Received message:", message);

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    const responseText = result?.response?.text || result?.text || "";

    // Return the formatted response
    return new Response(
      JSON.stringify({ rawOutput: responseText }),
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
