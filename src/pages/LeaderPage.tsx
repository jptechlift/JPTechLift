import HeaderWithBanner from "../components/home-page/HeaderWithBanner";
import LeaderSection from "../components/leader-page/LeaderSection";
import HeroFooter from "../components/Footer/HeroFooter";
import bannerImg from "../assets/images/Banner-Leadership.png";
import Footer from "../components/Footer/Footer";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../components/SEO/constant";
import EngineerSection from "../components/leader-page/EngineererSection";

const LeaderPage = () => {
  return (
    <div>
      <Helmet>
        <title>Đội ngũ lãnh đạo - JP TechLift</title>
        <meta name="description" content="Khám phá đội ngũ lãnh đạo chuyên nghiệp giúp JP TechLift dẫn đầu xu hướng." />
        <link rel="canonical" href={`${BASE_URL}/gioi-thieu/ban-lanh-dao`} />
      </Helmet>
      <HeaderWithBanner banner={bannerImg} title="ĐỘI NGŨ LÃNH ĐẠO" />
      <LeaderSection />
      <EngineerSection />
      <HeroFooter />
      <Footer />
    </div>
  );
};

export default LeaderPage;
