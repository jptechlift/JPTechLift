import { Helmet } from "react-helmet-async";
import { BASE_URL } from "./SEO/constant";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string; // Relative path or full URL
}

export default function SEO({
  title,
  description,
  keywords = [],
  image = "/og-default.jpg",
  url = "",
}: SEOProps) {
  const canonical = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  const keywordsContent = keywords.length > 0 ? keywords.join(", ") : undefined;

  return (
    <Helmet>
      {/* Page title */}
      <title>{title}</title>

      {/* Standard SEO meta */}
      <meta name="description" content={description} />
      {keywordsContent && <meta name="keywords" content={keywordsContent} />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph (Facebook) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
