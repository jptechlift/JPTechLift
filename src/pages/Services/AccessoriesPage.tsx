import Accessories from "../../components/ServicePage/AccessoriesPage";
import Footer from "../../components/Footer/Footer";
import SEO from "../../components/SEO";
import NavBar from "../../components/Navbar/Navbar";

const AccessoriesPage = () => {
  return (
    <div>
      <SEO
        title="Vật tư & Phụ kiện thang máy JP TechLift"
        description="Cung cấp vật tư và phụ kiện thang máy chính hãng, chất lượng cao."
        path="/dich-vu-thang-may/vat-tu-phu-kien"
      />
      <NavBar/>
      <Accessories />
      <Footer />
    </div>
  );
};

export default AccessoriesPage;
