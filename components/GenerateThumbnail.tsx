// import { useRef, useState } from "react";
// import { Button } from "./ui/button";
// import { cn } from "@/lib/utils";
// import { Label } from "./ui/label";
// import { Textarea } from "./ui/textarea";
// import { GenerateThumbnailProps } from "@/types/Index";
// import { Loader } from "lucide-react";
// import { Input } from "./ui/input";
// import Image from "next/image";

// import { v4 as uuidv4 } from "uuid";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";

// const GenerateThumbnail = ({
//   setImage,
//   image,
//   imagePrompt,
//   setImagePrompt,
// }: GenerateThumbnailProps) => {
//   const [isAiThumbnail, setIsAiThumbnail] = useState(false);
//   const [isImageLoading, setIsImageLoading] = useState(false);

//   const imageRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();

//   const generateImage = async () => {
//     setIsImageLoading(true);
//     try {
//       const response = await fetch("/api/generate-image", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           query: "A Cat Eating Noodles With Chop Sticks.",
//         }),
//       });
//       const data = await response.json();
//       setImage(data.message.output_png);
//       setIsImageLoading(false);
//     } catch (error) {
//       console.log(error);
//       toast({ title: "Error generating thumbnail", variant: "destructive" });
//     }
//   };
//   const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();

//     try {
//       const files = e.target.files;
//       if (!files) return;
//       const file = files[0];
//       const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

//       handleImage(blob, file.name);
//     } catch (error) {
//       console.log(error);
//       toast({ title: "Error uploading image", variant: "destructive" });
//     }
//   };

//   return (
//     <>
//       <div className="generate_thumbnail">
//         <Button
//           type="button"
//           variant="plain"
//           onClick={() => setIsAiThumbnail(true)}
//           className={cn("", {
//             "bg-black-6": isAiThumbnail,
//           })}
//         >
//           Use AI to generate thumbnail
//         </Button>
//         <Button
//           type="button"
//           variant="plain"
//           onClick={() => setIsAiThumbnail(false)}
//           className={cn("", {
//             "bg-black-6": !isAiThumbnail,
//           })}
//         >
//           Upload custom image
//         </Button>
//       </div>
//       {isAiThumbnail ? (
//         <div className="flex flex-col gap-5">
//           <div className="mt-5 flex flex-col gap-2.5">
//             <Label className="text-16 font-bold text-white-1">
//               AI Prompt to generate Thumbnail
//             </Label>
//             <Textarea
//               className="input-class font-light focus-visible:ring-offset-orange-1"
//               placeholder="Provide text to generate thumbnail"
//               rows={5}
//               value={imagePrompt}
//               onChange={(e) => setImagePrompt(e.target.value)}
//             />
//           </div>
//           <div className="w-full max-w-[200px]">
//             <Button
//               type="submit"
//               className="text-16 bg-orange-1 py-4 font-bold text-white-1"
//               onClick={generateImage}
//             >
//               {isImageLoading ? (
//                 <>
//                   Generating
//                   <Loader size={20} className="animate-spin ml-2" />
//                 </>
//               ) : (
//                 "Generate"
//               )}
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <div className="image_div" onClick={() => imageRef?.current?.click()}>
//           <Input
//             type="file"
//             className="hidden"
//             ref={imageRef}
//             onChange={(e) => uploadImage(e)}
//           />
//           {!isImageLoading ? (
//             <Image
//               src="/icons/upload-image.svg"
//               width={40}
//               height={40}
//               alt="upload"
//             />
//           ) : (
//             <div className="text-16 flex-center font-medium text-white-1">
//               Uploading
//               <Loader size={20} className="animate-spin ml-2" />
//             </div>
//           )}
//           <div className="flex flex-col items-center gap-1">
//             <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
//             <p className="text-12 font-normal text-gray-1">
//               SVG, PNG, JPG, or GIF (max. 1080x1080px)
//             </p>
//           </div>
//         </div>
//       )}
//       {image && (
//         <div className="flex-center w-full">
//           <Image
//             src={image}
//             width={200}
//             height={200}
//             className="mt-5"
//             alt="thumbnail"
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default GenerateThumbnail;

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { GenerateThumbnailProps } from "@/types/Index";
import { Loader } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";

import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const GenerateThumbnail = ({
  setImage,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const imageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    setIsImageLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: imagePrompt,
        }),
      });
      const data = await response.json();
      setImage(data.message.output_png);
      setIsImageLoading(false);
    } catch (error) {
      console.log(error);
      toast({ title: "Error generating thumbnail", variant: "destructive" });
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];

      const formData = new FormData();
      formData.append("file", file);

      setIsImageLoading(true);

      const response = await axios.post("/api/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      const publicId: string = response.data.publicId;

      setImage(
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`
      ); // Assuming the API returns the public ID
      toast({ title: "Image uploaded successfully", variant: "default" });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({ title: "Error uploading image", variant: "destructive" });
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiThumbnail(true)}
          className={cn("", {
            "bg-black-6": isAiThumbnail,
          })}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiThumbnail(false)}
          className={cn("", {
            "bg-black-6": !isAiThumbnail,
          })}
        >
          Upload custom image
        </Button>
      </div>
      {isAiThumbnail ? (
        <div className="flex flex-col gap-5">
          <div className="mt-5 flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate Thumbnail
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className="w-full max-w-[200px]">
            <Button
              type="button"
              className="text-16 bg-orange-1 py-4 font-bold text-white-1"
              onClick={generateImage}
            >
              {isImageLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => imageRef?.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image
              src="/icons/upload-image.svg"
              width={40}
              height={40}
              alt="upload"
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG, or GIF (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={200}
            height={200}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
