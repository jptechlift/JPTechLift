import ContactJPTechLiftForm from "../components/ContactForm/ContactForm";
import HeaderWithBanner from "../components/HomePage/HeaderWithBanner";
import banner from "../assets/images/Banner-img2.png";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../components/SEO/constant";
import Footer from "../components/Footer/Footer";

const ContactJPTechLiftFormPage = () => {
  return (
    <div>
      <Helmet>
        <title>Liên hệ - JP TechLift</title>
        <meta name="description" content="Gửi yêu cầu tư vấn nhanh đến JP TechLift và nhận hỗ trợ nhiệt tình." />
        <link rel="canonical" href={`${BASE_URL}/lien-he`} />
      </Helmet>
      <HeaderWithBanner banner={banner} title="LIÊN HỆ" />
      <ContactJPTechLiftForm />
      <Footer />
    </div>
  );
};

export default ContactJPTechLiftFormPage;
