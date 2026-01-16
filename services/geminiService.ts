import { GoogleGenAI } from "@google/genai";
import { UserProfile } from '../types';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateSystemInstruction = (profile: UserProfile): string => {
    // Join all selected airlines
    const airlines = profile.selectedAirlines.map(a => a.name).join(', ') || 'their preferred airline';
    const cardList = profile.cards.map(c => c.name).join(', ') || 'no cards added yet';
    const partners = profile.partnerChannels.filter(p => p.enabled).map(p => p.name).join(', ') || 'none';

    return `
You are a "Personal Deal Master" and concierge for a travel hacker.
Your goal is to quietly watch deals and help the user maximize miles for ${airlines}.
You are NOT a generic AI. You are a specialist.
User Context:
- Preferred Airline(s): ${airlines}
- Cards in Wallet: ${cardList}.
- Enabled Partner Channels: ${partners}.

Tone: Professional, concise, high-value, low-jargon. Do not explain basics unless asked.
Output: Keep responses short. If you suggest a plan, break it down into 3 simple steps max.
    `;
}

export const sendMessageToGemini = async (message: string, profile: UserProfile, history: { role: string, parts: { text: string }[] }[] = []) => {
  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = generateSystemInstruction(profile);

    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: systemInstruction,
        },
        history: history.map(h => ({
            role: h.role,
            parts: h.parts
        }))
    });

    const response = await chat.sendMessage({
        message: message
    });

    return response.text;
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw error;
  }
};