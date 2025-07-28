import HeroFooter from "../../components/Footer/HeroFooter";
import HeroBanner from "../../components/HomePage/HeroBanner";
import Footer from "../../components/Footer/Footer";
import ElevatorConsultation from "../../components/ServicePage/ElevatorDesignConsulting";
import SEO from "../../components/SEO";
const HomePage = () => {
  return (
    <div>
      <SEO
        title="Tư vấn thiết kế thang máy"
        description="Dịch vụ tư vấn thiết kế thang máy tối ưu và tiết kiệm chi phí bởi JP TechLift."
        path="/dich-vu-thang-may/tu-van-thiet-ke"
      />
      <HeroBanner />
      <ElevatorConsultation/>
        <HeroFooter />
      <Footer />
    </div>
  );
};

export default HomePage;