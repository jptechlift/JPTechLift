import React, { useState } from "react";

const CreateBlogForm: React.FC = () => {
  // State để lưu trữ loại blog đang được chọn
  const [blogType, setBlogType] = useState<string>("");

  const blogOptions = [
    { value: "", label: "Chọn loại Blog" },
    { value: "product", label: "Blog về sản phẩm" },
    { value: "topic", label: "Blog theo chủ đề" },
  ];

  const productTypeOptions = [
    { value: "", label: "Loại thang máy" },
    { value: "home-lift", label: "Thang máy gia đình" },
    { value: "freight-lift", label: "Thang máy tải hàng" },
    { value: "panorama-lift", label: "Thang máy quan sát"},
    { value: "hospital-lift", label: "Thang máy bệnh viện"},
    { value: "passenger-lift", label: "Thang máy hành khách"},
    { value: "dumpwaiter", label: "Thang tải thực phẩm"},
    { value: "escalator", label: "Thang trượt - thang cuốn"}
  ];

  // Component form cho "Blog theo chủ đề"
  const TopicBlogForm = () => (
    <form>
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
          ></textarea>
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
  const ProductBlogForm = () => (
    <form>
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
          ></textarea>
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
          />
          <input
            type="text"
            placeholder="Tải trọng"
            className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#041E41] focus:border-[#041E41]"
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
          ></textarea>
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
          ></textarea>
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
          {/* Đã cập nhật màu chủ đạo */}
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
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              {blogOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Hiển thị form tương ứng dựa vào state */}
          {blogType === "product" && <ProductBlogForm />}
          {blogType === "topic" && <TopicBlogForm />}
        </div>

        {/* Cột phải hiển thị danh sách Blog */}
        <div className="w-full md:w-1/3 mt-8 md:mt-10">
          {/* Đã cập nhật màu chủ đạo */}
          <h2 className="text-lg font-bold text-[#041E41] mb-4 text-center">
            DANH SÁCH CÁC BLOG
          </h2>
          <div className="space-y-2">
            {/* Đã cập nhật màu chủ đạo */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-12 border border-[#041E41] rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogForm;
