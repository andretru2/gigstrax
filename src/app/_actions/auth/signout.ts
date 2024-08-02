"use server";

import { signOut } from "auth";
import type { Response } from "@/types/index";
// import { headers } from "next/headers";

// const headersList = headers();
// const hostname = headersList.get("x-forwarded-host");
// const redirect = `${hostname}/signin`;

export async function signout(): Promise<Response> {
  // console.log("yes", redirect);
  // await signOut({ redirectTo: redirect });
  // await signOut({ redirectTo: `${hostname}/signin` });
  await signOut({ redirectTo: "http://localhost:3000/signin" });
  // await signOut({ redirectTo: ""https://gigstrax.vercel.app/signin" });

  return {
    result: "SUCCESS",
    description: "Logged out",
  };
}
