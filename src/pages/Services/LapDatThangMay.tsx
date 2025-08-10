import HeroFooter from "../../components/footer/HeroFooter";
import HeroBanner from "../../components/home-page/HeroBanner";
import Footer from "../../components/footer/Footer";
import ElevatorInstallationOperation from "../../components/service-page/ElevatorInstallationOperation";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../../components/SEO/constant";

const LapDatThangMayPage = () => {
  return (
    <div>
      <Helmet>
        <title>Lắp đặt & vận hành thang máy - JP TechLift</title>
        <meta
          name="description"
          content="Dịch vụ lắp đặt thang máy an toàn, chất lượng cao, đáp ứng nhu cầu thị trường."
        />
        <link rel="canonical" href={`${BASE_URL}/dich-vu-thang-may/lap-dat-thang-may`} />
      </Helmet>
      <HeroBanner />
      <ElevatorInstallationOperation />
      <HeroFooter />
      <Footer />
    </div>
  );
};

export default LapDatThangMayPage;
