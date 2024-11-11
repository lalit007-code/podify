// import { GeneratePodcastProps } from "@/types/Index";

// import { Label } from "./ui/label";
// import { Textarea } from "./ui/textarea";
// import { Button } from "./ui/button";
// import { Loader } from "lucide-react";
// import { useState } from "react";
// import { useAction, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { v4 as uuidv4 } from "uuid";

// import { useUploadFiles } from "@xixixao/uploadstuff/react";
// import { useToast } from "@/hooks/use-toast";

// const useGeneratePodcast = ({
//   setAudio,
//   setAudioStorageId,
//   voicePrompt,
// }: GeneratePodcastProps) => {
//   const [isGenerating, setIsGenerating] = useState(false);

//   const generateUploadUrl = useMutation(api.file.generateUploadUrl);
//   const { startUpload } = useUploadFiles(generateUploadUrl);
//   const getPodcastAudio = useAction(api.openai.generateAudioAction);
//   const getAudioUrl = useMutation(api.podcasts.geturl);

//   const { toast } = useToast();

//   const generatePodcast = async () => {
//     setIsGenerating(true);
//     setAudio("");

//     if (!voicePrompt) {
//       toast({
//         title: "Please provide a voice prompt to generate the podcast",
//       });
//       setIsGenerating(false);
//       return;
//     }

//     try {
//       console.log("Calling getPodcastAudio with input:", voicePrompt);

//       // Call the action to get audio buffer directly
//       const audioBuffer = await getPodcastAudio({ input: voicePrompt });
//       console.log("Received audio buffer:", audioBuffer);

//       // Create a Blob from the audio buffer
//       const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
//       const fileName = `podcast-${uuidv4()}.mp3`;
//       const file = new File([blob], fileName, { type: "audio/mpeg" });

//       const uploaded = await startUpload([file]);
//       const storageId = (uploaded[0].response as any).storageId;

//       setAudioStorageId(storageId);

//       const audioUrl = await getAudioUrl({ storageId });
//       setAudio(audioUrl!);
//       setIsGenerating(false);
//       toast({
//         title: "Podcast generated successfully",
//       });
//     } catch (error) {
//       console.log("Error generating podcast:", error);
//       toast({
//         title: "Error creating Podcast",
//         variant: "destructive",
//       });
//       setIsGenerating(false);
//     }
//   };

//   return { isGenerating: isGenerating, generatePodcast: generatePodcast };
// };

// const GeneratePodcast = (props: GeneratePodcastProps) => {
//   const { isGenerating, generatePodcast } = useGeneratePodcast(props);

//   return (
//     <div>
//       <div className="flex flex-col gap-2.5">
//         <Label className="text-16 font-bold text-white-1">
//           AI Prompt to Generate Podcast
//         </Label>
//         <Textarea
//           className="input-class font-light focus-visible:ring-offset-orange-1"
//           placeholder="Provide text to generate audio"
//           rows={5}
//           value={props.voicePrompt}
//           onChange={(e) => props.setVoicePrompt(e.target.value)}
//         />
//       </div>
//       <div className="mt-5 w-full max-w-[200px]">
//         <Button
//           type="submit"
//           className="text-16 bg-orange-1 py-4 font-bold text-white-1"
//           onClick={generatePodcast}
//         >
//           {isGenerating ? (
//             <>
//               Generating
//               <Loader className="animate-spin ml-2" size={20} />
//             </>
//           ) : (
//             "Generate"
//           )}
//         </Button>
//       </div>
//       {props.audio && (
//         <audio
//           controls
//           src={props.audio}
//           autoPlay
//           className="mt-5"
//           onLoadedMetadata={(e) =>
//             props.setAudioDuration(e.currentTarget.duration)
//           }
//         />
//       )}
//     </div>
//   );
// };

// export default GeneratePodcast;

// "use client";
// import { useEffect, useState } from "react";
// import { useMutation, useAction } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { v4 as uuidv4 } from "uuid";
// import { useToast } from "@/hooks/use-toast";
// // import LoadingDots from "./loadingDots";
// import modelList from "../modelss.json";
// import Header from "./components/Header";
// import Modal from "./components/Modal";
// import { Loader2 } from "lucide-react";

