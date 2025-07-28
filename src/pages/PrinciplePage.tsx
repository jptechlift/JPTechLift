import HeaderWithBanner from "../components/HomePage/HeaderWithBanner";
import PrincipleSection from "../components/PrinciplePage/PrincipleSection";
import HeroFooter from "../components/Footer/HeroFooter";
import bannerImg from "../assets/images/Banner-Principle.jpg";
import Footer from "../components/Footer/Footer";
import SEO from "../components/SEO";

const PrinciplePage = () => {
  return (
    <div>
      <SEO
        title="Nguyên tắc hoạt động JP TechLift"
        description="Những nguyên tắc và giá trị cốt lõi làm nên thương hiệu JP TechLift."
        path="/gioi-thieu/nguyen-tac"
      />
      <HeaderWithBanner banner={bannerImg} title="NGUYÊN TẮC CỦA JPTECHLIFT" />
      <PrincipleSection />
      <HeroFooter />
      <Footer />
    </div>
  );
};

export default PrinciplePage;
