import HeroFooter from "../../components/Footer/HeroFooter";
import HeroBanner from "../../components/home-page/HeroBanner";
import Footer from "../../components/Footer/Footer";
import ElevatorInstallationOperation from "../../components/service-page/ElevatorInstallationOperation";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../../components/SEO/constant";

const HomePage = () => {
  return (
    <div>
      <Helmet>
        <title>Hướng dẫn vận hành thang máy - JP TechLift</title>
        <meta
          name="description"
          content="Tổng hợp hướng dẫn vận hành thang máy an toàn cho người dùng và kỹ thuật viên."
        />
        <link rel="canonical" href={`${BASE_URL}/dich-vu-thang-may/huong-dan-van-hanh`} />
      </Helmet>
      <HeroBanner />
      <ElevatorInstallationOperation />
      <HeroFooter />
      <Footer />
    </div>
  );
};

export default HomePage;