// const useGenerateAudio = ({
//   text,
//   selectedModel,
//   setUrl,
//   setIsLoading,
//   setMessage,
// }) => {
//   const { toast } = useToast();
//   const generateAudio = useMutation(api.openai.generateVoiceOver); // Assuming the appropriate Convex action
//   const [voices, setVoices] = useState([]);

//   useEffect(() => {
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
//     const { country, ...model } = modelArr[0];

//     try {
//       const audioResponse = await generateAudio({
//         text: text,
//         voice: model,
//       });

//       if (audioResponse && audioResponse.url) {
//         setUrl(audioResponse.url);
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
//       setIsLoading(false);
//     }
//   };

//   return { handleGetAudio };
// };

// const Home = () => {
//   const [text, setText] = useState("");
//   const [selectedGender, setSelectedGender] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("");
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedName, setSelectedName] = useState("");
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [url, setUrl] = useState("");

//   const { handleGetAudio } = useGenerateAudio({
//     text,
//     selectedModel: selectedName,
//     setUrl,
//     setIsLoading,
//     setMessage,
//   });

//   useEffect(() => {
//     const filtered = modelList["voices_list"].filter(
//       (voice) =>
//         (selectedGender ? voice.gender === selectedGender : true) &&
//         (selectedLanguage ? voice.language === selectedLanguage : true) &&
//         (selectedCountry ? voice.country === selectedCountry : true)
//     );
//     setFilteredModels(filtered);
//   }, [selectedGender, selectedLanguage, selectedCountry]);

//   const uniqueValues = (key) => [
//     ...new Set(modelList["voices_list"].map((voice) => voice[key])),
//   ];

//   const handleClear = () => {
//     setText("");
//     setMessage("");
//     setSelectedGender("");
//     setSelectedLanguage("");
//     setSelectedCountry("");
//     setSelectedName("");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-5">
//       <Header />
//       <div className="grid grid-cols-2 grid-rows-[4fr,1fr] gap-5 p-5 bg-white rounded-lg shadow-lg w-[1300px] h-[620px] max-md:grid-cols-1 max-md:w-full max-md:h-full">
//         <div className="grid grid-rows-[44px,1fr] row-span-full">
//           <div className="pl-2 border border-gray-300 rounded-t-lg bg-gray-100 flex justify-end items-center">
//             <button
//               className="px-4 py-2 text-lg font-medium bg-blue-600 text-white rounded-tr-lg transition duration-300 hover:bg-blue-700"
//               onClick={handleClear}
//             >
//               Clear
//             </button>
//           </div>
//           <textarea
//             className="w-full h-full p-4 text-base mb-5 rounded-b-lg border text-black border-gray-300 shadow-inner bg-gradient-to-br from-white to-gray-200 transition duration-300 focus:border-blue-600 focus:shadow focus:shadow-blue-200 focus:outline-none focus:bg-gradient-to-br"
//             placeholder="Enter your text here..."
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />
//         </div>
//         <div className="relative flex flex-col items-center justify-center gap-4 h-[70%] p-5 bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg shadow-lg before:content-['Voice_Filter'] before:absolute before:top-[-10px] before:left-[-10px] before:bg-blue-600 before:text-white before:px-2 before:rounded before:font-bold before:text-sm before:shadow-md max-md:h-full max-md:py6">
//           <select
//             className="w-full p-3 text-base rounded-lg border border-gray-300 bg-white text-black"
//             value={selectedGender}
//             onChange={(e) => setSelectedGender(e.target.value)}
//           >
//             <option value="">Select Gender</option>
//             {uniqueValues("gender")
//               .sort()
//               .map((gender, index) => (
//                 <option key={index} value={gender}>
//                   {gender}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="w-full p-3 text-base rounded-lg border border-gray-300 bg-white text-black"
//             value={selectedLanguage}
//             onChange={(e) => setSelectedLanguage(e.target.value)}
//           >
//             <option value="">Select Language</option>
//             {uniqueValues("language")
//               .sort()
//               .map((language, index) => (
//                 <option key={index} value={language}>
//                   {language}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="w-full p-3 text-base rounded-lg border border-gray-300 bg-white text-black"
//             value={selectedCountry}
//             onChange={(e) => setSelectedCountry(e.target.value)}
//           >
//             <option value="">Select Country</option>
//             {uniqueValues("country")
//               .sort()
//               .map((country, index) => (
//                 <option key={index} value={country}>
//                   {country}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="w-full p-3 text-base rounded-lg border border-gray-300 bg-white text-black"
//             value={selectedName}
//             onChange={(e) => setSelectedName(e.target.value)}
//           >
//             <option value="">Select Model</option>
//             {filteredModels.map((voice, index) => (
//               <option key={index} value={voice.name}>
//                 {voice.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex flex-col justify-end">
//           <div className="text-red-600 text-center text-lg font-bold">
//             {message}
//           </div>
//           <button
//             className="px-5 py-3 text-lg font-bold mt-4 rounded-lg bg-blue-600 text-white cursor-pointer transition duration-300 hover:bg-blue-700 shadow-lg flex items-center justify-center relative h-[60%]"
//             onClick={handleGetAudio}
//             disabled={isLoading}
//           >
//             {isLoading ? <Loader2 className="animate-spin" /> : "Get Audio"}
//           </button>
//         </div>
//       </div>
//       {showModal && url && <Modal setShowModal={setShowModal} url={url} />}
//     </div>
//   );
// };

