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
  "/pricing(.*)",
  "/blog(.*)",
  "/success-stories(.*)",
  "/employer-lookup(.*)",
  "/visa-bulletin(.*)",
  "/preview(.*)",
  "/privacy(.*)",
  "/terms(.*)",
  "/about(.*)",
  "/contact(.*)",
  "/faq(.*)",
  // Tools & dashboard accessible without login (preview mode)
  "/ai-assistant(.*)",
  "/rfe-assistant(.*)",
  "/dashboard(.*)",
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
