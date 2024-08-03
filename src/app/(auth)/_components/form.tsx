"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";

import { useFormState } from "react-dom";
import { SubmitButton } from "../../_components/form/submit-button";
import { signin } from "@/app/_actions/auth/signin";

export function SignInForm() {
  const signInWithProvider = signin.bind(null, "resend");
  const [state, action] = useFormState(signInWithProvider, undefined);

  // console.log(state);
  return (
    <div className={cn("grid gap-6")}>
      <form action={action}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
            {state?.fieldErrors && (
              <p className="text-sm text-red-600">{state.fieldErrors.email}</p>
            )}
          </div>
          <SubmitButton label="Sign In with Email" />
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={void signin("google")}
      >
        <Icons.gmail className="mr-2 size-4" />
        Gmail
      </Button>
    </div>
  );
}
