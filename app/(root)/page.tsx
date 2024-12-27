"use client";
// import { Button } from "@/components/ui/button";
import PodcastCard from "@/components/PodcastCard";

import React, { useEffect, useState } from "react";

import { getPodcast } from "../action/action";
import { useToast } from "@/hooks/use-toast";
import LoaderSpinner from "@/components/LoaderSpinner";

const Home = () => {
  const [podcastsData, setPodcastsData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        setLoading(true); // Set loading to true at the start of fetching
        const data = await getPodcast(); // Fetch podcast data

        setPodcastsData(data); // Update state with fetched data
        toast({
          title: "Fetch latest podcasts",
        });

        setLoading(false);
      } catch (err) {
        toast({
          title: "Error fetching data please refresh the page",
          variant: "destructive",
        });
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchPodcast(); // Fetch data when component mounts
  }, []); // Re-fetch if podcastId changes

  if (loading) return <LoaderSpinner />;
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>

        <div className="podcast_grid">
          {podcastsData?.map(
            ({ id, podcastTitle, podcastDescription, thumbnailUrl }) => (
              <PodcastCard
                key={id}
                imgUrl={thumbnailUrl}
                description={podcastDescription}
                title={podcastTitle}
                podcastId={id}
              />
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
