import { type NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log(pathname, "x");
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}
