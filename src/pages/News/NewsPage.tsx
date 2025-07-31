import Footer from "../../components/Footer/Footer";
import HeroFooter from "../../components/Footer/HeroFooter";
import HeroBanner from "../../components/HomePage/HeroBanner";
import ArticleGrid from "../../components/News/ArticleGrid";
import SEO from "../../components/SEO";

const NewsPage = () => {
    return (
        <div>
            <SEO
                title="Tin tức thang máy JP TechLift"
                description="Cập nhật các tin tức, sự kiện mới nhất về ngành thang máy tại JP TechLift."
                    url="/tin-tuc-thang-may"
                image="/og-default.jpg"
            />
            <HeroBanner />
            <ArticleGrid/>
            <HeroFooter />
            <Footer />
        </div>
    );
};
export default NewsPage;