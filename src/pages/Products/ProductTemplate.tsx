import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { productData } from "../../data/ProductData";
import type { ProductId, Audience } from "../../data/ProductData";
import ContentTableSection from "../../components/ProductPage/ContentTableSection";
import DetailSection from "../../components/ProductPage/DetailSection";
import DimensionSection from "../../components/ProductPage/DimensionSection";
import InstallationSection from "../../components/ProductPage/InstallationSection";
import BlueprintSection from "../../components/ProductPage/BlueprintSection";
import AestheticsModal from "../../components/ProductPage/AestheticsModal";
import Introduction from "../../components/ProductPage/Introduction";
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import RealGallerySection from "../../components/ProductPage/RealGallerySection";
import FadeInSection from "../../styles/components/common/FadeInSection";
import NotFound from "../NotFound";
import HomeLiftSeoContent from "../../components/SEO/HomeLiftSeoContent";
// Kiểm tra productId hợp lệ
function isValidProductId(id: string): id is ProductId {
  return id in productData;
}

export default function ProductTemplatePage() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const [isAestheticsOpen, setAestheticsOpen] = useState(false);

  if (!productId || !isValidProductId(productId)) {
    return <NotFound />;
  }

  const product = productData[productId];
  const audience = searchParams.get("audience") as Audience | null;
  const seo = (audience && product.seoVariants?.[audience]) || product.seo;

  return (
    <div style={{ backgroundColor: "var(--color-gray1)" }}>
      <Helmet>
        <title>{seo?.metaTitle}</title>
        <meta name="description" content={seo?.metaDescription || ""} />
        <meta name="keywords" content={seo?.keywords?.join(", ") || ""} />

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
      <nav aria-label="breadcrumb" style={{ display: "none" }}>
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
          title={product.intro.title}
          description={product.intro.description}
          introduction={product.intro.introduction}
          imageUrl={product.intro.heroImage}
        />
      </FadeInSection>

      {product.contentTable && (
        <FadeInSection>
          <ContentTableSection
            data={product.contentTable}
            imageUrl="/assets/images/home-lift/hero.jpg"
          />
        </FadeInSection>
      )}

      {product.detailInfo && product.galleryImages && (
        <FadeInSection>
          <DetailSection
            data={product.detailInfo}
            images={product.galleryImages}
            onOpenAesthetics={() => setAestheticsOpen(true)}
          />
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
          <InstallationSection
            steps={product.installationSteps}
            image={product.installationImage}
          />
        </FadeInSection>
      )}

      {product.blueprint && (
        <FadeInSection>
          <BlueprintSection blueprint={product.blueprint} />
        </FadeInSection>
      )}

      {/* Modal thẩm mỹ cabin */}
      {product.aestheticsOptions && (
        <AestheticsModal
          data={product.aestheticsOptions}
          open={isAestheticsOpen}
          onClose={() => setAestheticsOpen(false)}
        />
      )}

      {productId === "thang-may-gia-dinh" && (
        <FadeInSection>
          <HomeLiftSeoContent />
        </FadeInSection>
      )}
      <Footer />
    </div>
  );
}
