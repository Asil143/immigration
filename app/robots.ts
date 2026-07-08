import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          // Public preview-mode tool pages living under /dashboard/ — kept out
          // of the blanket disallow below so they stay indexable.
          "/dashboard/tools/checklists",
          "/dashboard/tools/opt-tracker",
          "/dashboard/timeline",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/_next/",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: "https://statusclock.com/sitemap.xml",
  };
}
