"use client";

import { ClerkProvider } from "@clerk/nextjs";

import { ReactNode } from "react";

const ConvexClerkProvider = ({ children }: { children: ReactNode }) => (
  <ClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    appearance={{
      layout: {
        socialButtonsVariant: "iconButton",
        logoImageUrl: "/icons/auth-logo.svg",
      },
      variables: {
        colorBackground: "#15171c",
        colorPrimary: "",
        colorText: "white",
        colorInputBackground: "#1b1f29",
        colorInputText: "white",
      },
    }}
  >
    {children}
  </ClerkProvider>
);

export default ConvexClerkProvider;
