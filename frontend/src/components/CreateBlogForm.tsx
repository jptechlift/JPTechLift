import React, { useState } from "react";
import axios from "axios";

const CreateBlogForm: React.FC = () => {
  // State để lưu trữ loại blog đang được chọn
  const [blogType, setBlogType] = useState<string>("");

  // State cho form Blog theo sản phẩm
  const [productDetails, setProductDetails] = useState({
    productName: "",
    productType: "",
    shortDescription: "",
    technicalSpecs: "",
    features: "",
    seoKeywords: "",
  });

  // State cho form Blog theo chủ đề
  const [topicDetails, setTopicDetails] = useState({
    blogTopic: "",
    blogPurpose: "",
    seoKeywords: "",
  });

  const blogOptions = [
    { value: "", label: "Chọn loại Blog" },
    { value: "product", label: "Blog về sản phẩm" },
    { value: "topic", label: "Blog theo chủ đề" },
  ];

  // Định nghĩa các loại thang máy
  const productTypeOptions = [
    { value: "", label: "Loại thang máy" },
    { value: "home-lift", label: "Thang máy gia đình" },
    { value: "freight-lift", label: "Thang máy tải hàng" },
    { value: "panorama-lift", label: "Thang máy quan sát" },
    { value: "hospital-lift", label: "Thang máy bệnh viện" },
    { value: "passenger-lift", label: "Thang máy hành khách" },
    { value: "dumpwaiter", label: "Thang tải thực phẩm" },
    { value: "escalator", label: "Thang trượt - thang cuốn" },
  ];

  // handle form submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Tạo đối tượng blogRequest từ dữ liệu trong form
    const blogRequest = {
      blogType,
      username: "user123", // Gán tên người dùng (có thể lấy từ session hoặc props)
      ...productDetails, // Nếu BlogType là "product"
      ...topicDetails, // Nếu BlogType là "topic"
    };

    try {
      // Gửi dữ liệu qua POST đến backend
      const response = await axios.post('http://localhost:5000/api/blog', blogRequest);
      console.log('Blog created successfully:', response.data);
      // Thực hiện hành động khi blog được tạo thành công
      alert(response.data.message); // Hiển thị thông báo thành công
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Đã xảy ra lỗi khi tạo blog!');
    }
  };

  // Component form cho "Blog theo chủ đề"
  const TopicBlogForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Chủ đề bài Blog */}
        <div>
          <label
            htmlFor="blog-topic"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Chủ đề bài Blog:
          </label>
          <input
            id="blog-topic"
            type="text"
            className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#041E41] focus:border-[#041E41]"
            value={topicDetails.blogTopic}
            onChange={(e) => setTopicDetails({ ...topicDetails, blogTopic: e.target.value })}
          />
        </div>

        {/* Mục đích bài Blog */}
        <div>
          <label
            htmlFor="blog-purpose"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mục đích bài Blog:
          </label>
          <input
            id="blog-purpose"
            type="text"
            className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#041E41] focus:border-[#041E41]"
            value={topicDetails.blogPurpose}
            onChange={(e) => setTopicDetails({ ...topicDetails, blogPurpose: e.target.value })}
          />
        </div>

        {/* Từ khoá SEO */}
        <div>
          <label
            htmlFor="seo-keywords-topic"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Từ khoá SEO (từ khoá cách nhau bởi dấu ';'):
          </label>
          <textarea
            id="seo-keywords-topic"
            rows={3}
            className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#] focus:border-[#041E41]"
            value={topicDetails.seoKeywords}
            onChange={(e) => setTopicDetails({ ...topicDetails, seoKeywords: e.target.value })}
          />
        </div>

        {/* Nút Tạo Blog */}
        <div>
          <button
            type="submit"
            className="px-6 py-2 border-2 border-[#041E41] text-black font-semibold hover:bg-[#cba053] hover:text-[#041E41] focus:outline-none"
          >
            + TẠO BLOG
          </button>
        </div>
      </div>
    </form>
  );

  // Component form cho "Blog về sản phẩm"
  const ProductBlogForm = ({ productTypeOptions }: { productTypeOptions: { value: string, label: string }[] }) => (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Tên và Loại thang máy */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="product-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên thang máy:
            </label>
            <input
              id="product-name"
              type="text"
              className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#041E41] focus:border-[#041E41]"
              value={productDetails.productName}
              onChange={(e) => setProductDetails({ ...productDetails, productName: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="product-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loại thang máy:
            </label>
            <select
              id="product-type"
              className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#041E41] focus:border-[#041E41] bg-white"
              value={productDetails.productType}
              onChange={(e) => setProductDetails({ ...productDetails, productType: e.target.value })}
            >
              {productTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mô tả ngắn */}
        <div>
          <label
            htmlFor="short-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mô tả ngắn:
          </label>
          <textarea
            id="short-description"
            rows={2}
            className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#041E41] focus:border-[#041E41]"
            value={productDetails.shortDescription}
            onChange={(e) => setProductDetails({ ...productDetails, shortDescription: e.target.value })}
          />
        </div>

        {/* Thông số kỹ thuật */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thông số kĩ thuật:
          </label>
          <input
            type="text"
            placeholder="Kích thước"
            className="w-full px-3 py-2 mb-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#041E41] focus:border-[#041E41]"
            value={productDetails.technicalSpecs}
            onChange={(e) => setProductDetails({ ...productDetails, technicalSpecs: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tải trọng"
            className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#041E41] focus:border-[#041E41]"
            value={productDetails.features}
            onChange={(e) => setProductDetails({ ...productDetails, features: e.target.value })}
          />
        </div>

        {/* Tính năng & Ưu điểm */}
        <div>
          <label
            htmlFor="features"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tính năng & Ưu điểm (từ khoá cách nhau bởi dấu ';'):
          </label>
          <textarea
            id="features"
            rows={2}
            className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#041E41] focus:border-[#041E41]"
            value={productDetails.features}
            onChange={(e) => setProductDetails({ ...productDetails, features: e.target.value })}
          />
        </div>

        {/* Từ khoá SEO */}
        <div>
          <label
            htmlFor="seo-keywords-product"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Từ khoá SEO (từ khoá cách nhau bởi dấu ';'):
          </label>
          <textarea
            id="seo-keywords-product"
            rows={2}
            className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#041E41] focus:border-[#041E41]"
            value={productDetails.seoKeywords}
            onChange={(e) => setProductDetails({ ...productDetails, seoKeywords: e.target.value })}
          />
        </div>

        {/* Nút Tạo Blog */}
        <div>
          <button
            type="submit"
            className="px-6 py-2 border-2 border-[#041E41] text-black font-semibold hover:bg-[#cba053] hover:text-[#041E41] focus:outline-none"
          >
            + TẠO BLOG
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="bg-texture-bg bg-texture-pattern bg-[length:8px_8px] min-h-screen p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between">
        {/* Cột trái chứa form */}
        <div className="w-full md:w-2/3 md:pr-10">
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="hover:underline">
              Dashboard
            </a>{" "}
            &raquo;{" "}
            <a href="/tao-blog" className="hover:underline">
              Tạo Blog
            </a>
          </p>
          <h1 className="text-2xl font-bold text-[#041E41] mt-4 mb-2">
            Thiết kế nội dung cho Blog
          </h1>
          <p className="text-gray-700 mb-6">
            Bạn hãy điền tất cả nội dung chính vào các trường và hệ thống sẽ tự
            tạo nội dung cho Blog.
          </p>

          {/* Dropdown chọn loại Blog */}
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

          {/* Hiển thị form tương ứng dựa vào state */}
          {blogType === "product" && <ProductBlogForm productTypeOptions={productTypeOptions} />}
          {blogType === "topic" && <TopicBlogForm />}
        </div>

        {/* Cột phải hiển thị danh sách Blog */}
        <div className="w-full md:w-1/3 mt-8 md:mt-10">
          <h2 className="text-lg font-bold text-[#041E41] mb-4 text-center">
            DANH SÁCH CÁC BLOG
          </h2>
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-12 border border-[#041E41] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogForm;
