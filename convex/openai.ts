// import { mutation } from "./_generated/server";
// import axios from "axios";

// // Define a mutation to fetch voice-over data
// export const generateVoiceOver = mutation(async ({ input }) => {
//   const { text, voice } = input;

//   // Check if the required parameters are present
//   if (!text || !voice) {
//     throw new Error("Missing text or voice parameter");
//   }

//   const options = {
//     method: "POST",
//     url: "https://realistic-text-to-speech.p.rapidapi.com/v3/generate_voice_over_v2",
//     headers: {
//       "x-rapidapi-key": process.env.API_KEY, // Store API key securely
//       "x-rapidapi-host": "realistic-text-to-speech.p.rapidapi.com",
//       "Content-Type": "application/json",
//     },
//     data: {
//       voice_obj: voice,
//       json_data: [
//         {
//           block_index: 0,
//           text: text,
//         },
//       ],
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     return response.data; // Return the response from the API
//   } catch (error) {
//     console.error("Error fetching speech data:", error);
//     throw new Error("Failed to fetch speech data");
//   }
// });

import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as SpeechCreateParams["voice"],
      input,
    });

    const buffer = await mp3.arrayBuffer();

    return buffer;
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const url = response.data[0].url;

    if (!url) {
      throw new Error("Error generating thumbnail");
    }

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  },
});
