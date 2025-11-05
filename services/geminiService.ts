import { GoogleGenAI, Modality } from "@google/genai";
import { playAudio } from '../utils/audioUtils';

let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

// A promise that resolves when the last speech task is complete.
// We chain new tasks onto this promise to ensure sequential execution.
let speechChain = Promise.resolve();

const RATE_LIMIT_PERIOD = 6000; // 10 requests per minute = 1 request every 6 seconds.
let lastApiCallTime = 0;

export const speak = (text: string): Promise<void> => {
    const newSpeechTask = async () => {
        // This function's execution is deferred by the promise chain.
        // It will only run after the previous task is complete.

        // Enforce the rate limit by waiting if necessary.
        const now = Date.now();
        const timeSinceLastCall = now - lastApiCallTime;
        if (timeSinceLastCall < RATE_LIMIT_PERIOD) {
            const delay = RATE_LIMIT_PERIOD - timeSinceLastCall;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        try {
            const genAI = getAIClient();
            lastApiCallTime = Date.now(); // Mark the time right before the API call.
            const response = await genAI.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: `Say with a friendly and encouraging tone: ${text}` }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Zephyr' }, 
                        },
                    },
                },
            });
            
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                await playAudio(base64Audio);
            } else {
                console.error("No audio data received from API.");
            }
        } catch (error) {
            console.error("Error in text-to-speech service:", error);
            // Log the error but don't re-throw, to allow the chain to continue with subsequent requests.
        }
    };

    // Append the new task to the chain. It will execute after the previous one finishes.
    speechChain = speechChain.then(newSpeechTask);
    
    // Return the promise for the updated chain. When the component `await`s this,
    // it waits for this specific task (and all preceding ones) to complete.
    return speechChain;
};
