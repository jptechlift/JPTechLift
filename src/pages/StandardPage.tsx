import HeaderWithBanner from "../components/home-page/HeaderWithBanner";
import InstallProcessSection from "../components/standard-page/InstallProcessSection";
import ProductSection from "../components/home-page/ProductSection";
import CommitSection from "../components/home-page/CommitSection";
import HeroFooter from "../components/Footer/HeroFooter";
import bannerImg from "../assets/images/Banner-img.png";
import Footer from "../components/Footer/Footer";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../components/SEO/constant";

const StandardPage = () => {
  return (
    <div>
      <Helmet>
        <title>Quy trình dự án - JP TechLift</title>
        <meta
          name="description"
          content="Khám phá quy trình triển khai dự án thang máy chuẩn mực của JP TechLift, được nhiều doanh nghiệp tin chọn."
        />
        <link rel="canonical" href={`${BASE_URL}/gioi-thieu/quy-trinh-du-an`} />
      </Helmet>
      <HeaderWithBanner banner={bannerImg} title="QUY TRÌNH DỰ ÁN" />
      <InstallProcessSection />
      <ProductSection />
      <CommitSection />
      <HeroFooter />
      <Footer />
    </div>
  );
};

export default StandardPage;
