import HeroFooter from "../../components/footer/HeroFooter";
import HeroBanner from "../../components/home-page/HeroBanner";
import Footer from "../../components/footer/Footer";
import ElevatorConsultation from "../../components/service-page/ElevatorDesignConsulting";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../../components/SEO/constant";
const HomePage = () => {
  return (
    <div>
      <Helmet>
        <title>Tư vấn thiết kế thang máy - JP TechLift</title>
        <meta
          name="description"
          content="Nhận tư vấn thiết kế thang máy tối ưu chi phí và thẩm mỹ, xu hướng mới nhất."
        />
        <link rel="canonical" href={`${BASE_URL}/dich-vu-thang-may/tu-van-thiet-ke`} />
      </Helmet>
      <HeroBanner />
      <ElevatorConsultation />
      <HeroFooter />
      <Footer />
    </div>
  );
};

export default HomePage;
