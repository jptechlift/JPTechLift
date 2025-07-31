import { Helmet } from "react-helmet-async";
import { BASE_URL } from "./SEO/constant";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
}: SEOProps) {
  const canonical = url
    ? url.startsWith("http")
      ? url
      : `${BASE_URL}${url}`
    : BASE_URL;
  const ogImage = image || "/og-default.jpg";
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
  