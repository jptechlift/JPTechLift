import BlogPageComp from "../components/BlogPage/BlogPageSection";
import HeaderWithBanner from "../components/HomePage/HeaderWithBanner";
import SEO from "../components/SEO";
import BlogBanner from "../assets/images/banner-blog.jpg";
import Footer from "../components/Footer/Footer";

const BlogPage = () => {
  return (
    <div>
      <SEO
        title="Blog thang máy JP TechLift"
        description="Cập nhật kiến thức và kinh nghiệm hữu ích về thang máy từ JP TechLift."
        url="/lien-he"
        image={BlogBanner}
      />
      <HeaderWithBanner banner={BlogBanner} title="BLOG CHÚNG TÔI" />
      <BlogPageComp />
      <Footer />
    </div>
  );
};

export default BlogPage;
