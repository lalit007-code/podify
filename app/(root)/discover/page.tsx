"use client";

import { getPodcast } from "@/app/action/action";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import { Podcast } from "@/components/RightSideBar";
import Searchbar from "@/components/SearchBar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React, { useEffect, useState } from "react";

const Discover = ({
  searchParams: { search },
}: {
  searchParams: { search: string };
}) => {
  const [podcastData, setPodcastData] = useState<Podcast[]>([]);
  useEffect(() => {
    const fetechData = async () => {
      try {
        const data: Podcast[] = await getPodcast();
        setPodcastData(data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetechData();
  }, []);

  return (
    <div className="flex flex-col gap-9">
      {/* <Searchbar /> */}
      <div className="flex flex-col gap-9 mt-10">
        {/* <h1 className="text-20 font-bold text-white-1">
          {!search ? "Discover Trending Podcasts" : "Search results for "}
          {search && <span className="text-white-2">{search}</span>}
        </h1> */}
        {podcastData ? (
          <>
            {podcastData.length > 0 ? (
              <div className="podcast_grid">
                {podcastData?.map((podcast) => (
                  <PodcastCard
                    key={podcast.id}
                    imgUrl={podcast.thumbnailUrl!}
                    title={podcast.podcastTitle!}
                    description={podcast.podcastDescription!}
                    podcastId={podcast.id!}
                  />
                ))}
              </div>
            ) : (
              <LoaderSpinner />
            )}
            {/* // ) : (
            //   <EmptyState title="No results found" />
            // )} */}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default Discover;
