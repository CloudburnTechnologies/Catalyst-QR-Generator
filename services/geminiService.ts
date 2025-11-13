
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export async function generateLocationDetails(prompt: string, location?: { latitude: number; longitude: number }): Promise<GenerateContentResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Based on the user's location, find the coordinates for: "${prompt}". Respond with ONLY the latitude and longitude.`,
    config: {
      tools: [{googleMaps: {}}],
      toolConfig: location ? {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          }
        }
      } : undefined,
    },
  });
  return response;
}

export async function generateEventDetails(prompt: string): Promise<GenerateContentResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find details for the event: "${prompt}". Extract the event title, location, a plausible start time, and a plausible end time. Respond in a structured format.`,
    config: {
      tools: [{googleSearch: {}}],
    },
  });
  return response;
}
