import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
import StandardPage from "./pages/StandardPage";
import PrinciplePage from "./pages/PrinciplePage";
import LeaderPage from "./pages/LeaderPage";
import ScrollToTop from "./components/ScrollToTop";
import ProductTemplatePage from "./pages/Products/ProductTemplate";
import ServiceTemplatePage from "./pages/Services/ServiceTemplatePage";
import NewsPage from "./pages/News/NewsPage";
import AboutUsPage from "./pages/AboutUsPage";
import BlogPage from "./pages/BlogPage";
import ContactJPTechLiftFormPage from "./pages/ContactPage";
import TuVan from "./pages/Services/AdvisePage";
import HuongDan from "./pages/Services/InstructionPage";
import LapDatThangMay from "./pages/Services/ElevatorInstallationOperationPage";
import BaoTriThangMay from "./pages/Services/LiftMaintenancePage";
import CaiTaoSuaChuaThangMay from "./pages/Services/ElevatorUpgradeAndRepairPage";
import NotFound from "./pages/NotFound";
import AccessoriesPage from "./pages/Services/AccessoriesPage";
import AestheticModalPage from "./pages/Products/AestheticModal";
import LoginPage from "./pages/Auth/LoginPage";
import CreateBlogPage from "./pages/CreateBlogPage";

const App = () => {
  const RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const redirect = sessionStorage.getItem("redirectPath");
      if (redirect) {
        sessionStorage.removeItem("redirectPath");
        navigate(redirect, { replace: true });
      }
    }, [navigate]);

    return null;
  };
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <RedirectHandler />
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} /> {/* Trang chủ */}
          <Route path="/gioi-thieu/quy-trinh-du-an" element={<StandardPage />} />
          {/* Trang tiêu chuẩn */}
          <Route path="/gioi-thieu/nguyen-tac" element={<PrinciplePage />} />
          {/* Trang nguyên tắc */}
          <Route path="/gioi-thieu/ban-lanh-dao" element={<LeaderPage />} />
          {/* Trang nguyên tắc */}
          <Route path="/tin-tuc-thang-may" element={<NewsPage />} /> {/* Trang tin tức */}
          <Route path="/gioi-thieu" element={<AboutUsPage />} />
          {/* Trang về chúng tôi */}
          <Route path="/blog-thang-may" element={<BlogPage />} /> {/* Trang blog */}
          <Route path="/lien-he" element={<ContactJPTechLiftFormPage />} /> {/* Trang liên hệ */}
          <Route path="/dich-vu-thang-may" element={<ServiceTemplatePage />} />
          {/* Trang thẩm mĩ */}
          <Route path="/dich-vu-thang-may/tham-my" element={<AestheticModalPage />} />
          {/* Trang dịch vụ */}
          <Route path="/dich-vu-thang-may/lap-dat-thang-may" element={<LapDatThangMay />} />
          <Route path="/dich-vu-thang-may/tu-van-thiet-ke" element={<TuVan />} />
          <Route path="/dich-vu-thang-may/huong-dan-van-hanh" element={<HuongDan />} />
          <Route path="/dich-vu-thang-may/bao-tri-thang-may" element={<BaoTriThangMay />} />
          <Route path="/dich-vu-thang-may/cai-tao-sua-chua" element={<CaiTaoSuaChuaThangMay />} />
          <Route path="/dich-vu-thang-may/vat-tu-phu-kien" element={<AccessoriesPage />} />
          <Route path="/thang-may-gia-dinh" element={<Navigate to="/san-pham/thang-may-gia-dinh" replace />} />
          {/* PRODUCT: chỉ còn 1 route động */}
          <Route path="/san-pham/:productId" element={<ProductTemplatePage />} />
          <Route path="/tao-blog" element={<CreateBlogPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
