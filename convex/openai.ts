import { ElevenLabs, ElevenLabsClient } from "elevenlabs";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { Buffer } from "buffer";

// Ensure the API key is available
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
if (!ELEVENLABS_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
}

// Create an instance of the ElevenLabs client
const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

// Action to generate audio from text
export const generateAudioAction = action({
  args: { input: v.string() },
  handler: async (ctx, { input }) => {
    console.log("Handler function started");
    console.log("generateAudioAction called with input:", input);

    try {
      console.log("Starting text-to-speech conversion");
      const audioBuffer = await createAudioStreamFromText(input);
      console.log("Text-to-speech conversion completed");

      // Return the audio buffer directly
      return audioBuffer;
    } catch (error) {
      console.error("Error in generateAudioAction:", error);
      throw new Error(`Failed to generate audio: ${error}`);
    }
  },
});

// Function to create an audio stream from text
const createAudioStreamFromText = async (text: string) => {
  const audioStream = await client.textToSpeech.convertAsStream(
    "pMsXgVXv3BLzUgSXRplE", // Replace with your voice ID if needed
    {
      optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
      output_format: ElevenLabs.OutputFormat.Mp32205032,
      text,
      voice_settings: {
        stability: 0.1,
        similarity_boost: 0.3,
        style: 0.2,
      },
    }
  );

  const chunks = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }

  const audioBuffer = Buffer.concat(chunks);
  return audioBuffer; // Return the complete audio Buffer
};
