/* eslint-disable react-refresh/only-export-components */

import { productData } from "../../data/ProductData";

export default function Page() {
  return (
    <main>
      <h1>Sản phẩm</h1>
      <ul>
        {Object.entries(productData).map(([slug, product]) => (
          <li key={slug}>
            <a href={`/san-pham/${slug}`}>{product.intro.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}

export const documentProps = {
  title: "Sản phẩm - JP TechLift",
  description: "Danh sách các dòng thang máy JP TechLift cung cấp.",
  keywords: ["JP TechLift", "san pham", "thang may"],
};