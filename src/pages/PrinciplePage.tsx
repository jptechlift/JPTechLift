import HeaderWithBanner from "../components/home-page/HeaderWithBanner";
import PrincipleSection from "../components/principle-page/PrincipleSection";
import HeroFooter from "../components/footer/HeroFooter";
import bannerImg from "../assets/images/Banner-Principle.jpg";
import Footer from "../components/footer/Footer";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../components/SEO/constant";

const PrinciplePage = () => {
  return (
    <div>
      <Helmet>
        <title>Nguyên tắc hoạt động - JP TechLift</title>
        <meta
          name="description"
          content="Tìm hiểu nguyên tắc và giá trị cốt lõi giúp JP TechLift được nhiều khách hàng tin cậy."
        />
        <link rel="canonical" href={`${BASE_URL}/gioi-thieu/nguyen-tac`} />
      </Helmet>
      <HeaderWithBanner banner={bannerImg} title="NGUYÊN TẮC CỦA JPTECHLIFT" />
      <PrincipleSection />
      <HeroFooter />
      <Footer />
    </div>
  );
};

export default PrinciplePage;
