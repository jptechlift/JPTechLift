import type { Audience, Product, MetaData } from "../data/productData";

export function getSeoMeta(product: Product, audience?: Audience | null): MetaData | undefined {
  if (audience && product.seoVariants && product.seoVariants[audience]) {
    return product.seoVariants[audience];
  }
  return product.seo;
}
