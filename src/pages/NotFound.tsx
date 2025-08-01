import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../components/SEO/constant";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10">
      <Helmet>
        <title>Không tìm thấy trang - JP TechLift</title>
        <meta name="description" content="Trang bạn tìm kiếm không tồn tại." />
        <link rel="canonical" href={`${BASE_URL}/404`} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">404 - Trang không tồn tại</h1>
      <Link to="/" className="text-blue-500 underline">
        Quay lại trang chủ
      </Link>
    </div>
  );
};
export default NotFound;