// export default Home;

// "use client";
// import { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
// // import { useGenerateAudio } from "./useGenerateAudio"; // Assuming the custom hook is imported
// import { Loader2 } from "lucide-react";
// // import Modal from "./components/Modal";
// import { Label } from "./ui/label";
// import { Textarea } from "./ui/textarea";
// import { Button } from "./ui/button";

// const GeneratePodcast = (props: any) => {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [url, setUrl] = useState("");
//   const [message, setMessage] = useState("");
//   // const { handleGetAudio } = useGenerateAudio({
//   //   text: props.voicePrompt,
//   //   selectedModel: props.selectedName,
//   //   // setUrl,
//   //   // setIsLoading,
//   //   // setMessage,
//   // });

//   // const handleGenerate = async () => {
//   //   setIsLoading(true);
//   //   await handleGetAudio(); // Trigger the audio generation
//   //   setIsLoading(false);
//   // };

//   return (
//     <div>
//       <div className="flex flex-col gap-2.5">
//         <Label className="text-16 font-bold text-white-1">
//           AI Prompt to Generate Podcast
//         </Label>
//         <Textarea
//           className="input-class font-light focus-visible:ring-offset-orange-1"
//           placeholder="Provide text to generate audio"
//           rows={5}
//           value={props.voicePrompt}
//           onChange={(e) => props.setVoicePrompt(e.target.value)}
//         />
//       </div>
//       <div className="mt-5 w-full max-w-[200px]">
//         <Button
//           type="submit"
//           className="text-16 bg-orange-1 py-4 font-bold text-white-1"
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <>
//               Generating
//               <Loader2 className="animate-spin ml-2" size={20} />
//             </>
//           ) : (
//             "Generate"
//           )}
//         </Button>
//       </div>
//       {message && <div className="text-red-600 text-center">{message}</div>}
//       {url && <audio controls src={url} autoPlay className="mt-5" />}
//       {/* {url && <Modal setShowModal={props.setShowModal} url={url} />} */}
//     </div>
//   );
// };

// export default GeneratePodcast;
import { GeneratePodcastProps } from "@/types/Index";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";

import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "@/hooks/use-toast";

const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.file.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.openai.generateAudioAction);

  const getAudioUrl = useMutation(api.podcasts.geturl);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("");

    if (!voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate a podcast",
      });
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      console.log("Error generating podcast", error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return { isGenerating, generatePodcast };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
