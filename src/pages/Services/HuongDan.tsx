import HeroFooter from "../../components/Footer/HeroFooter";
import HeroBanner from "../../components/HomePage/HeroBanner";
import Footer from "../../components/Footer/Footer";
import ElevatorInstallationOperation from "../../components/ServicePage/ElevatorInstallationOperation";
import SEO from "../../components/SEO";

const HomePage = () => {
  return (
    <div>
      <SEO
        title="Hướng dẫn vận hành thang máy"
        description="Các hướng dẫn vận hành và sử dụng thang máy an toàn từ JP TechLift."
        path="/dich-vu-thang-may/huong-dan-van-hanh"
      />
      <HeroBanner />
      <ElevatorInstallationOperation/>
        <HeroFooter />
      <Footer />
    </div>
  );
};

export default HomePage;