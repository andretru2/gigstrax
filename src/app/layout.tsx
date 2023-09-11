import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { fontSans, fontHeading } from "@/lib/fonts";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
// import { ClerkProvider } from "@clerk/nextjs";
import SessionProvider from "@/components/session-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

interface RootLayoutProps {
  children?: ReactNode;
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SessionProvider session={session}>
            {children}
            {/* <ClerkProvider></ClerkProvider> */}
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
