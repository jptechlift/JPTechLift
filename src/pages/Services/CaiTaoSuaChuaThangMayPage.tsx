import HeroFooter from "../../components/Footer/HeroFooter";
import HeroBanner from "../../components/HomePage/HeroBanner";
import Footer from "../../components/Footer/Footer";
import CaiTaoSuaChuaThangMay from "../../components/ServicePage/CaiTaoSuaChuaThangMay";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../../components/SEO/constant";

const CaiTaoSuaChuaThangMayPage = () => {
  return (
    <div>
      <Helmet>
        <title>Cải tạo & sửa chữa thang máy - JP TechLift</title>
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
