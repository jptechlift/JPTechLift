import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProductBlogForm from "../blog/ProductBlogForm";
import TopicBlogForm from "./TopicBlogForm";
import RecentPosts from "./RecentPosts";
import { blog, BlogRequest } from "../../../services/blog";
import {
  Sparkles,
  Eye,
  Rocket,
  RotateCcw,
  FileText,
  Globe,
  Edit3,
  ExternalLink,
} from "lucide-react";

const productDetailsSchema = z.object({
  productName: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  productType: z.string().min(1, "Vui lòng chọn loại sản phẩm"),
  targetAudience: z
    .string()
    .min(10, "Mô tả đối tượng khách hàng (ít nhất 10 ký tự)"),
  keySellingPoints: z
    .string()
    .min(10, "Nêu bật ít nhất một lợi ích chính (mỗi ý một dòng)"),
  seoKeywords: z
    .string()
    .min(1, "Vui lòng nhập từ khóa SEO (cách nhau bởi dấu phẩy)"),
  toneOfVoice: z.enum([
    "Chuyên nghiệp & Kỹ thuật",
    "Thân thiện & Thuyết phục",
    "Sang trọng & Cao cấp",
  ]),
  useCases: z.string().optional(),
  technicalHighlights: z.string().optional(),
  callToAction: z.string().optional(),
});

const topicDetailsSchema = z.object({
  articleTitle: z.string().min(10, "Tiêu đề bài viết cần ít nhất 10 ký tự"),
  targetAudience: z
    .string()
    .min(10, "Mô tả đối tượng độc giả (ít nhất 10 ký tự)"),
  mainPoints: z
    .string()
    .min(20, "Vui lòng phác thảo các ý chính (ít nhất 20 ký tự)"),
  seoKeywords: z
    .string()
    .min(1, "Vui lòng nhập từ khóa SEO (cách nhau bởi dấu phẩy)"),
  toneOfVoice: z.enum([
    "Hướng dẫn & Giáo dục",
    "Phân tích & Chuyên gia",
    "Tin tức & Cập nhật",
  ]),
  angle: z.string().optional(),
  callToAction: z.string().optional(),
});

const schema = z
  .object({
    blogType: z.enum(["product", "topic"]),
    productDetails: productDetailsSchema.optional(),
    topicDetails: topicDetailsSchema.optional(),
  })
  .refine(
    (data) =>
      (data.blogType === "product" && data.productDetails) ||
      (data.blogType === "topic" && data.topicDetails),
    {
      message: "Details are required",
      path: ["productDetails"],
    }
  );

export type FormValues = z.infer<typeof schema>;

