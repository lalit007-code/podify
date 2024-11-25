"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Carousel from "./Carousel";

import { useRouter } from "next/navigation";

import { useAudio } from "@/providers/AudioProvider";
import { cn } from "@/lib/utils";
import { getPodcast, getTopPodcasters } from "@/app/action/action";

interface User {
  id: string;
  username: string;
  email: string;

  imageURL: string | null;
  _count: {
    podcasts: number;
  };
}
export interface Podcast {
  id: string;
  audioURL: string | null;
  authorId: string | null;
  createdAt: Date;
  updatedAt: Date;
  podcastDescription: string | null; // Adjusted to allow null
  podcastTitle: string | null;
  thumbnailPrompt: string | null; // Adjusted to allow null
  thumbnailUrl: string | null;
  voiceCountry: string | null;
  voiceGender: string | null;
  voiceLanguage: string | null;
  voiceModel: string | null; // Already nullable
}

const RightSidebar = () => {
  const { user } = useUser();
  // const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);
  const [topPodcasters, setTopPodcasters] = useState<User[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const router = useRouter();

  // console.log("podcasts", podcasts);
  const { audio } = useAudio();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: User[] = await getTopPodcasters(); // Fetch data
        const data2: Podcast[] = await getPodcast();
        setTopPodcasters(data);
        setPodcasts(data2);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section
      className={cn("right_sidebar h-[calc(100vh-5px)]", {
        "h-[calc(100vh-140px)]": audio?.audioUrl,
      })}
    >
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user?.firstName} {user?.lastName}
            </h1>
            <Image
              src="/icons/right-arrow.svg"
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
        </Link>
      </SignedIn>
      <section>
        <Header headerTitle="Fans Like You" />
        <Carousel podcast={podcasts} />
      </section>
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Podcastrs" />
        <div className="flex flex-col gap-6">
          {topPodcasters?.slice(0, 3).map((podcaster) => (
            <div
              key={podcaster.id}
              className="flex cursor-pointer justify-between"
              onClick={() => router.push(`/profile/${podcaster.id}`)}
            >
              <figure className="flex items-center gap-2">
                <Image
                  src={podcaster.imageURL!}
                  alt={podcaster.username}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 font-semibold text-white-1">
                  {podcaster.username}
                </h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 font-normal text-white-1">
                  {podcaster._count.podcasts}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default RightSidebar;
