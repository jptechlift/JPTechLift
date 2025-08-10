import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import NavBar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import ContentTableSection from "../../components/product-page/ContentTableSection";
import DetailSection from "../../components/product-page/DetailSection";
import DimensionSection from "../../components/product-page/DimensionSection";
import InstallationSection from "../../components/product-page/InstallationSection";
import BlueprintSection from "../../components/product-page/BlueprintSection";
import Introduction from "../../components/product-page/Introduction";
import RealGallerySection from "../../components/product-page/RealGallerySection";
import FadeInSection from "../../styles/components/common/FadeInSection";
import NotFound from "../NotFound";
import { productData } from "../../data/ProductData";
import type { ProductId, Audience } from "../../data/ProductData";
import { BASE_URL } from "../../components/SEO/constant";
import { getSeoMeta } from "../../utils/seo";

/**
 * Checks whether the provided id matches a key in productData.
 * @param id - Candidate product identifier from the URL.
 * @returns True if the id exists in productData.
 */

// Kiểm tra productId hợp lệ
function isValidProductId(id: string): id is ProductId {
  return id in productData;
}

/**
 * Product details page rendered according to the product id and optional audience.
 */

export default function ProductTemplatePage() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  if (!productId || !isValidProductId(productId)) {
    return <NotFound />;
  }

  const product = productData[productId];
  const audience = searchParams.get("audience") as Audience | null;
  const seo = getSeoMeta(product, audience);
  const content = (audience && product.contentVariants?.[audience]) || undefined;
  const canonical = `${BASE_URL}/san-pham/${productId}${location.search || ""}`;

  return (
    // Wrapper with neutral background color
    <div className="bg-[var(--color-gray1)]">
      <Helmet>
        <title>{seo?.metaTitle}</title>
        <meta name="description" content={seo?.metaDescription || ""} />
        {seo?.keywords && <meta name="keywords" content={seo.keywords.join(", ")} />}
        <link rel="canonical" href={canonical} />
      </Helmet>
      <Helmet>
        {/* ✅ Schema.org Breadcrumb cho SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Trang chủ",
                item: "https://thangmaysaigonjptechlift.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Sản phẩm",
                item: "https://thangmaysaigonjptechlift.com/san-pham",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.intro.title,
                item: `https://thangmaysaigonjptechlift.com/san-pham/${productId}`,
              },
            ],
          })}
        </script>
      </Helmet>

      <NavBar />

      {/* ✅ HTML breadcrumb bị ẩn khỏi người dùng nhưng vẫn giúp Google hiểu */}
      <nav aria-label="breadcrumb" className="hidden">
        <ol>
          <li>
            <a href="https://jptechlift.vn">Trang chủ</a>
          </li>
          <li>
            <a href="https://jptechlift.vn/san-pham">Sản phẩm</a>
          </li>
          <li aria-current="page">{product.intro.title}</li>
        </ol>
      </nav>

      <FadeInSection>
        <Introduction
          title={content?.title || product.intro.title}
          description={content?.description || product.intro.description}
          introduction={product.intro.introduction}
          imageUrl={product.intro.heroImage}
        />
      </FadeInSection>

      {product.contentTable && (
        <FadeInSection>
          <ContentTableSection data={product.contentTable} imageUrl="/assets/images/home-lift/hero.jpg" />
        </FadeInSection>
      )}

      {product.detailInfo && product.galleryImages && (
        <FadeInSection>
          <DetailSection data={product.detailInfo} images={product.galleryImages} />
        </FadeInSection>
      )}

      {product.dimensions && (
        <FadeInSection>
          <DimensionSection data={product.dimensions} />
        </FadeInSection>
      )}

      <FadeInSection>
        <RealGallerySection images={product.realGalleryImages ?? []} />
      </FadeInSection>

      {product.installationSteps && product.installationImage && (
        <FadeInSection>
          <InstallationSection steps={product.installationSteps} image={product.installationImage} />
        </FadeInSection>
      )}

      {product.blueprint && (
        <FadeInSection>
          <BlueprintSection blueprint={product.blueprint} />
        </FadeInSection>
      )}

      {/* {productId === "thang-may-gia-dinh" && (
        <FadeInSection>
          <HomeLiftSeoContent />
        </FadeInSection>
      )}

      {productId === "thang-may-benh-vien" && (
        <FadeInSection>
          <HospitalLiftSeoContent />
        </FadeInSection>
      )}

      {productId === "thang-tai-thuc-pham" && (
        <FadeInSection>
          <FoodLiftSeoContent />
        </FadeInSection>
      )}

      {productId === "thang-may-tai-hang" && (
        <FadeInSection>
          <FreightLiftSeoContent />
        </FadeInSection>
      )}

      {productId === "thang-truot-thang-cuon" && (
        <FadeInSection>
          <EscalatorSeoContent />
        </FadeInSection>
      )}

      {productId === "thang-may-quan-sat" && (
        <FadeInSection>
          <ObservationLiftSeoContent />
        </FadeInSection>
      )} */}
      <Footer />
    </div>
  );
}
