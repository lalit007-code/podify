import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("body", body);

    // Destructure the query from the request body
    const { query } = body;

    // Validate the query parameter
    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Set up Axios request options with static values
    const options = {
      method: "POST",
      url: "https://ai-image-generator14.p.rapidapi.com/",
      headers: {
        "x-rapidapi-key": process.env.API_KEY, // Use environment variable
        "x-rapidapi-host": "ai-image-generator14.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        jsonBody: {
          function_name: "image_generator", // Static value
          type: "image_generation", // Static value
          query: query, // Dynamic value from request
          output_type: "png", // Static value
        },
      },
    };

    // Make the API call
    const response = await axios.request(options);

    // Return the response data
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching image data:", error);
    return NextResponse.json(
      { error: "Failed to fetch image data" },
      { status: 500 }
    );
  }
}
