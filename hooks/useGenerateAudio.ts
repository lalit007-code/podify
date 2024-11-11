// "use client";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useToast } from "@/hooks/use-toast";
// import { useEffect, useState } from "react";

// const useGenerateAudio = ({
//   text,
//   selectedModel,
//   setUrl,
//   setIsLoading,
//   setMessage,
// }) => {
//   const { toast } = useToast();
//   const generateAudio = useMutation(api.openai.generateVoiceOver); // Use the mutation from Convex
//   const [voices, setVoices] = useState([]);

//   useEffect(() => {
//     // Initialize the voices list here, assuming it comes from a JSON or API
//     setVoices(modelList["voices_list"]);
//   }, []);

//   const handleGetAudio = async () => {
//     if (!selectedModel) {
//       setMessage("Please select a model...");
//       return;
//     }

//     setMessage("");
//     setIsLoading(true);
//     const modelArr = voices.filter((voice) => voice.name === selectedModel);
//     const { country, ...model } = modelArr[0]; // Destructure and get the model data

//     try {
//       // Call the mutation to generate audio
//       const audioResponse = await generateAudio({
//         text: text,
//         voice: model,
//       });

//       if (audioResponse && audioResponse.url) {
//         setUrl(audioResponse.url); // Set the URL if successful
//         toast({
//           title: "Audio generated successfully!",
//         });
//       } else {
//         throw new Error("Invalid response format...");
//       }
//     } catch (error) {
//       setMessage("Failed to fetch audio...");
//       toast({
//         title: "Error generating audio",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false); // Stop the loading spinner
//     }
//   };

//   return { handleGetAudio };
// };
