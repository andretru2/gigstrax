import { type Metadata } from "next";
import SignIn from "@/components/auth";

export const metadata: Metadata = {
  title: "Real Beard Santas Login ",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <main className="relative h-screen overscroll-y-none bg-gray-50 font-sans">
      <div className="flex flex-row ">
        <div className="relative flex max-w-[50%] flex-1 flex-col justify-center gap-10 bg-gradient-to-br from-primary to-primary/90 pl-20  ">
          <h1 className=" line-clamp-3  max-w-md font-heading text-5xl font-bold leading-[1.2] text-background">
            Real Beard Santas
          </h1>
        </div>
        <div className="flex h-screen max-w-[50%] flex-1 flex-col  items-center justify-center ">
          <div className="flex w-72 flex-col items-center justify-center">
            <h2 className="mb-4 text-2xl font-bold">Welcome Back!</h2>
            <h3 className="text-md mb-12">Please login to your account</h3>
            <SignIn />
          </div>
        </div>
      </div>
    </main>
  );
}
