"use client";
import { useEffect, useState } from "react";

import modelList from "@/modelss.json";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type GenerateAudioProps = {
  voicePrompt: string;
  setVoicePrompt: React.Dispatch<React.SetStateAction<string>>;
  selectedGender: string;
  setSelectedGender: React.Dispatch<React.SetStateAction<string>>;
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  selectedCountry: string;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
  audioUrl: string;
  setAudioUrl: React.Dispatch<React.SetStateAction<string>>;
};

export default function   GenerateAudio({
  voicePrompt,
  setVoicePrompt,
  selectedGender,
  setSelectedGender,
  selectedLanguage,
  setSelectedLanguage,
  selectedCountry,
  setSelectedCountry,
  audioUrl,
  setAudioUrl,
}: GenerateAudioProps) {
  type Voice = {
    id: number;
    voice_id: string;
    gender: string;
    language_code: string;
    language: string;
    name: string;
    sample_text: string;
    sample_audio_url: string;
    status: number;
    rank: number;
    type: string;
    country: string;
  };

  const [selectModel, setSelectedModel] = useState("");
  const [filteredModels, setFilteredModels] = useState<Voice[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [voices, setVoices] = useState<Voice[]>([]);

  useEffect(() => {
    setVoices(modelList["voices_list"] as Voice[]);
  }, []);

  useEffect(() => {
    const filtered = voices.filter(
      (voice) =>
        (selectedGender ? voice.gender === selectedGender : true) &&
        (selectedLanguage ? voice.language === selectedLanguage : true) &&
        (selectedCountry ? voice.country === selectedCountry : true)
    );
    setFilteredModels(filtered);
  }, [selectedGender, selectedLanguage, selectedCountry]);

  const handleGetAudio = async () => {
    if (!selectModel) {
      setMessage("Please select a model...");
      return;
    }
    setMessage("");
    setIsLoading(true);
    const modelArr = filteredModels.filter(
      (model) => model.name === selectModel
    );
    const { country, ...model } = modelArr[0];

    try {
      const response = await fetch("/api/get-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: voicePrompt,
          voice: model,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed...");
      }
      const data = await response.json();
      if (data && data.length > 0 && data[0].link) {
        setAudioUrl(data[0].link);
      } else {
        throw new Error("Invalid response format...");
      }
    } catch {
      setMessage("Failed to fetch...");
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueValues = (key) => [...new Set(voices.map((voice) => voice[key]))];
  return (
    <div className="flex flex-col w-full space-y-5">
      <div className="flex flex-col w-full">
        <Label className="text-white-1 font-bold text-xl mt-4 mb-4">
          Enter the text and select option to generate audio for your Podcast
        </Label>
        <textarea
          className="bg-black-1 text-white-1"
          placeholder="Enter your text here..."
          value={voicePrompt}
          onChange={(e) => setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="flex flex-col text-white-1 space-y-5">
        <select
          className="bg-black-1 w-full"
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
        >
          <option value="" className="text-white-1">
            Select Gender
          </option>
          {uniqueValues("gender")
            .sort()
            .map((gender, index) => (
              <option className="text-white-1" key={index} value={gender}>
                {gender}
              </option>
            ))}
        </select>
        <select
          className="bg-black-1 w-full"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">Select Language</option>
          {uniqueValues("language")
            .sort()
            .map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
        </select>
        <select
          className="bg-black-1 w-full"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">Select Country</option>
          {uniqueValues("country")
            .sort()
            .map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
        </select>
        <select
          className="bg-black-1 w-full"
          value={selectModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="">Select Model</option>
          {filteredModels.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
      <div className="">
        <div className="">{message}</div>
        <Button
          className="text-white-1 bg-orange-1"
          onClick={handleGetAudio}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Generate Audio"}
        </Button>
      </div>
      {audioUrl && <audio controls src={audioUrl} autoPlay className="mt-5" />}
    </div>
  );
}
