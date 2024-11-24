"use client";
// import { Button } from "@/components/ui/button";
import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";
import React from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Home = () => {
  const trendingPodcast = useQuery(api.podcasts.getTrendingPodcasts);
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>

        <div className="podcast_grid">
          {trendingPodcast?.map(
            ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
              <PodcastCard
                key={_id}
                imgUrl={imageUrl}
                description={podcastDescription}
                title={podcastTitle}
                podcastId={_id}
              />
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
