import HeroFooter from "../../components/Footer/HeroFooter";
import HeroBanner from "../../components/HomePage/HeroBanner";
import Footer from "../../components/Footer/Footer";
import ElevatorInstallationOperation from "../../components/ServicePage/ElevatorInstallationOperation";
import SEO from "../../components/SEO";

const LapDatThangMayPage= () => {
  return (
    <div>
      <SEO
        title="Lắp đặt thang máy JP TechLift"
        description="Dịch vụ lắp đặt và vận hành thang máy an toàn, chuyên nghiệp từ JP TechLift."
          url="/dich-vu-thang-may/lap-dat-thang-may"
        image="/og-default.jpg"
      />
      <HeroBanner />
      <ElevatorInstallationOperation/>
        <HeroFooter />
      <Footer />
    </div>
  );
};

export default LapDatThangMayPage;