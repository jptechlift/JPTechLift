import AboutSection from "../components/home-page/AboutSection";
import CommitSection from "../components/home-page/CommitSection";
import HeroFooter from "../components/footer/HeroFooter";
import ProductSection from "../components/home-page/ProductSection";
import ServiceSection from "../components/home-page/ServiceSection";
import HeroBanner from "../components/home-page/HeroBanner";
import Footer from "../components/footer/Footer";
import SubBanner from "../components/home-page/SubBanner";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../components/SEO/constant";
// import HomePageSeoContent from "../components/SEO/HomePageSeoContent";

const HomePage = () => {
  return (
    <div>
      <Helmet>
        <title>
          Công ty TNHH JP Techlift - Chuyên cung cấp lắp đặt các dòng thang máy
          gia đình, dân dụng, nhà hàng, khách sạn, doanh nghiệp và bệnh viện.
        </title>
        <meta
          name="description"
          content="JP TechLift – Chuyên thang máy cao cấp cho nhà ở & doanh nghiệp. Cung cấp & lắp đặt thang máy gia đình, nhà hàng, khách sạn, bệnh viện. Bảo hành dài hạn – Tư vấn miễn phí – Giao lắp toàn quốc."
        />
        <link rel="canonical" href={`${BASE_URL}/`} />
      </Helmet>
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
