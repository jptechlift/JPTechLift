import React, { useState } from "react";
import axios from "axios";
// BƯỚC 1: Import hook useNavigate từ react-router-dom
import { useNavigate } from "react-router-dom";

// =================================================================
// CÁC COMPONENT CON ĐƯỢC ĐƯA RA BÊN NGOÀI
// =================================================================

// Nâng cấp: Thêm prop `isGenerating` để quản lý trạng thái của nút
const ProductBlogForm = ({ productDetails, setProductDetails, handleSubmit, productTypeOptions, isGenerating }) => (
  <form onSubmit={handleSubmit}>
    <div className="space-y-4">
      {/* ... Tất cả các input và label giữ nguyên ... */}
      {/* Tên thang máy */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">Tên thang máy:</label>
          <input id="product-name" type="text" className="..." value={productDetails.ProductName} onChange={(e) => setProductDetails(prev => ({ ...prev, ProductName: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="product-type" className="block text-sm font-medium text-gray-700 mb-1">Loại thang máy:</label>
          <select id="product-type" className="..." value={productDetails.ProductType} onChange={(e) => setProductDetails(prev => ({ ...prev, ProductType: e.target.value }))}>
            {productTypeOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
          </select>
        </div>
      </div>
      {/* Mô tả ngắn */}
      <div>
        <label htmlFor="short-description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn:</label>
        <textarea id="short-description" rows={2} className="..." value={productDetails.ShortDescription} onChange={(e) => setProductDetails(prev => ({ ...prev, ShortDescription: e.target.value }))} />
      </div>
      {/* Thông số kỹ thuật */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Thông số kĩ thuật:</label>
        <input type="text" placeholder="Kích thước" className="..." value={productDetails.TechnicalSpecs} onChange={(e) => setProductDetails(prev => ({ ...prev, TechnicalSpecs: e.target.value }))} />
        <input type="text" placeholder="Tải trọng" className="..." value={productDetails.Load} onChange={(e) => setProductDetails(prev => ({ ...prev, Load: e.target.value }))} />
      </div>
      {/* Tính năng & Ưu điểm */}
      <div>
        <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">Tính năng & Ưu điểm (từ khoá cách nhau bởi dấu ';'):</label>
        <textarea id="features" rows={2} className="..." value={productDetails.Features} onChange={(e) => setProductDetails(prev => ({ ...prev, Features: e.target.value }))} />
      </div>
      {/* Từ khoá SEO */}
      <div>
        <label htmlFor="seo-keywords-product" className="block text-sm font-medium text-gray-700 mb-1">Từ khoá SEO (từ khoá cách nhau bởi dấu ';'):</label>
        <textarea id="seo-keywords-product" rows={2} className="..." value={productDetails.SeoKeywords} onChange={(e) => setProductDetails(prev => ({ ...prev, SeoKeywords: e.target.value }))} />
      </div>

      {/* Nút Tạo Blog được nâng cấp */}
      <div>
        <button 
          type="submit"
          disabled={isGenerating} // Vô hiệu hóa nút khi đang tạo
          className="px-6 py-2 border-2 border-[#041E41] text-black font-semibold hover:bg-[#cba053] hover:text-[#041E41] focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Đang tạo...' : '+ TẠO BLOG'}
        </button>
      </div>
    </div>
  </form>
);

// Nâng cấp: Thêm prop `isGenerating`
const TopicBlogForm = ({ topicDetails, setTopicDetails, handleSubmit, isGenerating }) => (
  <form onSubmit={handleSubmit}>
    <div className="space-y-4">
      {/* ... Các input và label giữ nguyên ... */}
      <div>
        <label htmlFor="blog-topic" className="block text-sm font-medium text-gray-700 mb-1">Chủ đề bài Blog:</label>
        <input id="blog-topic" type="text" className="..." value={topicDetails.BlogTopic} onChange={(e) => setTopicDetails(prev => ({ ...prev, BlogTopic: e.target.value }))} />
      </div>
      <div>
        <label htmlFor="blog-purpose" className="block text-sm font-medium text-gray-700 mb-1">Mục đích bài Blog:</label>
        <input id="blog-purpose" type="text" className="..." value={topicDetails.BlogPurpose} onChange={(e) => setTopicDetails(prev => ({ ...prev, BlogPurpose: e.target.value }))} />
      </div>
      <div>
        <label htmlFor="seo-keywords-topic" className="block text-sm font-medium text-gray-700 mb-1">Từ khoá SEO (từ khoá cách nhau bởi dấu ';'):</label>
        <textarea id="seo-keywords-topic" rows={3} className="..." value={topicDetails.SeoKeywords} onChange={(e) => setTopicDetails(prev => ({ ...prev, SeoKeywords: e.target.value }))} />
      </div>
      
      {/* Nút Tạo Blog được nâng cấp */}
      <div>
        <button 
          type="submit"
          disabled={isGenerating} // Vô hiệu hóa nút khi đang tạo
          className="px-6 py-2 border-2 border-[#041E41] text-black font-semibold hover:bg-[#cba053] hover:text-[#041E41] focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Đang tạo...' : '+ TẠO BLOG'}
        </button>
      </div>
    </div>
  </form>
);

// =================================================================
// COMPONENT CHA CHÍNH
// =================================================================
const CreateBlogForm: React.FC = () => {
  const [blogType, setBlogType] = useState<string>("");
  
  // BƯỚC 2: Thêm state để quản lý trạng thái loading
  const [isGenerating, setIsGenerating] = useState(false);
  
  // BƯỚC 3: Khởi tạo hook navigate
  const navigate = useNavigate();

  const [productDetails, setProductDetails] = useState({
    ProductName: "", ProductType: "", ShortDescription: "",
    TechnicalSpecs: "", Load: "", Features: "", SeoKeywords: "",
  });

  const [topicDetails, setTopicDetails] = useState({
    BlogTopic: "", BlogPurpose: "", SeoKeywords: "",
  });

  const blogOptions = [
    { value: "", label: "Chọn loại Blog" },
    { value: "product", label: "Blog về sản phẩm" },
    { value: "topic", label: "Blog theo chủ đề" },
  ];

  const productTypeOptions = [
    { value: "", label: "Loại thang máy" },
    { value: "home-lift", label: "Thang máy gia đình" },
    { value: "freight-lift", label: "Thang máy tải hàng" },
  ];

  // BƯỚC 4: Nâng cấp hoàn toàn hàm handleSubmit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsGenerating(true); // Bắt đầu loading

    const blogRequest = blogType === 'product' ? {
      BlogType: blogType,
      Username: "baodhg", // Thay bằng logic lấy user thật sau này
      ...productDetails,
    } : {
      BlogType: blogType,
      Username: "baodhg",
      ...topicDetails,
    };

    try {
      // Sửa endpoint thành /generate để gọi logic AI
      const response = await axios.post('http://localhost:5000/api/blog/generate', blogRequest);
      
      console.log('Blog generated successfully:', response.data);
      alert('Blog đã được tạo thành công!');

      // Chuyển hướng đến trang blog mới với slug nhận được từ backend
      if (response.data.slug) {
        navigate(`/blog/${response.data.slug}`);
      }
      
    } catch (error) {
      console.error('Error generating blog:', error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
      alert('Đã xảy ra lỗi khi tạo blog! Vui lòng kiểm tra console.');
    } finally {
      // Dù thành công hay thất bại, luôn dừng loading
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="w-full">
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="hover:underline">Dashboard</a> &raquo;{" "}
            <a href="/tao-blog" className="hover:underline">Tạo Blog</a>
          </p>
          <h1 className="text-3xl font-bold text-[#041E41] mt-4 mb-2">
            Thiết Kế Nội Dung Blog Tự Động
          </h1>
          <p className="text-gray-700 mb-6">
            Bạn chỉ cần điền các ý tưởng chính, hệ thống sẽ tự động tạo ra một bài viết chuẩn SEO.
          </p>

          <div className="mb-6 max-w-xs">
            <select
              value={blogType}
              onChange={(e) => setBlogType(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-400 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-[#041E41] focus:ring-1 focus:ring-[#041E41]"
            >
              {blogOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {blogType === "product" && (
            <ProductBlogForm
              productDetails={productDetails}
              setProductDetails={setProductDetails}
              handleSubmit={handleSubmit}
              productTypeOptions={productTypeOptions}
              isGenerating={isGenerating} // Truyền state xuống component con
            />
          )}
          {blogType === "topic" && (
            <TopicBlogForm
              topicDetails={topicDetails}
              setTopicDetails={setTopicDetails}
              handleSubmit={handleSubmit}
              isGenerating={isGenerating} // Truyền state xuống component con
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBlogForm;