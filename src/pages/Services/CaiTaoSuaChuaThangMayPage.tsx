import HeroFooter from "../../components/Footer/HeroFooter";
import HeroBanner from "../../components/HomePage/HeroBanner";
import Footer from "../../components/Footer/Footer";
import CaiTaoSuaChuaThangMay from "../../components/ServicePage/CaiTaoSuaChuaThangMay";
import SEO from "../../components/SEO";

const CaiTaoSuaChuaThangMayPage= () => {
  return (
    <div>
      <SEO
        title="Cải tạo, sửa chữa thang máy"
        description="Dịch vụ nâng cấp, sửa chữa thang máy nhằm đảm bảo an toàn và hiệu suất tối ưu."
        path="/dich-vu-thang-may/cai-tao-sua-chua"
      />
      <HeroBanner />
      <CaiTaoSuaChuaThangMay/>
        <HeroFooter />
      <Footer />
    </div>
  );
};

export default CaiTaoSuaChuaThangMayPage;