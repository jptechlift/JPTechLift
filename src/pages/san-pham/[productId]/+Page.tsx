/* eslint-disable react-refresh/only-export-components */

import type { Product } from "../../../data/ProductData";
import { productData } from "../../../data/ProductData";

export default function Page({ product }: { product: Product }) {
  return (
    <main>
      <h1>{product.intro.title}</h1>
      <p>{product.intro.description}</p>
    </main>
  );
}

type PageContext = {
  routeParams: {
    productId: string;
  };
};


export async function onBeforeRender(pageContext: PageContext) {
  const { productId } = pageContext.routeParams;
  const product = productData[productId];
  if (!product) {
    return { pageContext: { notFound: true } };
  }

  return {
    pageContext: {
      pageProps: { product },
      documentProps: {
        title: product.seo.metaTitle,
        description: product.seo.metaDescription,
        keywords: product.seo.keywords,
      }
    }
  };
}
