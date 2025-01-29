import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const queryResults = await prisma.podcast.findMany({
      where: {
        OR: [
          { podcastTitle: { contains: query, mode: "insensitive" } },
          { podcastDescription: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return NextResponse.json(queryResults);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
