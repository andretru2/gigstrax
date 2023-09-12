"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { useTransition } from "react";

// import { login } from "@/app/_actions/login";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex max-w-xs flex-col items-center justify-center gap-0 ">
      <Button
        type="button"
        variant="default"
        size="lg"
        isLoading={isPending}
        onClick={() => {
          // setIsLoading(true);

          void signIn("google", {
            callbackUrl: `http://${
              process.env.NEXT_PUBLIC_APP_URL || "localhost:3000"
            }/dashboard`,
            // callbackUrl: "http://localhost:3000/dashboard",
          });
          // await login();
          // setIsLoading(false);
        }}
        className=" align-center flex w-full flex-row items-center gap-1"
      >
        Sign In
        <Icons.logIn className="h-5 w-5" />
      </Button>
      <svg
        className="mt-2 w-full"
        // width="242"
        // height="10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="143" cy="5" rx="143" ry="5" fill="#E4E7F9" />
      </svg>
    </div>
  );
}
