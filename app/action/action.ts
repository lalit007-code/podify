// app/podcasts/[id]/page.tsx

"use server";

import prisma from "@/lib/db";

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
