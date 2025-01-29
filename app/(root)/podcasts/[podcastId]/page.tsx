"use client";

import { getPodcastWithUserById } from "@/app/action/action";

import LoaderSpinner from "@/components/LoaderSpinner";

import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import { useUser } from "@clerk/nextjs";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const PodcastDetails = ({
  params: { podcastId },
}: {
  params: { podcastId: string }; // podcastId is a string now
}) => {
  const { user } = useUser();
  const [podcast, setPodcast] = useState<any>(null); // Update to use the correct type
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [author, setAuthor] = useState<any>(null);

  // Fetch podcast data
  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        setLoading(true); // Set loading to true at the start of fetching
        const data = await getPodcastWithUserById(podcastId); // Fetch podcast data

        setPodcast(data.podcast); // Update state with fetched data

        setAuthor(data.user);
        
        setLoading(false);
      } catch (err) {
        setError("Error fetching podcast data");
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchPodcast(); // Fetch data when component mounts
  }, [podcastId]); // Re-fetch if podcastId changes

  if (loading) return <LoaderSpinner />;
  if (error) return <div>{error}</div>;

  const isOwner = user?.primaryEmailAddress?.emailAddress == author?.email;

  // Render podcast details
  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">{0}</h2>
        </figure>
      </header>
      {/* <PodcastDetailPlayer
        isOwner={isOwner}
        podcastId={podcast._id}
        {...podcast}
      /> */}

      {/* Render PodcastPlayer */}
      <PodcastDetailPlayer
        audioUrl={podcast.audioURL}
        podcastTitle={podcast.podcastTitle}
        author={author?.username}
        imageUrl={podcast?.thumbnailUrl}
        podcastId={podcast.id}
        isOwner={isOwner}
        authorImageUrl={author?.imageURL}
        authorId={author?.id}
      />

      {/* Render Podcast Description */}
      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
        {podcast?.podcastDescription}
      </p>

      <div className="flex flex-col gap-8">
        {/* Render Transcription */}
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">
            {podcast?.voicePrompt}
          </p>
        </div>

        {/* Render Thumbnail Prompt */}
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
          {podcast?.thumbnailPrompt ? (
            <p className="text-16 font-medium text-white-2">
              {podcast.thumbnailPrompt}
            </p>
          ) : (
            <p className="text-16 font-medium text-white-2">
              The author did not use AI to generate a thumbnail for this
              podcast.
            </p>
          )}
        </div>
      </div>

      {/* Render Similar Podcasts Section */}
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>

        {/* Similar podcasts logic can be added here */}
        {/* Example: */}
        {/* {similarPodcasts?.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
              <PodcastCard
                key={_id}
                imgUrl={imageUrl}
                title={podcastTitle}
                description={podcastDescription}
                podcastId={_id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No similar podcasts found"
            buttonLink="/discover"
            buttonText="Discover more podcasts"
          />
        )} */}
      </section>
    </section>
  );
};

export default PodcastDetails;
