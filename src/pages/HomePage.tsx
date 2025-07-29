import AboutSection from "../components/HomePage/AboutSection";
import CommitSection from "../components/HomePage/CommitSection";
import HeroFooter from "../components/Footer/HeroFooter";
import ProductSection from "../components/HomePage/ProductSection";
import ServiceSection from "../components/HomePage/ServiceSection";
import HeroBanner from "../components/HomePage/HeroBanner";
import Footer from "../components/Footer/Footer";
import SubBanner from "../components/HomePage/SubBanner";
import SEO from "../components/SEO";
// import HomePageSeoContent from "../components/SEO/HomePageSeoContent";

const HomePage = () => {
  return (
    <div>
      <SEO
        title="JP TechLift - Thang máy chuyên nghiệp"
        description="Công ty thang máy JP TechLift cung cấp giải pháp thang máy an toàn, chất lượng tại Việt Nam."
        path="/"
      />
      <HeroBanner />
      <AboutSection />
      <SubBanner />
      <ProductSection />
      <ServiceSection />
      <CommitSection />
      {/* <HomePageSeoContent /> */}
      <HeroFooter />
      <Footer />
    </div>
  );
};

export default HomePage;