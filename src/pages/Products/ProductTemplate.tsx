import { useParams } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { productData } from "../../data/ProductData";
import type { ProductId } from "../../data/ProductData";
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
<<<<<<< HEAD

=======
import NotFound from "../NotFound";
>>>>>>> bf999dd6c428540cda1922b0135929db97124862
// Kiểm tra productId hợp lệ
function isValidProductId(id: string): id is ProductId {
  return id in productData;
}

export default function ProductTemplatePage() {
  const { productId } = useParams();
  const [isAestheticsOpen, setAestheticsOpen] = useState(false);

  if (!productId || !isValidProductId(productId)) {
<<<<<<< HEAD
    return <p>Sản phẩm không tồn tại.</p>;
=======
    return <NotFound />;
>>>>>>> bf999dd6c428540cda1922b0135929db97124862
  }

  const product = productData[productId];

  return (
<<<<<<< HEAD
    <div style={{ backgroundColor: 'var(--color-gray1)'}}>
=======
    <div style={{ backgroundColor: "var(--color-gray1)" }}>
>>>>>>> bf999dd6c428540cda1922b0135929db97124862
      <Helmet>
        <title>{product.seo?.metaTitle}</title>
        <meta name="description" content={product.seo?.metaDescription || ""} />
        <meta name="keywords" content={product.seo?.keywords?.join(", ") || ""} />
<<<<<<< HEAD
        
=======

>>>>>>> bf999dd6c428540cda1922b0135929db97124862
        {/* ✅ Schema.org Breadcrumb cho SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
<<<<<<< HEAD
            "itemListElement": [
=======
            itemListElement: [
>>>>>>> bf999dd6c428540cda1922b0135929db97124862
              {
                "@type": "ListItem",
                position: 1,
                name: "Trang chủ",
<<<<<<< HEAD
                item: "https://thangmaysaigonjptechlift.com"
=======
                item: "https://thangmaysaigonjptechlift.com",
>>>>>>> bf999dd6c428540cda1922b0135929db97124862
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Sản phẩm",
<<<<<<< HEAD
                item: "https://thangmaysaigonjptechlift.com/products"
=======
                item: "https://thangmaysaigonjptechlift.com/san-pham",
>>>>>>> bf999dd6c428540cda1922b0135929db97124862
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.intro.title,
<<<<<<< HEAD
                item: `https://thangmaysaigonjptechlift.com/products/${productId}`
              }
            ]
=======
                item: `https://thangmaysaigonjptechlift.com/san-pham/${productId}`,
              },
            ],
>>>>>>> bf999dd6c428540cda1922b0135929db97124862
          })}
        </script>
      </Helmet>

      <NavBar />

      {/* ✅ HTML breadcrumb bị ẩn khỏi người dùng nhưng vẫn giúp Google hiểu */}
      <nav aria-label="breadcrumb" style={{ display: "none" }}>
        <ol>
<<<<<<< HEAD
          <li><a href="https://jptechlift.vn">Trang chủ</a></li>
          <li><a href="https://jptechlift.vn/products">Sản phẩm</a></li>
=======
          <li>
            <a href="https://jptechlift.vn">Trang chủ</a>
          </li>
          <li>
            <a href="https://jptechlift.vn/san-pham">Sản phẩm</a>
          </li>
>>>>>>> bf999dd6c428540cda1922b0135929db97124862
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
<<<<<<< HEAD
          <ContentTableSection
            data={product.contentTable}
            imageUrl="/assets/images/home-lift/hero.jpg"
          />
=======
          <ContentTableSection data={product.contentTable} imageUrl="/assets/images/home-lift/hero.jpg" />
>>>>>>> bf999dd6c428540cda1922b0135929db97124862
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
<<<<<<< HEAD
          <InstallationSection
            steps={product.installationSteps}
            image={product.installationImage}
          />
=======
          <InstallationSection steps={product.installationSteps} image={product.installationImage} />
>>>>>>> bf999dd6c428540cda1922b0135929db97124862
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

      <Footer />
    </div>
  );
}
