import Accessories from "../../components/ServicePage/AccessoriesPage";
import Footer from "../../components/Footer/Footer";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../../components/SEO/constant";
import NavBar from "../../components/Navbar/Navbar";

const AccessoriesPage = () => {
  return (
    <div>
      <Helmet>
        <title>Vật tư & Phụ kiện thang máy chuyên dụng - JP TechLift</title>
        <meta
          name="description"
          content="Cung cấp vật tư, phụ kiện thang máy chính hãng, đáp ứng xu hướng mới nhất. Liên hệ ngay để nhận báo giá."
        />
        <link rel="canonical" href={`${BASE_URL}/dich-vu-thang-may/vat-tu-phu-kien`} />
      </Helmet>
      <NavBar/>
      <Accessories />
      <Footer />
    </div>
  );
};

export default AccessoriesPage;