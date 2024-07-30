"use server";

import { signIn, signOut } from "auth";
import type { Response } from "@/types/index";
import { headers } from "next/headers";

const headersList = headers();
const hostname = headersList.get("x-forwarded-host");
const redirectTo = `${hostname}/dashboard/gigs`;

console.log(hostname);

export async function signin(
  provider: "google" | "resend",
  formState?: Response | undefined,
  formData?: FormData,
): Promise<Response> {
  if (!formData && provider === "resend")
    return {
      result: "ERROR",
      description: "Please enter a valid email",
    };

  /*
    2024-07-30 (Andres Trujillo)
    Warning: 
    Do not put this in a try/catch. 
    It casues a redirect problem  https://github.com/nextauthjs/next-auth/discussions/9389#discussioncomment-9034716
    Perhaps in the future this can be fixed 
    */

  if (provider === "resend") {
    await signIn(provider, formData, {
      // redirectTo: "https://gigstrax.vercel.app/dashboard/gigs",
      // redirectTo: "http://localhost:3000/dashboard/gigs",
      redirectTo: redirectTo,
    });

    return {
      result: "SUCCESS",
      description: "Logged in with Resend",
    };
  }

  await signIn(provider, {
    // callbackUrl: "https://gigstrax.vercel.app/dashboard/gigs",
    // redirectTo: `${hostname}/dashboard/gigs`,
    redirectTo: redirectTo,
    // redirectTo: "http://localhost:3000/dashboard/gigs",
  });

  return {
    result: "SUCCESS",
  };
}
