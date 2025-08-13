import Navbar from "../components/Navbar/Navbar";
import CreateBlogForm from "../components/CreateBlogForm";
import Footer from "../components/Footer/Footer";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../components/SEO/constant";
const CreateBlogPage = () => {
  return (
    <div>
      <Helmet>
        <title>Viết Blog - JP TechLift</title>
        <meta name="description" content="Nơi tạo các Blog về JP TechLift" />
        <link rel="canonical" href={`${BASE_URL}/tao-blog`} />
      </Helmet>
      <Navbar />
      <CreateBlogForm />
      <Footer />
    </div>
  );
};

export default CreateBlogPage;
