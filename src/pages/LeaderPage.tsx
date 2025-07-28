import HeaderWithBanner from "../components/HomePage/HeaderWithBanner";
import LeaderSection from "../components/LeaderPage/LeaderSection";
import HeroFooter from "../components/Footer/HeroFooter";
import bannerImg from "../assets/images/Banner-Leadership.png";
import Footer from "../components/Footer/Footer";
import SEO from "../components/SEO";

const LeaderPage = () => {
  return (
    <div>
      <SEO
        title="Đội ngũ lãnh đạo JP TechLift"
        description="Gặp gỡ đội ngũ lãnh đạo chuyên nghiệp và tận tâm của JP TechLift."
        path="/gioi-thieu/ban-lanh-dao"
      />
      <HeaderWithBanner banner={bannerImg} title="ĐỘI NGŨ LÃNH ĐẠO" />
      <LeaderSection />
      <HeroFooter />
      <Footer />
    </div>
  );
};

export default LeaderPage;