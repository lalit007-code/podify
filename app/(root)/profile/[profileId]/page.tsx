// "use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import ProfileCard from "@/components/ProfileCard";
import { getUsersById } from "@/app/action/action";

const ProfilePage = async ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  // Fetching user and podcast data
  const userWithPodcastById = await getUsersById(params.profileId);

  // Handle loading state if data is not yet available
  if (
    userWithPodcastById === undefined ||
    userWithPodcastById?.podcasts === undefined
  )
    return <LoaderSpinner />;

  // Handle case when there are no podcasts available
  const hasPodcasts = userWithPodcastById.podcasts;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={userWithPodcastById.podcasts}
          imageUrl={userWithPodcastById?.imageURL as string}
          userFirstName={userWithPodcastById?.username}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {hasPodcasts ? (
          <div className="podcast_grid">
            {userWithPodcastById.podcasts.slice(0, 4).map((podcast) => (
              <PodcastCard
                key={podcast.id}
                imgUrl={podcast.thumbnailUrl}
                title={podcast.podcastTitle}
                description={podcast.podcastDescription!}
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
