import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// UI-first development mode: all routes are accessible without auth.
// When wiring real Clerk auth, replace this with clerkMiddleware + auth.protect().
export function proxy(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
