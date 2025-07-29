import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  path?: string;
}

const BASE_URL = "https://thangmaysaigonjptechlift.com";

export default function SEO({ title, description, keywords, path }: SEOProps) {
  const url = path ? `${BASE_URL}${path}` : BASE_URL;
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
