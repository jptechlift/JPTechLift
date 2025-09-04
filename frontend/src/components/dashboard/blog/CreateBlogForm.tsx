import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProductBlogForm from "../blog/ProductBlogForm";
import TopicBlogForm from "./TopicBlogForm";
import RecentPosts from "./RecentPosts";
import { blog, BlogRequest } from "../../../services/blog";
import { Sparkles, Eye, Rocket, RotateCcw, FileText, Globe, Edit3 } from "lucide-react";


const productDetailsSchema = z.object({
  productName: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  productType: z.string().min(1, "Vui lòng chọn loại sản phẩm"),
  targetAudience: z.string().min(10, "Mô tả đối tượng khách hàng (ít nhất 10 ký tự)"),
  keySellingPoints: z.string().min(10, "Nêu bật ít nhất một lợi ích chính (mỗi ý một dòng)"),
  seoKeywords: z.string().min(1, "Vui lòng nhập từ khóa SEO (cách nhau bởi dấu phẩy)"),
  toneOfVoice: z.enum(["Chuyên nghiệp & Kỹ thuật", "Thân thiện & Thuyết phục", "Sang trọng & Cao cấp"]),
  useCases: z.string().optional(),
  technicalHighlights: z.string().optional(),
  callToAction: z.string().optional(),
});

const topicDetailsSchema = z.object({
  articleTitle: z.string().min(10, "Tiêu đề bài viết cần ít nhất 10 ký tự"),
  targetAudience: z.string().min(10, "Mô tả đối tượng độc giả (ít nhất 10 ký tự)"),
  mainPoints: z.string().min(20, "Vui lòng phác thảo các ý chính (ít nhất 20 ký tự)"),
  seoKeywords: z.string().min(1, "Vui lòng nhập từ khóa SEO (cách nhau bởi dấu phẩy)"),
  toneOfVoice: z.enum(["Hướng dẫn & Giáo dục", "Phân tích & Chuyên gia", "Tin tức & Cập nhật"]),
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
    (data) => (data.blogType === "product" && data.productDetails) || (data.blogType === "topic" && data.topicDetails),
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
  const [activeTab, setActiveTab] = useState<"form" | "preview" | "recent">("form");
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
      console.error("%c[!!!] Frontend: API call failed!", "color: red; font-weight: bold;", error);
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { status: number; data: unknown } }).response
      ) {
        const err = error as { response: { status: number; data: unknown } };
        console.error("Error details:", { status: err.response.status, data: err.response.data });
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
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Blog Creation Interface</h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">Create and manage your blog content efficiently.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`blog-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "form" ? "active border-b-2 font-semibold" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`blog-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "preview" ? "active border-b-2 font-semibold" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recent")}
            className={`blog-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "recent" ? "active border-b-2 font-semibold" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
                <label className="text-base font-medium text-[var(--color-text-primary)]" htmlFor="blogType">
                  Form Type
                </label>
                <p className="text-sm text-[var(--color-text-secondary)]">Select the type of content you want to create.</p>
                <fieldset className="mt-4">
                  <legend className="sr-only">Form type</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`relative bg-white border rounded-lg p-4 flex flex-col cursor-pointer focus:outline-none ${
                        blogType === "product" ? "ring-2 ring-[var(--color-primary)] shadow-md" : "border-gray-300"
                      }`}
                    >
                      <input type="radio" value="product" {...register("blogType")} className="sr-only" />
                      <div className="flex-1 flex flex-col items-center text-center">
                        <FileText
                          className={`text-4xl mb-2 ${
                            blogType === "product" ? "text-[var(--color-primary)]" : "text-gray-400"
                          }`}
                        />
                        <span className="block text-sm font-medium text-[var(--color-text-primary)]">Product</span>
                        <span className="block text-xs text-[var(--color-text-secondary)] mt-1">
                          Generate post from product details.
                        </span>
                      </div>
                      {blogType === "product" && (
                        <span className="absolute top-4 right-4 text-[var(--color-primary)]">
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
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
                        blogType === "topic" ? "ring-2 ring-[var(--color-primary)] shadow-md" : "border-gray-300"
                      }`}
                    >
                      <input type="radio" value="topic" {...register("blogType")} className="sr-only" />
                      <div className="flex-1 flex flex-col items-center text-center">
                        <Edit3
                          className={`text-4xl mb-2 ${
                            blogType === "topic" ? "text-[var(--color-primary)]" : "text-gray-400"
                          }`}
                        />
                        <span className="block text-sm font-medium text-[var(--color-text-primary)]">Topic</span>
                        <span className="block text-xs text-[var(--color-text-secondary)] mt-1">
                          Create post from a topic.
                        </span>
                      </div>
                      {blogType === "topic" && (
                        <span className="absolute top-4 right-4 text-[var(--color-primary)]">
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
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
                  <ProductBlogForm register={register} errors={errors} disabled={isSubmitting} />
                ) : (
                  <TopicBlogForm register={register} errors={errors} disabled={isSubmitting} />
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
          <div className="bg-white rounded-xl shadow-lg p-8">
            {isSubmitting && (
              <div className="text-center py-16">
                <div className="flex justify-center items-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">AI is generating content...</h3>
                <p className="text-[var(--color-text-secondary)] mt-2">Please wait a moment, your content is being created.</p>
              </div>
            )}

            {!isSubmitting && finalContent && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Tiêu đề
                    </label>
                    <input
                      value={finalTitle}
                      onChange={(e) => setFinalTitle(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      URL
                    </label>
                    <input
                      value={finalSlug}
                      onChange={(e) => setFinalSlug(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-300 font-mono text-sm"
                    />
                    {previewUrl && (
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm text-[var(--color-primary)] underline mt-1 inline-block ${
                          isPublishing ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        {previewUrl}
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Nội dung
                  </label>
                  <textarea
                    value={finalContent}
                    onChange={(e) => setFinalContent(e.target.value)}
                    className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-300 resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSubmit(onPublish)}
                    disabled={isPublishing}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isPublishing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang xuất bản...</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5" />
                          <span>Xuất bản</span>
                        </>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={handleSubmit(onGenerate)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      <span>Thử lại</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {!isSubmitting && !finalContent && (
              <div className="text-center py-16">
                <span className="material-icons-outlined text-5xl text-gray-400 block mb-4">inbox</span>
                <h4 className="text-lg font-semibold text-[var(--color-text-primary)]">No Content</h4>
                <p className="text-[var(--color-text-secondary)] mt-1">No blog posts have been generated.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "recent" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Recently Generated Posts</h3>
            <RecentPosts refreshKey={refreshKey} />
          </div>
        )}
      </div>
    </div>
  );
}