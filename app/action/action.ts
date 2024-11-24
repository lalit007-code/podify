"use server";

import prisma from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

// Server action to fetch podcast and user by podcast ID
export async function getPodcastWithUserById(id: string) {
  const podcast = await prisma.podcast.findUnique({
    where: {
      id,
    },
    include: {
      // Include the user associated with the podcast based on the authorId
      author: true, // Assuming 'author' is the relation field in the 'podcast' model
    },
  });

  if (!podcast) {
    throw new Error("Podcast not found");
  }

  // The podcast includes the user data as 'author' based on the relation
  const user = podcast.author; // Access the user data from the podcast

  return { podcast, user }; // Return both podcast and user
}

export async function deletePodcastById(podcastId: string) {
  const { userId, redirectToSignIn } = await auth();
  const user = await currentUser();
  console.log("server side user id", userId);
  if (!userId) {
    return redirectToSignIn();
  }

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userExist = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!userExist) {
    return new Error("User not exist");
  }

  const podcastExist = await prisma.podcast.findUnique({
    where: {
      id: podcastId,
    },
  });
  if (!podcastExist) {
    return new Error("podcast not Exist");
  }
  if (podcastExist.authorId != userExist.id) {
    return new Error("Only owner can delte their podcast");
  }
  await prisma.podcast.delete({
    where: {
      id: podcastExist.id,
    },
  });
}

export async function getPodcast() {
  const podcast = await prisma.podcast.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
  return podcast;
}
