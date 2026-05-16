import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yttoolkit.com'; // Replace with actual domain
  const tools = [
    '',
    '/youtube-thumbnail-downloader',
    '/youtube-tags-extractor',
    '/youtube-metadata-extractor',
    '/youtube-banner-downloader',
    '/youtube-logo-downloader',
    '/youtube-hashtag-extractor',
  ];

  return tools.map((tool) => ({
    url: `${baseUrl}${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: tool === '' ? 1 : 0.8,
  }));
}
