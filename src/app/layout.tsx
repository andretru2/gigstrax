import "@/styles/globals.css";
// import { Oswald as FontSans, Lato as FontHeading } from "next/font/google";
import { cn } from "@/lib/utils";
import { fontSans, fontHeading } from "@/lib/fonts";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

// import { ClerkProvider } from "@clerk/nextjs/app-beta";

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

export default function RootLayout({ children }: RootLayoutProps) {
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