export default function CreateBlogForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { blogType: "product" },
  });
  const blogType = watch("blogType");
  const [finalTitle, setFinalTitle] = useState("");
  const [finalSlug, setFinalSlug] = useState("");
  const [finalContent, setFinalContent] = useState("");
  const [activeTab, setActiveTab] = useState<"form" | "preview" | "recent">(
    "form"
  );
  const [previewUrl, setPreviewUrl] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);

  const onGenerate = async (data: FormValues) => {
    setFinalTitle("");
    setFinalSlug("");
    setFinalContent("");
    setPreviewUrl("");
    setActiveTab("preview");

    try {
      const payload = {
        blogType: data.blogType,
        productDetails:
          data.blogType === "product" && data.productDetails
            ? {
                productName: data.productDetails.productName,
                productType: data.productDetails.productType,
                detail: [
                  data.productDetails.useCases,
                  data.productDetails.technicalHighlights,
                  data.productDetails.callToAction,
                ]
                  .filter(Boolean)
                  .join("\n"),
                targetAudience: data.productDetails.targetAudience,
                keySellingPoints: data.productDetails.keySellingPoints,
                seoKeywords: data.productDetails.seoKeywords,
                toneOfVoice: data.productDetails.toneOfVoice,
              }
            : undefined,
        topicDetails:
          data.blogType === "topic" && data.topicDetails
            ? {
                articleTitle: data.topicDetails.articleTitle,
                targetAudience: data.topicDetails.targetAudience,
                mainPoints: data.topicDetails.mainPoints,
                seoKeywords: data.topicDetails.seoKeywords,
                toneOfVoice: data.topicDetails.toneOfVoice,
              }
            : undefined,
      } as BlogRequest;

      const res = await blog.generatePreview(payload);

      setFinalTitle(res.data.title);
      setFinalSlug(res.data.slug);
      setFinalContent(res.data.generatedContent);
      setPreviewUrl(res.data.previewUrl);
    } catch (error: unknown) {
      console.error(
        "%c[!!!] Frontend: API call failed!",
        "color: red; font-weight: bold;",
        error
      );
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { status: number; data: unknown } }).response
      ) {
        const err = error as { response: { status: number; data: unknown } };
        console.error("Error details:", {
          status: err.response.status,
          data: err.response.data,
        });
      }
    }
  };

  const onPublish = async (data: FormValues) => {
    setIsPublishing(true);
    try {
      const payload = {
        blogType: data.blogType,
        productDetails:
          data.blogType === "product" && data.productDetails
            ? {
                productName: data.productDetails.productName,
                productType: data.productDetails.productType,
                detail: [
                  data.productDetails.useCases,
                  data.productDetails.technicalHighlights,
                  data.productDetails.callToAction,
                ]
                  .filter(Boolean)
                  .join("\n"),
                targetAudience: data.productDetails.targetAudience,
                keySellingPoints: data.productDetails.keySellingPoints,
                seoKeywords: data.productDetails.seoKeywords,
                toneOfVoice: data.productDetails.toneOfVoice,
              }
            : undefined,
        topicDetails:
          data.blogType === "topic" && data.topicDetails
            ? {
                articleTitle: data.topicDetails.articleTitle,
                targetAudience: data.topicDetails.targetAudience,
                mainPoints: data.topicDetails.mainPoints,
                seoKeywords: data.topicDetails.seoKeywords,
                toneOfVoice: data.topicDetails.toneOfVoice,
              }
            : undefined,
        slug: finalSlug,
        content: finalContent,
      } as BlogRequest;

      await blog.create(payload);
      setRefreshKey((k) => k + 1);
      setActiveTab("recent");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          Blog Creation Interface
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Create and manage your blog content efficiently.
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`blog-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "form"
                ? "active border-b-2 font-semibold"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`blog-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "preview"
                ? "active border-b-2 font-semibold"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recent")}
            className={`blog-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "recent"
                ? "active border-b-2 font-semibold"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Recent Posts
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === "form" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit(onGenerate)} className="space-y-8">
              <div>
                <label
                  className="text-base font-medium text-[var(--color-text-primary)]"
                  htmlFor="blogType"
                >
                  Form Type
                </label>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Select the type of content you want to create.
                </p>
                <fieldset className="mt-4">
                  <legend className="sr-only">Form type</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`relative bg-white border rounded-lg p-4 flex flex-col cursor-pointer focus:outline-none ${
                        blogType === "product"
                          ? "ring-2 ring-[var(--color-primary)] shadow-md"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value="product"
                        {...register("blogType")}
                        className="sr-only"
                      />
                      <div className="flex-1 flex flex-col items-center text-center">
                        <FileText
                          className={`text-4xl mb-2 ${
                            blogType === "product"
                              ? "text-[var(--color-primary)]"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="block text-sm font-medium text-[var(--color-text-primary)]">
                          Product
                        </span>
                        <span className="block text-xs text-[var(--color-text-secondary)] mt-1">
                          Generate post from product details.
                        </span>
                      </div>
                      {blogType === "product" && (
                        <span className="absolute top-4 right-4 text-[var(--color-primary)]">
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </label>
                    <label
                      className={`relative bg-white border rounded-lg p-4 flex flex-col cursor-pointer focus:outline-none ${
                        blogType === "topic"
                          ? "ring-2 ring-[var(--color-primary)] shadow-md"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value="topic"
                        {...register("blogType")}
                        className="sr-only"
                      />
                      <div className="flex-1 flex flex-col items-center text-center">
                        <Edit3
                          className={`text-4xl mb-2 ${
                            blogType === "topic"
                              ? "text-[var(--color-primary)]"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="block text-sm font-medium text-[var(--color-text-primary)]">
                          Topic
                        </span>
                        <span className="block text-xs text-[var(--color-text-secondary)] mt-1">
                          Create post from a topic.
                        </span>
                      </div>
                      {blogType === "topic" && (
                        <span className="absolute top-4 right-4 text-[var(--color-primary)]">
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </label>
                  </div>
                </fieldset>
              </div>

              <div className="space-y-8">
                {blogType === "product" ? (
                  <ProductBlogForm
                    register={register}
                    errors={errors}
                    disabled={isSubmitting}
                  />
                ) : (
                  <TopicBlogForm
                    register={register}
                    errors={errors}
                    disabled={isSubmitting}
                  />
                )}
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-blue-900 px-6 py-3 text-base font-medium text-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:from-blue-900 hover:to-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      AI đang tạo...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Sparkles className="mr-2" />
                      Generate with AI
                    </span>
                  )}
                </button>
                {finalContent && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-red-500 px-6 py-3 text-base font-medium text-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:from-red-500 hover:to-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]"
                  >
                    <Eye className="mr-2" />
                    Preview Result
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === "preview" && (
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-lg shadow-[#041e42]/10 transition-all duration-500 hover:shadow-xl hover:shadow-[#041e42]/15">
            <div className="p-6 sm:p-8">
              {/* Header Section */}
              <div className="mb-8 animate-fadeIn">
                <h2 className="text-2xl font-bold text-[#041e42] mb-2 transition-colors duration-300">
                  Content Preview
                </h2>
                <p className="text-gray-600 transition-colors duration-300">
                  Xem trước và chỉnh sửa nội dung trước khi xuất bản
                </p>
              </div>

              {/* Loading State */}
              {isSubmitting && (
                <div className="text-center py-16 animate-fadeIn">
                  <div className="relative mb-8">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#041e42] to-[#041e42]/80 rounded-full flex items-center justify-center opacity-90 animate-pulse">
                      <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-[#041e42]/20 rounded-full animate-ping" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#041e42] mb-3 animate-slideUp">
                    AI đang tạo nội dung...
                  </h3>
                  <p
                    className="text-gray-600 max-w-md mx-auto leading-relaxed animate-slideUp"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Hệ thống đang phân tích thông tin và tạo nội dung chất lượng
                    cao, tối ưu SEO cho bạn.
                  </p>
                  <div className="mt-8 flex justify-center">
                    <div
                      className="bg-[#fafaf9] rounded-full px-6 py-2 animate-bounceIn"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#041e42] rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-[#d64344] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#cba052] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Form */}
              {!isSubmitting && finalContent && (
                <div className="space-y-8 animate-fadeIn">
                  {/* Meta Information Section */}
                  <section className="transform transition-all duration-500 hover:translate-y-[-2px]">
                    <h3 className="text-lg font-semibold text-[#041e42] mb-4 pb-2 border-b border-gray-200 transition-colors duration-300">
                      Thông tin bài viết
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Title Field */}
                      <div className="group">
                        <label
                          htmlFor="final_title"
                          className="flex items-center text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-hover:text-[#041e42]"
                        >
                          <FileText className="w-4 h-4 mr-2 text-[#041e42] transition-transform duration-200 group-hover:scale-110" />
                          <span>Tiêu đề bài viết</span>
                          <span className="text-gray-500 text-xs ml-2 bg-[#fafaf9] px-2 py-1 rounded transition-all duration-200 group-hover:bg-[#041e42]/10 group-hover:text-[#041e42]">
                            SEO optimized
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            id="final_title"
                            value={finalTitle}
                            onChange={(e) => setFinalTitle(e.target.value)}
                            className="block w-full px-4 py-3 text-sm rounded-sm border border-gray-200 bg-white hover:border-[#041e42]/30 focus:border-[#041e42] focus:ring-2 focus:ring-[#041e42]/20 transition-all duration-300 transform hover:scale-[1.01]"
                            placeholder="Nhập tiêu đề bài viết..."
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#041e42]/5 to-transparent rounded-sm opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                        <div className="mt-1 text-xs text-gray-500 transition-all duration-200 group-hover:text-[#041e42]/70">
                          Độ dài:{" "}
                          <span
                            className={`font-medium ${
                              finalTitle.length >= 50 && finalTitle.length <= 60
                                ? "text-green-600"
                                : finalTitle.length > 60
                                ? "text-[#d64344]"
                                : "text-[#cba052]"
                            }`}
                          >
                            {finalTitle.length}
                          </span>{" "}
                          ký tự
                          <span className="ml-1 text-gray-400">
                            (khuyến nghị: 50-60 ký tự)
                          </span>
                        </div>
                      </div>

                      {/* Slug Field */}
                      <div className="group">
                        <label
                          htmlFor="final_slug"
                          className="flex items-center text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-hover:text-[#041e42]"
                        >
                          <Globe className="w-4 h-4 mr-2 text-[#041e42] transition-transform duration-200 group-hover:scale-110" />
                          <span>Đường dẫn URL</span>
                          <span className="text-gray-500 text-xs ml-2 bg-[#fafaf9] px-2 py-1 rounded transition-all duration-200 group-hover:bg-[#041e42]/10 group-hover:text-[#041e42]">
                            SEO friendly
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            id="final_slug"
                            value={finalSlug}
                            onChange={(e) => setFinalSlug(e.target.value)}
                            className="block w-full px-4 py-3 text-sm rounded-sm border border-gray-200 bg-white hover:border-[#041e42]/30 focus:border-[#041e42] focus:ring-2 focus:ring-[#041e42]/20 transition-all duration-300 font-mono transform hover:scale-[1.01]"
                            placeholder="duong-dan-url-bai-viet"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#041e42]/5 to-transparent rounded-sm opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                        {previewUrl && (
                          <div className="mt-2 animate-slideDown">
                            <a
                              href={previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm text-[#041e42] hover:text-[#d64344] underline inline-block transition-all duration-300 hover:translate-x-1 ${
                                isPublishing
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }`}
                            >
                              {previewUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Content Editor Section */}
                  <section className="transform transition-all duration-500 hover:translate-y-[-2px]">
                    <h3 className="text-lg font-semibold text-[#041e42] mb-4 pb-2 border-b border-gray-200 transition-colors duration-300">
                      Nội dung bài viết
                    </h3>
                    <div className="group">
                      <label
                        htmlFor="final_content"
                        className="flex items-center text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-hover:text-[#041e42]"
                      >
                        <Edit3 className="w-4 h-4 mr-2 text-[#041e42] transition-transform duration-200 group-hover:scale-110" />
                        <span>Nội dung</span>
                        <span className="text-gray-500 text-xs ml-2 bg-[#fafaf9] px-2 py-1 rounded transition-all duration-200 group-hover:bg-[#041e42]/10 group-hover:text-[#041e42]">
                          Markdown
                        </span>
                      </label>
                      <div className="relative">
                        <textarea
                          id="final_content"
                          value={finalContent}
                          onChange={(e) => setFinalContent(e.target.value)}
                          rows={16}
                          className="block w-full px-4 py-3 text-sm rounded-sm border border-gray-200 bg-white hover:border-[#041e42]/30 focus:border-[#041e42] focus:ring-2 focus:ring-[#041e42]/20 transition-all duration-300 resize-none font-mono leading-relaxed transform hover:scale-[1.005]"
                          placeholder="Nội dung bài viết sẽ hiển thị ở đây..."
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#041e42]/5 via-transparent to-[#d64344]/5 rounded-sm opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500 transition-all duration-200 group-hover:text-[#041e42]/70">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span>Từ:</span>
                            <span className="font-medium text-[#041e42]">
                              {
                                finalContent
                                  .split(" ")
                                  .filter((word) => word.length > 0).length
                              }
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>Ký tự:</span>
                            <span className="font-medium text-[#041e42]">
                              {finalContent.length}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>Dòng:</span>
                            <span className="font-medium text-[#041e42]">
                              {finalContent.split("\n").length}
                            </span>
                          </span>
                        </div>
                        <div className="text-gray-400 group-hover:text-[#041e42]/50 transition-colors duration-200">
                          Hỗ trợ định dạng Markdown
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSubmit(onPublish)}
                      disabled={isPublishing}
                      className="flex-1 inline-flex items-center justify-center rounded-sm bg-gradient-to-r from-[#041e42] to-[#041e42]/90 px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-[#041e42]/30 hover:from-[#041e42]/90 hover:to-[#041e42] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#041e42] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isPublishing ? (
                        <span className="flex items-center animate-pulse">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Đang xuất bản...
                        </span>
                      ) : (
                        <span className="flex items-center group">
                          <Rocket className="mr-2 w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" />
                          Xuất bản bài viết
                        </span>
                      )}
                    </button>

                    <button
                      onClick={handleSubmit(onGenerate)}
                      disabled={isPublishing}
                      className="flex-1 inline-flex items-center justify-center rounded-sm bg-white border-2 border-[#bfbfbf] px-6 py-3 text-base font-medium text-[#041e42] shadow-lg transition-all duration-300 ease-in-out hover:bg-[#fafaf9] hover:border-[#041e42] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#041e42] disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="flex items-center group">
                        <RotateCcw className="mr-2 w-5 h-5 transition-transform duration-200 group-hover:rotate-180" />
                        Tạo lại nội dung
                      </span>
                    </button>
                  </div>

                  {/* Publishing Status */}
                  {isPublishing && (
                    <div className="flex items-center p-4 bg-gradient-to-r from-[#fafaf9] to-white border-2 border-[#041e42]/20 rounded-sm animate-slideDown shadow-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#041e42]/10 to-[#041e42]/20 rounded-full flex items-center justify-center mr-3 animate-pulse">
                          <div className="w-4 h-4 border-2 border-[#041e42] border-t-transparent rounded-full animate-spin" />
                        </div>
                        <div>
                          <div className="text-sm text-[#041e42] font-semibold animate-pulse">
                            Đang xuất bản bài viết...
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Nội dung đang được xử lý và sẽ có sẵn trong giây lát
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!isSubmitting && !finalContent && (
                <div className="text-center py-16 animate-fadeIn">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#fafaf9] to-[#bfbfbf]/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:scale-110 hover:rotate-6">
                    <Eye className="w-8 h-8 text-[#bfbfbf] transition-colors duration-300 hover:text-[#041e42]" />
                  </div>
                  <h4 className="text-lg font-semibold text-[#041e42] mb-3 animate-slideUp">
                    Chưa có nội dung để xem trước
                  </h4>
                  <p
                    className="text-gray-600 leading-relaxed max-w-md mx-auto animate-slideUp"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Hãy điền thông tin sản phẩm trong form và tạo nội dung trước
                    khi xem trước.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "recent" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
              Recently Generated Posts
            </h3>
            <RecentPosts refreshKey={refreshKey} />
          </div>
        )}
      </div>
    </div>
  );
}
