import HeroFooter from "../../components/footer/HeroFooter";
import HeroBanner from "../../components/home-page/HeroBanner";
import Footer from "../../components/footer/Footer";
import CaiTaoSuaChuaThangMay from "../../components/service-page/CaiTaoSuaChuaThangMay";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../../components/SEO/constant";

const CaiTaoSuaChuaThangMayPage = () => {
  return (
    <div>
      <Helmet>
        <title>Bảo trì & bảo dưỡng thang máy - JP TechLift</title>
        <meta name="description" content="Nâng cấp và sửa chữa thang máy nhanh chóng, bảo đảm an toàn và hiệu quả." />
        <link rel="canonical" href={`${BASE_URL}/dich-vu-thang-may/cai-tao-sua-chua`} />
      </Helmet>
      <HeroBanner />
      <CaiTaoSuaChuaThangMay />
      <HeroFooter />
      <Footer />
    </div>
  );
};

export default CaiTaoSuaChuaThangMayPage;
