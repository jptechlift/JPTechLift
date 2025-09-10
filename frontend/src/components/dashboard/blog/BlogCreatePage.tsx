// src/pages/dashboard/BlogCreatePage.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import axios from "axios";
import {
  blog,
  BlogRequest,
  GeneratedPreviewResponse,
  ProductDetails,
  TopicDetails,
} from "../../../services/blog";
import NavBar from "../../Navbar/Navbar";
import Footer from "../../Footer/DesktopFooter/DesktopFooter";
import RecentPosts from "../../../components/dashboard/blog/RecentPosts"; // Đảm bảo đường dẫn đúng
import {
  Sparkles,
  Pencil,
  FileText,
  Globe,
  ListFilter,
  Edit3,
  Rocket,
  RotateCcw,
} from "lucide-react";

// --- COMPONENT CHÍNH ---
export default function BlogCreatePage() {
  const [viewMode, setViewMode] = useState<"list" | "aiForm" | "manualForm">(
    "list"
  );
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  // State quản lý toàn bộ dữ liệu của form (thay thế react-hook-form)
  const [blogRequest, setBlogRequest] = useState<BlogRequest>({
    blogType: "topic",
    topicDetails: {
      articleTitle: "",
      targetAudience: "",
      mainPoints: "",
      seoKeywords: "",
      toneOfVoice: "Hướng dẫn & Giáo dục",
    },
    productDetails: null,
  });

  // State quản lý kết quả từ AI và các nội dung đã được chỉnh sửa
  const [finalTitle, setFinalTitle] = useState("");
  const [finalSlug, setFinalSlug] = useState("");
  const [finalContent, setFinalContent] = useState("");
  const [finalMetaDescription, setFinalMetaDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Để refresh list
  const navigate = useNavigate(); // Để điều hướng sau khi publish

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setError(null); // Xóa lỗi cũ khi người dùng bắt đầu nhập liệu

    if (name === "blogType") {
      const newBlogType = value as "topic" | "product";
      setBlogRequest({
        blogType: newBlogType,
        productDetails:
          newBlogType === "product"
            ? {
                productName: "",
                productType: "",
                detail: "",
                targetAudience: "",
                keySellingPoints: "",
                seoKeywords: "",
                toneOfVoice: "Chuyên nghiệp & Kỹ thuật",
              }
            : null,
        topicDetails:
          newBlogType === "topic"
            ? {
                articleTitle: "",
                targetAudience: "",
                mainPoints: "",
                seoKeywords: "",
                toneOfVoice: "Hướng dẫn & Giáo dục",
              }
            : null,
      });
    } else if (blogRequest.blogType === "topic" && blogRequest.topicDetails) {
      setBlogRequest((prev) => ({
        ...prev,
        topicDetails: { ...prev.topicDetails!, [name]: value },
      }));
    } else if (
      blogRequest.blogType === "product" &&
      blogRequest.productDetails
    ) {
      setBlogRequest((prev) => ({
        ...prev,
        productDetails: { ...prev.productDetails!, [name]: value },
      }));
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .normalize("NFD")
      .replace(/[\u3000-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleGeneratePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await blog.generatePreview(blogRequest);
      setFinalTitle(result.title);
      setFinalContent(result.generatedContent);
      setFinalMetaDescription(result.metaDescription);
      setFinalSlug(result.slug);
      setActiveTab("preview");
    } catch (err: any) {
      setError(
        err.message || "Không thể tạo bản xem trước. Vui lòng kiểm tra console."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: BlogRequest = {
        ...blogRequest,
        title: finalTitle,
        slug: finalSlug,
        content: finalContent,
        metaDescription: finalMetaDescription,
      };

      const publishedBlog = await blog.publish(payload);
      alert(`Bài viết "${publishedBlog.title}" đã được xuất bản thành công!`);
      // Điều hướng đến trang chi tiết bài viết vừa tạo
      navigate(`/blog/${publishedBlog.slug}`);
    } catch (err: any) {
      setError(
        err.message || "Không thể xuất bản bài viết. Vui lòng kiểm tra console."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setBlogRequest({
      blogType: "topic",
      topicDetails: {
        articleTitle: "",
        targetAudience: "",
        mainPoints: "",
        seoKeywords: "",
        toneOfVoice: "Hướng dẫn & Giáo dục",
      },
      productDetails: null,
    });
    setFinalTitle("");
    setFinalSlug("");
    setFinalContent("");
    setFinalMetaDescription("");
    setActiveTab("form");
    setViewMode("list");
  };

  // === RENDER GIAO DIỆN CHÍNH (MÀN HÌNH CHÀO MỪNG) ===
  if (viewMode === "list") {
    if (viewMode === "list") {
      return (
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#041e42]">
              Quản lý Nội dung Blog
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Xem lại các bài viết gần đây hoặc bắt đầu tạo nội dung mới.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <button onClick={() => setViewMode("aiForm")} className="...">
              <Sparkles className="mr-3" /> + Tạo với AI
            </button>
            <button onClick={() => setViewMode("manualForm")} className="...">
              <Pencil className="mr-3" /> + Tạo thủ công
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-[#041e42] mb-6">
              Bài viết gần đây
            </h3>
            <RecentPosts refreshKey={refreshKey} />
          </div>
        </div>
      );
    }
  }

  // === RENDER FORM TẠO VỚI AI ===
  if (viewMode === 'aiForm') {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <button onClick={resetAll} className="...">← Quay lại</button>
        <h1 className="text-3xl font-bold mb-6">Tạo Blog với AI</h1>
        
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('form')} className={`... ${activeTab === 'form' ? '...' : '...'}`}>Nhập liệu</button>
            <button onClick={() => setActiveTab('preview')} disabled={!finalContent} className={`... ${activeTab === 'preview' ? '...' : '...'}`}>Xem trước & Chỉnh sửa</button>
          </nav>
        </div>

        {activeTab === 'form' && (
          <form className="space-y-6" onSubmit={handleGeneratePreview}>
            {/* Form chọn loại Blog */}
            <div>
              <label htmlFor="blogType">Loại Blog</label>
              <select id="blogType" name="blogType" value={blogRequest.blogType} onChange={handleInputChange} className="...">
                <option value="topic">Chủ đề</option>
                <option value="product">Sản phẩm</option>
              </select>
            </div>
            {/* Form cho Topic Details */}
            {blogRequest.blogType === 'topic' && blogRequest.topicDetails && (
              Object.keys(blogRequest.topicDetails).map((key) => (
                <div key={key}>
                  <label htmlFor={key}>{key}</label>
                  <input type="text" id={key} name={key} value={blogRequest.topicDetails[key] || ''} onChange={handleInputChange} className="..." />
                </div>
              ))
            )}
            {/* Form cho Product Details */}
            {blogRequest.blogType === 'product' && blogRequest.productDetails && (
              Object.keys(blogRequest.productDetails).map((key) => (
                <div key={key}>
                  <label htmlFor={key}>{key}</label>
                  <input type="text" id={key} name={key} value={blogRequest.productDetails[key] || ''} onChange={handleInputChange} className="..." />
                </div>
              ))
            )}
            <button type="submit" disabled={loading} className="...">
              {loading ? 'Đang tạo...' : 'Tạo Preview'}
            </button>
          </form>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Xem trước & Chỉnh sửa</h2>
            {/* ... Form chỉnh sửa Title, Slug, Meta Description ... */}
            <div>
              <label>Nội dung Blog</label>
              <RichTextEditor value={finalContent} onChange={setFinalContent} />
            </div>
            <button onClick={handlePublish} disabled={loading} className="...">
              {loading ? 'Đang xuất bản...' : 'Xuất bản Blog'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // === RENDER FORM TẠO THỦ CÔNG ===
  if (viewMode === 'manualForm') {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <button onClick={resetAll} className="...">← Quay lại</button>
        <h1 className="text-3xl font-bold mb-6">Tạo bài viết thủ công</h1>
        
        <div className="space-y-6">
          {/* ... Form chỉnh sửa Title, Slug, Meta Description ... */}
          <div>
              <label>Nội dung Blog</label>
              <RichTextEditor value={finalContent} onChange={setFinalContent} />
          </div>
          <button onClick={handlePublish} disabled={loading} className="...">
            {loading ? 'Đang xuất bản...' : 'Xuất bản Blog'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
