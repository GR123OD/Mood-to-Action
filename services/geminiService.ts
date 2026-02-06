
import { GoogleGenAI, Type } from "@google/genai";
import { Biometrics, MoodAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMoodAndAct = async (biometrics: Biometrics): Promise<MoodAnalysis> => {
  const prompt = `
    Analyze the following biometric and activity data to determine the user's current physical and mental state.
    Biometrics:
    - Heart Rate: ${biometrics.heartRate} bpm
    - Heart Rate Variability (HRV): ${biometrics.hrv} ms
    - Sleep: ${biometrics.sleepDuration}h (Quality: ${biometrics.sleepQuality}%)
    - Stress Level: ${biometrics.stressLevel}/100
    - Activity: ${biometrics.steps} steps today
    - Work: ${biometrics.meetingsDuration} hours of meetings

    Based on this, provide:
    1. A concise summary of their state (e.g., "You are overstimulated but physically tired").
    2. A dominant mood label.
    3. Three specific, actionable recommendations in categories: Food, Media (Watch/Listen), and Wellness (Physical Action).
    
    The recommendations should be highly specific (e.g., "Spicy Miso Ramen" instead of "Japanese Food").
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          dominantMood: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                icon: { type: Type.STRING, description: 'An emoji representing the activity' }
              },
              required: ['id', 'category', 'title', 'description', 'reasoning', 'icon']
            }
          }
        },
        required: ['summary', 'dominantMood', 'recommendations']
      },
    },
  });

  return JSON.parse(response.text || '{}') as MoodAnalysis;
};
