import BlogPageComp from "../components/blog-page/BlogPageSection";
import HeaderWithBanner from "../components/home-page/HeaderWithBanner";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../components/SEO/constant";
import BlogBanner from "../assets/images/banner-blog.jpg";
import Footer from "../components/footer/Footer";

const BlogPage = () => {
  return (
    <div>
      <Helmet>
        <title>Blog về thông tin thang máy - JP TechLift</title>
        <meta
          name="description"
          content="Chia sẻ kiến thức và kinh nghiệm thang máy cập nhật liên tục từ chuyên gia JP TechLift."
        />
        <link rel="canonical" href={`${BASE_URL}/blog-thang-may`} />
      </Helmet>
      <HeaderWithBanner banner={BlogBanner} title="BLOG CHÚNG TÔI" />
      <BlogPageComp />
      <Footer />
    </div>
  );
};

export default BlogPage;
