import Header from "../components/HomePage/HeaderWithBanner";
import AboutUsIntro from "../components/AboutUsPage/AboutUsIntro";
import AboutUsBanner from "../components/AboutUsPage/AboutUsBanner";
import AboutUsReasons from "../components/AboutUsPage/AboutUsReasons";
import AboutUsNewsBlogs from "../components/AboutUsPage/AboutUsNewsBlogs";

import bannerImg from "../assets/images/Banner_AboutUs_Img.png";
import Footer from "../components/Footer/Footer";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../components/SEO/constant";

const AboutUsPage = () => {
  return (
    <div>
      <Helmet>
        <title>Giới thiệu - JP TechLift</title>
        <meta
          name="description"
          content="Tìm hiểu về JP TechLift – Thương hiệu thang máy uy tín, được khách hàng tin chọn."
        />
        <link rel="canonical" href={`${BASE_URL}/gioi-thieu`} />
      </Helmet>
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
