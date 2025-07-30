import { Helmet } from "react-helmet-async";
import { BASE_URL } from "./SEO/constant";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  path?: string;
}


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
  