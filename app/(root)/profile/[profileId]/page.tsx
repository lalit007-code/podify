"use client";

import { useQuery } from "convex/react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/convex/_generated/api";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  // Fetching user and podcast data
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const podcastsData = useQuery(api.podcasts.getTrendingPodcasts);

  // Handle loading state if data is not yet available
  if (user === undefined || podcastsData === undefined)
    return <LoaderSpinner />;

  // Handle case when there are no podcasts available
  const hasPodcasts = podcastsData;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData}
          imageUrl={user?.imageUrl}
          userFirstName={user?.name}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {hasPodcasts ? (
          <div className="podcast_grid">
            {podcastsData.slice(0, 4).map((podcast) => (
              <PodcastCard
                key={podcast.id}
                imgUrl={podcast.imageUrl}
                title={podcast.podcastTitle}
                description={podcast.podcastDescription}
                podcastId={podcast.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
