import type { Audience, Product, MetaData } from "../data/ProductData";

export function getSeoMeta(
  product: Product,
  audience?: Audience | null
): MetaData | undefined {
  if (audience && product.seoVariants && product.seoVariants[audience]) {
    return product.seoVariants[audience];
  }
  console.log("[SEO]", product.seo.metaDescription);
  return product.seo;
}