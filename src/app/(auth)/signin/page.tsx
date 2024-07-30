import { type Metadata } from "next";
// import SignIn from "@/components/auth";
import { Icons } from "@/components/icons";
import { SignInForm } from "../_components/form";
import Link from "next/link";
import { auth } from "auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Real Beard Santas Login ",
  description: "Login to your account",
};

export default async function Page() {
  const session = await auth();
  console.log(session);
  if (session) redirect("/dashboard/gigs");

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto size-24" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <SignInForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
  // return (
  //   <div className="container flex h-svh flex-col   items-center justify-center gap-10 bg-gray-50 bg-gradient-to-br from-primary to-primary/90 font-sans">
  //     <Icons.logo className="h-44 w-44 text-white" />
  //     <h1 className="font-h eading line-clamp-3 max-w-md text-5xl font-light leading-[1.2]">
  //       Real Beard Santas
  //     </h1>

  //     <SignIn />
  //   </div>
  // );
}

// import Link from "next/link";

// import { cn } from "@/lib/utils";
// import { buttonVariants } from "@/components/ui/button";
// import { UserAuthForm } from "@/components/user-auth-form";

// export const metadata: Metadata = {
//   title: "Login",
//   description: "Login to your account",
// };

// export default function Page() {
//   return (
//     <div className="container flex h-screen w-screen flex-col items-center justify-center">

//       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//         <div className="flex flex-col space-y-2 text-center">
//           <Icons.logo className="mx-auto h-6 w-6" />
//           <h1 className="text-2xl font-semibold tracking-tight">
//             Welcome back
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             Enter your email to sign in to your account
//           </p>
//         </div>
//         <UserAuthForm />
//         <p className="px-8 text-center text-sm text-muted-foreground">
//           <Link
//             href="/register"
//             className="hover:text-brand underline underline-offset-4"
//           >
//             Don&apos;t have an account? Sign Up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
