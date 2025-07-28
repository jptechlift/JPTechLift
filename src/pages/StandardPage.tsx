import HeaderWithBanner from "../components/HomePage/HeaderWithBanner";
import InstallProcessSection from "../components/StandardPage/InstallProcessSection";
import ProductSection from "../components/HomePage/ProductSection";
import CommitSection from "../components/HomePage/CommitSection";
import HeroFooter from "../components/Footer/HeroFooter";
import bannerImg from "../assets/images/Banner-img.png";
import Footer from "../components/Footer/Footer";
import SEO from "../components/SEO";

const StandardPage = () => {
  return (
    <div>
      <SEO
        title="Quy trình dự án JP TechLift"
        description="Tìm hiểu quy trình triển khai dự án thang máy chuyên nghiệp của JP TechLift."
        path="/gioi-thieu/quy-trinh-du-an"
      />
      <HeaderWithBanner banner={bannerImg} title="QUY TRÌNH DỰ ÁN"/>
      <InstallProcessSection />
      <ProductSection />
      <CommitSection />
      <HeroFooter />
      <Footer />
    </div>
  );
};

export default StandardPage;