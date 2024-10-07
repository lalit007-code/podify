import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const GenerateThumbnail = () => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  return (
    <div className="generate_thumbnail">
      <Button
        type="button"
        variant="plain"
        className={cn("", { "bg-black-6": isAiThumbnail })}
        onClick={() => setIsAiThumbnail(true)}
      >
        Use Ai to generate Thumbnail
      </Button>
      <Button
        type="button"
        variant="plain"
        className={cn("", { "bg-black-6": !isAiThumbnail })}
        onClick={() => setIsAiThumbnail(false)}
      >
        Upload custom Image
      </Button>
    </div>
  );
};

export default GenerateThumbnail;
