import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Define Zod schema for validation
const podcastSchema = z.object({
  podcastTitle: z
    .string()
    .min(2, "Podcast title must have at least 2 characters"),
  podcastDescription: z
    .string()
    .min(2, "Podcast description must have at least 2 characters"),
  emailAddress: z.string().email("Invalid email address"),
  fullName: z.string().optional(),
  userImageUrl: z.string().url().optional(),
  voicePrompt: z.string().optional(),
  audioUrl: z.string().url("Invalid audio URL"),
  selectedCountry: z.string().optional(),
  selectedGender: z.string(),
  selectedLanguage: z.string(),
  imageUrl: z.string().url("Invalid image URL"),
  imagePrompt: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();

    // Validate the request body against the Zod schema
    const data = podcastSchema.parse(body);

    // Destructure validated data
    const {
      podcastTitle,
      podcastDescription,
      emailAddress,
      fullName,
      userImageUrl,
      voicePrompt,
      audioUrl,
      selectedCountry,
      selectedGender,
      selectedLanguage,
      imageUrl,
      imagePrompt,
    } = data;

    const gender = selectedGender.toLowerCase(); // 'Male' becomes 'male', 'Female' becomes 'female'

    // Check if the user exists in the database
    let user = await prisma.user.findUnique({
      where: { email: emailAddress },
    });

    // If the user does not exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: emailAddress,
          username: fullName || "Anonymous",
          clerId: emailAddress, // Use email as clerkId if not provided
          imageURL: userImageUrl || null,
        },
      });
    }

    // Create a new podcast and associate it with the user
    const podcast = await prisma.podcast.create({
      data: {
        podcastTitle,
        podcastDescription,
        audioURL: audioUrl,
        thumbnailUrl: imageUrl,
        thumbnailPrompt: imagePrompt || null,
        voicePrompt: voicePrompt || null,
        voiceLanguage: selectedLanguage,
        voiceGender: gender,
        voiceCountry: selectedCountry || null,
        author: {
          connect: { id: user.id },
        },
      },
    });

    // Return the created podcast ID as a response
    return NextResponse.json({
      success: true,
      message: "Podcast created successfully",
      podcastId: podcast.id,
    });
  } catch (error) {
    console.error("Error creating podcast:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
