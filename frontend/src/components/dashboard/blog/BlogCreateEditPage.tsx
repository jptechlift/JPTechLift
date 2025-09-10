// src/pages/BlogCreateEditPage.tsx

import React, { useState, useEffect } from "react";
// Đảm bảo rằng tất cả các interface cần thiết được import
import {
  blog,
  BlogPost,
  BlogRequest,
  TopicDetails,
  ProductDetails,
  GeneratedPreviewResponse,
} from "../../../services/blog";
import NavBar from "../../Navbar/Navbar";
import Footer from "../../Footer/DesktopFooter/DesktopFooter";
import RichTextEditor from "../../../components/dashboard/blog/RichTextEditor"; // Bạn cần một Rich Text Editor

const BlogCreateEditPage = () => {
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [blogRequest, setBlogRequest] = useState<BlogRequest>({
    blogType: "topic",
    topicDetails: {
      articleTitle: "",
      targetAudience: "",
      mainPoints: "",
      seoKeywords: "",
      // Chọn một giá trị mặc định hợp lệ từ union type
      toneOfVoice: "Hướng dẫn & Giáo dục",
      angle: "", // Thêm trường mới
      callToAction: "", // Thêm trường mới
    },
    productDetails: null, // Khởi tạo null vì blogType là "topic"
  });
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedPreviewResponse | null>(null); // Sử dụng GeneratedPreviewResponse
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States để chỉnh sửa trực tiếp trên Preview
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedMetaDescription, setEditedMetaDescription] = useState("");
  const [editedSlug, setEditedSlug] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "blogType") {
      setBlogRequest((prev) => ({
        ...prev,
        blogType: value as "topic" | "product", // Ép kiểu để khớp với kiểu union
        productDetails:
          value === "product"
            ? ({
                productName: "",
                productType: "",
                detail: "",
                targetAudience: "",
                keySellingPoints: "",
                seoKeywords: "",
                toneOfVoice: "Chuyên nghiệp & Kỹ thuật", // Giá trị mặc định hợp lệ
                useCases: "", // Thêm trường mới
                technicalHighlights: "", // Thêm trường mới
                callToAction: "", // Thêm trường mới
              } as ProductDetails)
            : null,
        topicDetails:
          value === "topic"
            ? ({
                articleTitle: "",
                targetAudience: "",
                mainPoints: "",
                seoKeywords: "",
                toneOfVoice: "Hướng dẫn & Giáo dục", // Giá trị mặc định hợp lệ
                angle: "", // Thêm trường mới
                callToAction: "", // Thêm trường mới
              } as TopicDetails)
            : null,
      }));
    } else if (blogRequest.blogType === "topic") {
      setBlogRequest((prev) => ({
        ...prev,
        topicDetails: { ...(prev.topicDetails as TopicDetails), [name]: value },
      }));
    } else if (blogRequest.blogType === "product") {
      setBlogRequest((prev) => ({
        ...prev,
        productDetails: { ...(prev.productDetails as ProductDetails), [name]: value },
      }));
    }
  };

  // Hàm gọi API để tạo preview
  const handleGeneratePreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await blog.generatePreview(blogRequest);
      setGeneratedContent(result);
      setEditedTitle(result.title);
      setEditedContent(result.generatedContent); // <-- Đã sửa: dùng generatedContent
      setEditedMetaDescription(result.metaDescription);
      setEditedSlug(result.slug);
      setActiveTab("preview"); // Chuyển sang tab preview
    } catch (err: any) {
      setError(err.message || "Không thể tạo bản xem trước.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm để lưu/xuất bản bài viết đã chỉnh sửa
  const handlePublish = async () => {
    setLoading(true);
    setError(null);
    try {
      // Tạo một BlogRequest mới từ nội dung đã chỉnh sửa
      const updatedBlogRequest: BlogRequest = {
        ...blogRequest, // Giữ lại thông tin ban đầu như BlogType, ProductDetails/TopicDetails
        content: editedContent,
        slug: editedSlug,
        title: editedTitle, // Truyền title đã chỉnh sửa
        metaDescription: editedMetaDescription, // Truyền metaDescription đã chỉnh sửa
      };

      const publishedBlog = await blog.publish(updatedBlogRequest); // <-- Đã sửa: gọi blog.publish
      alert(`Bài viết "${publishedBlog.title}" đã được xuất bản!`);
      // Điều hướng hoặc reset form
    } catch (err: any) {
      setError(err.message || "Không thể xuất bản bài viết.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Tạo/Chỉnh sửa Blog</h1>

        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
            <li className="mr-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "form"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("form")}
                type="button"
                role="tab"
              >
                Nhập liệu
              </button>
            </li>
            <li className="mr-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "preview"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("preview")}
                type="button"
                role="tab"
                disabled={!generatedContent}
              >
                Xem trước & Chỉnh sửa
              </button>
            </li>
          </ul>
        </div>

        {activeTab === "form" && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleGeneratePreview(); }}>
            <div>
              <label htmlFor="blogType" className="block text-sm font-medium text-gray-700">
                Loại Blog
              </label>
              <select
                id="blogType"
                name="blogType"
                value={blogRequest.blogType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="topic">Chủ đề</option>
                <option value="product">Sản phẩm</option>
              </select>
            </div>

            {blogRequest.blogType === "topic" && blogRequest.topicDetails && (
              <>
                <div>
                  <label htmlFor="articleTitle" className="block text-sm font-medium text-gray-700">
                    Tiêu đề bài viết mong muốn
                  </label>
                  <input
                    type="text"
                    id="articleTitle"
                    name="articleTitle"
                    value={blogRequest.topicDetails.articleTitle || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                {/* Thêm trường 'topic' nếu nó khác với 'articleTitle' */}
                {/* <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Chủ đề (ví dụ: Công nghệ, Giáo dục)</label>
                  <input type="text" id="topic" name="topic" value={blogRequest.topicDetails.topic || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div> */}
                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
                    Đối tượng độc giả
                  </label>
                  <input
                    type="text"
                    id="targetAudience"
                    name="targetAudience"
                    value={blogRequest.topicDetails.targetAudience}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="mainPoints" className="block text-sm font-medium text-gray-700">
                    Các ý chính cần triển khai
                  </label>
                  <textarea
                    id="mainPoints"
                    name="mainPoints"
                    value={blogRequest.topicDetails.mainPoints}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700">
                    Từ khóa SEO
                  </label>
                  <input
                    type="text"
                    id="seoKeywords"
                    name="seoKeywords"
                    value={blogRequest.topicDetails.seoKeywords}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="toneOfVoice" className="block text-sm font-medium text-gray-700">
                    Văn phong
                  </label>
                  <select
                    id="toneOfVoice"
                    name="toneOfVoice"
                    value={blogRequest.topicDetails.toneOfVoice}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="Hướng dẫn & Giáo dục">Hướng dẫn & Giáo dục</option>
                    <option value="Phân tích & Chuyên gia">Phân tích & Chuyên gia</option>
                    <option value="Tin tức & Cập nhật">Tin tức & Cập nhật</option>
                  </select>
                </div>
                 <div>
                  <label htmlFor="angle" className="block text-sm font-medium text-gray-700">Góc nhìn/Quan điểm</label>
                  <input type="text" id="angle" name="angle" value={blogRequest.topicDetails.angle || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label htmlFor="callToAction" className="block text-sm font-medium text-gray-700">Lời kêu gọi hành động</label>
                  <input type="text" id="callToAction" name="callToAction" value={blogRequest.topicDetails.callToAction || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </>
            )}

            {blogRequest.blogType === "product" && blogRequest.productDetails && (
              <>
                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={blogRequest.productDetails.productName || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                    Loại sản phẩm
                  </label>
                  <input
                    type="text"
                    id="productType"
                    name="productType"
                    value={blogRequest.productDetails.productType || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="detail" className="block text-sm font-medium text-gray-700">
                    Chi tiết sản phẩm
                  </label>
                  <textarea
                    id="detail"
                    name="detail"
                    value={blogRequest.productDetails.detail || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
                    Đối tượng độc giả (Sản phẩm)
                  </label>
                  <input
                    type="text"
                    id="targetAudience"
                    name="targetAudience"
                    value={blogRequest.productDetails.targetAudience || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="keySellingPoints" className="block text-sm font-medium text-gray-700">
                    Điểm bán hàng chính
                  </label>
                  <textarea
                    id="keySellingPoints"
                    name="keySellingPoints"
                    value={blogRequest.productDetails.keySellingPoints || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700">
                    Từ khóa SEO (Sản phẩm)
                  </label>
                  <input
                    type="text"
                    id="seoKeywords"
                    name="seoKeywords"
                    value={blogRequest.productDetails.seoKeywords || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="toneOfVoiceProduct" className="block text-sm font-medium text-gray-700">
                    Văn phong (Sản phẩm)
                  </label>
                  <select
                    id="toneOfVoiceProduct" // ID duy nhất
                    name="toneOfVoice" // tên thuộc tính trong ProductDetails
                    value={blogRequest.productDetails.toneOfVoice}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="Chuyên nghiệp & Kỹ thuật">Chuyên nghiệp & Kỹ thuật</option>
                    <option value="Thân thiện & Thuyết phục">Thân thiện & Thuyết phục</option>
                    <option value="Sang trọng & Cao cấp">Sang trọng & Cao cấp</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="useCases" className="block text-sm font-medium text-gray-700">Trường hợp sử dụng</label>
                  <textarea id="useCases" name="useCases" value={blogRequest.productDetails.useCases || ''} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                </div>
                <div>
                  <label htmlFor="technicalHighlights" className="block text-sm font-medium text-gray-700">Điểm nổi bật kỹ thuật</label>
                  <textarea id="technicalHighlights" name="technicalHighlights" value={blogRequest.productDetails.technicalHighlights || ''} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                </div>
                <div>
                  <label htmlFor="callToActionProduct" className="block text-sm font-medium text-gray-700">Lời kêu gọi hành động (Sản phẩm)</label>
                  <input type="text" id="callToActionProduct" name="callToAction" value={blogRequest.productDetails.callToAction || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Đang tạo preview..." : "Tạo Preview"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        )}

        {activeTab === "preview" && generatedContent && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Xem trước & Chỉnh sửa</h2>

            <div>
              <label htmlFor="editedTitle" className="block text-sm font-medium text-gray-700">
                Tiêu đề
              </label>
              <input
                type="text"
                id="editedTitle"
                value={editedTitle}
                onChange={(e) => {
                  setEditedTitle(e.target.value);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-xl font-semibold"
              />
            </div>

            <div>
              <label htmlFor="editedSlug" className="block text-sm font-medium text-gray-700">
                Slug (URL)
              </label>
              <input
                type="text"
                id="editedSlug"
                value={editedSlug}
                onChange={(e) => setEditedSlug(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="editedMetaDescription" className="block text-sm font-medium text-gray-700">
                Meta Description (SEO)
              </label>
              <textarea
                id="editedMetaDescription"
                value={editedMetaDescription}
                onChange={(e) => setEditedMetaDescription(e.target.value)}
                rows={2}
                maxLength={160}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nội dung Blog</label>
              <RichTextEditor value={editedContent} onChange={setEditedContent} />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePublish}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Đang xuất bản..." : "Xuất bản Blog"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BlogCreateEditPage;