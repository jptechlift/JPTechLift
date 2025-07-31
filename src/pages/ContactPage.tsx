import ContactJPTechLiftForm from "../components/ContactForm/ContactForm";
import HeaderWithBanner from "../components/HomePage/HeaderWithBanner";
import banner from "../assets/images/Banner-img2.png";
import Footer from "../components/Footer/Footer";
import SEO from "../components/SEO";

const ContactJPTechLiftFormPage = () => {
  return (
    <div>
      <SEO
        title="Liên hệ JP TechLift"
        description="Gửi yêu cầu tư vấn và liên hệ với JP TechLift qua biểu mẫu trực tuyến."
       url="/lien-he"
        image={banner}
      />
      <HeaderWithBanner banner={banner} title="LIÊN HỆ" />
      <ContactJPTechLiftForm />
      <Footer />
    </div>
  );
};

export default ContactJPTechLiftFormPage;