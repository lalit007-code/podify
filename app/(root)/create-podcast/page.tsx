"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Loader } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import GenerateAudio from "@/components/GenerateAudio";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
});

const CreatePodcast = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [imagePrompt, setImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [audioUrl, setAudioUrl] = useState("");
  const [voicePrompt, setVoicePrompt] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });
  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, []);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      if (!audioUrl || !imageUrl) {
        toast({
          title: "Please generate audio and image",
        });
        throw new Error("Please generate audio and image");
      }
      const requestData = {
        ...data,
        emailAddress: user?.primaryEmailAddress?.emailAddress,
        fullName: user?.fullName,
        userImageUrl: user?.imageUrl,

        voicePrompt,
        audioUrl,
        selectedCountry,
        selectedGender,
        selectedLanguage,

        imageUrl,
        imagePrompt,
      };
      const createPodcast = await axios.post(
        "/api/create-podcast",
        requestData
      );
      toast({ title: "podcast created" });
      setIsSubmitting(false);
      router.push(`/podcasts/${createPodcast.data.podcastId}`);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occured while creating podcasts",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">create Podcasts</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col"
        >
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Podcast title"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Write a short podcast description"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col pt-10">
            <GenerateAudio
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              audioUrl={audioUrl}
              setAudioUrl={setAudioUrl}
            />
            <GenerateThumbnail
              setImage={setImageUrl}
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            />
            <div className="mt-10 w-full">
              <Button
                type="submit"
                className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
              >
                {isSubmitting ? (
                  <>
                    Submitting...
                    <Loader className="animate-spin ml-2" size={20} />
                  </>
                ) : (
                  "Submit & Publish Podcast"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcast;
