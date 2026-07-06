import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://feedbackhub.example.com", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://feedbackhub.example.com/feedback", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://feedbackhub.example.com/admin", lastModified: new Date(), changeFrequency: "weekly", priority: 0.3 },
  ];
}
