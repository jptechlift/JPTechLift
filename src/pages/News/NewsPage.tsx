import Footer from "../../components/Footer/Footer";
import HeroFooter from "../../components/Footer/HeroFooter";
import HeroBanner from "../../components/home-page/HeroBanner";
import ArticleGrid from "../../components/news-page/ArticleGrid";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../../components/SEO/constant";

const NewsPage = () => {
  return (
    <div>
      <Helmet>
        <title>Tin tức thang máy - JP TechLift</title>
        <meta
          name="description"
          content="Theo dõi tin tức, sự kiện mới nhất về thang máy và công nghệ từ JP TechLift."
        />
        <link rel="canonical" href={`${BASE_URL}/tin-tuc-thang-may`} />
      </Helmet>
      <HeroBanner />
      <ArticleGrid />
      <HeroFooter />
      <Footer />
    </div>
  );
};
export default NewsPage;
