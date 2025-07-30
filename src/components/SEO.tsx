import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  path?: string;
}

export const BASE_URL =
  import.meta.env.VITE_SITE_URL || "https://thangmaysaigonjptechlift.com";

export default function SEO({ title, description, keywords, path }: SEOProps) {
  const url = path ? `${BASE_URL}${path}` : BASE_URL;
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
