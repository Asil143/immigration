import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/guides(.*)",
  "/visa-comparison(.*)",
  "/glossary(.*)",
  "/events(.*)",
  "/lawyers(.*)",
  "/jobs(.*)",
  "/pricing(.*)",
  "/blog(.*)",
  "/success-stories(.*)",
  "/employer-lookup(.*)",
  "/visa-bulletin(.*)",
  "/preview(.*)",
  // Tools accessible without login
  "/ai-assistant(.*)",
  "/dashboard/tools/checklists(.*)",
  "/dashboard/tools/opt-tracker(.*)",
  "/dashboard/tools/timeline(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
