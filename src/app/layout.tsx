import "@/styles/globals.css";
import { Oswald as FontSans, Lato as FontHeading } from "next/font/google";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site"



// import { ClerkProvider } from "@clerk/nextjs/app-beta";

interface RootLayoutProps {
  children?: ReactNode;
}

export const metadata = {
  title: "Create T3 Modernsssss",
  description: "Theo got bored again",
};


const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "500", "600", "700", ],
  display: "block",
});

const fontHeading = FontHeading({
  variable: "--font-heading",
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400"],
  display: "block",
});


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
  )
}
