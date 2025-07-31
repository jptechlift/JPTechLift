import Header from "../components/HomePage/HeaderWithBanner";
import AboutUsIntro from "../components/AboutUsPage/AboutUsIntro";
import AboutUsBanner from "../components/AboutUsPage/AboutUsBanner";
import AboutUsReasons from "../components/AboutUsPage/AboutUsReasons";
import AboutUsNewsBlogs from "../components/AboutUsPage/AboutUsNewsBlogs";

import bannerImg from "../assets/images/Banner_AboutUs_Img.png";
import Footer from "../components/Footer/Footer";
import SEO from "../components/SEO";

const AboutUsPage = () => {
  return (
    <div>
      <SEO
        title="Giới thiệu JP TechLift"
        description="Tìm hiểu về JP TechLift - đơn vị cung cấp thang máy uy tín và chất lượng."
         url="/gioi-thieu"
        image={bannerImg}
      />
      <Header banner={bannerImg} title="VỀ CHÚNG TÔI" />
      <AboutUsIntro />
      <AboutUsBanner />
      <AboutUsReasons />
      <AboutUsNewsBlogs />
      <Footer />
    </div>
  );
};

export default AboutUsPage;