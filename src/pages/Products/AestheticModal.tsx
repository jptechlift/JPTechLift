import Footer from "../../components/Footer/Footer";
import AestheticModal from "../../components/ProductPage/AestheticsModal";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../../components/SEO/constant";
import NavBar from "../../components/Navbar/Navbar";

const AestheticModalPage = () => {
  return (
    <div>
      <Helmet>
        <title>Thẩm mỹ cabin - JP TechLift</title>
        <meta name="description" content="Khám phá các tùy chọn thẩm mỹ cho cabin thang máy của bạn tại JP TechLift." />
        <link rel="canonical" href={`${BASE_URL}/thong-tin-tham-my-cabin`} />
      </Helmet>
      <NavBar />
      <AestheticModal />
      <Footer />
    </div>
  );
};
export default AestheticModalPage;
