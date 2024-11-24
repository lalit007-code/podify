// GlobalAudioPlayer.jsx (or in a relevant part of your component tree)
import { useEffect, useRef } from "react";
import { useAudio } from "@/app/providers/AudioProvider";

const GlobalAudioPlayer = () => {
  const { audio } = useAudio();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audio && audio.audioUrl) {
      audioRef.current.src = audio.audioUrl;
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  }, [audio]);

  return <audio ref={audioRef} controls />;
};

export default GlobalAudioPlayer;
