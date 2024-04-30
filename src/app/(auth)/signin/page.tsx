import { type Metadata } from "next";
import SignIn from "@/components/auth";
import { Icons } from "@/components/icons";

export const metadata: Metadata = {
  title: "Real Beard Santas Login ",
  description: "Login to your account",
};

export default function Page() {
  return (
    <main className="flex h-svh flex-col   items-center justify-center gap-10 bg-gray-50 bg-gradient-to-br from-primary to-primary/90 font-sans">
      <Icons.logo className="h-44 w-44 text-white" />
      <h1 className="line-clamp-3 max-w-md font-heading text-5xl font-light leading-[1.2]">
        Real Beard Santas
      </h1>

      <SignIn />
    </main>
  );
}
