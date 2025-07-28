import HeroFooter from "../../components/Footer/HeroFooter";
import HeroBanner from "../../components/HomePage/HeroBanner";
import Footer from "../../components/Footer/Footer";
import BaoTriThangMay from "../../components/ServicePage/BaoTriThangMay";
import SEO from "../../components/SEO";

const BaoTriThangMayPage = () => {
  return (
    <div>
      <SEO
        title="Bảo trì thang máy JP TechLift"
        description="Dịch vụ bảo trì, bảo dưỡng thang máy định kỳ giúp vận hành ổn định và an toàn."
        path="/dich-vu-thang-may/bao-tri-thang-may"
      />
      <HeroBanner />
      <BaoTriThangMay/>
        <HeroFooter />
      <Footer />
    </div>
  );
};

export default BaoTriThangMayPage;
