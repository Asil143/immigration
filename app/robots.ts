import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/_next/",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: "https://visapilot.app/sitemap.xml",
  };
}
