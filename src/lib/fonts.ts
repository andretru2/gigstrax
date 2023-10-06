// import { Lato as FontSans, Oswald as FontHeading } from "next/font/google";
import { Lato as FontSans, Oswald as FontHeading } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  style: ["normal"],
  weight: ["400", "700"],
  display: "block",
});

export const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
});
