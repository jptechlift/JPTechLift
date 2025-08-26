import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProductBlogForm from "../blog/ProductBlogForm";
import TopicBlogForm from "./TopicBlogForm";
import RecentPosts from "./RecentPosts";
import { blog, BlogRequest } from "../../../services/blog";
import { ChevronDown, Sparkles, Eye, Rocket, RotateCcw, FileText, Globe, Edit3 } from "lucide-react";

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
        title: finalTitle,
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Compact Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Tạo Blog với AI
                </h1>
                <p className="text-sm text-gray-500">Sáng tạo nội dung chất lượng cao</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setActiveTab("form")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "form"
                    ? "bg-white text-blue-600 shadow-lg font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Form</span>
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "preview"
                    ? "bg-white text-purple-600 shadow-lg font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
                {finalContent && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
              </button>
              <button
                onClick={() => setActiveTab("recent")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "recent"
                    ? "bg-white text-orange-600 shadow-lg font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Gần đây</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Section */}
        <div className={`transition-all duration-500 ${activeTab === "form" ? "w-full" : "w-0 overflow-hidden"}`}>
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <form
                onSubmit={handleSubmit(onGenerate)}
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
              >
                {/* Blog Type Selection - Compact */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🎯</span>
                      </div>
                      <label className="text-lg font-semibold text-gray-800">Loại Blog</label>
                    </div>
                    <div className="flex-1 relative max-w-sm">
                      <select
                        {...register("blogType")}
                        className="w-full p-3 pr-10 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 appearance-none cursor-pointer"
                        disabled={isSubmitting}
                      >
                        <option value="product">📦 Sản phẩm</option>
                        <option value="topic">📝 Chủ đề</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Dynamic Form Content - Scrollable */}
                <div className="max-h-96 overflow-y-auto p-6">
                  <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-4 border border-blue-100/50">
                    {blogType === "product" ? (
                      <ProductBlogForm register={register} errors={errors} disabled={isSubmitting} />
                    ) : (
                      <TopicBlogForm register={register} errors={errors} disabled={isSubmitting} />
                    )}
                  </div>
                </div>

                {/* Action Bar - Fixed at bottom */}
                <div className="bg-gray-50 border-t border-gray-100 p-6">
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold px-6 py-4 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>AI đang tạo...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <Sparkles className="w-5 h-5" />
                          <span>Tạo với AI</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>

                    {finalContent && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("preview")}
                        className="px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center gap-2"
                      >
                        <Eye className="w-5 h-5" />
                        <span className="hidden sm:inline">Xem kết quả</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className={`transition-all duration-500 ${activeTab === "preview" ? "w-full" : "w-0 overflow-hidden"}`}>
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden h-full">
                {/* Preview Header */}
                <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="w-6 h-6 text-white" />
                    <h3 className="text-white font-bold text-lg">Xem trước kết quả</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("form")}
                    className="text-white/80 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/10"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Preview Content */}
                <div className="p-6 h-full overflow-y-auto">
                  {isSubmitting && (
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                      <div className="relative mb-6">
                        <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div
                          className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-2 left-2"
                          style={{ animationDirection: "reverse" }}
                        ></div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-blue-600 font-bold">🧠 AI đang sáng tạo...</p>
                        <div className="flex items-center justify-center gap-1 mt-4">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </div>
                      </div>
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
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
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
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-mono text-sm"
                          />
                           {previewUrl && (
                            <a
                              href={previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm text-blue-600 underline mt-1 inline-block ${
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
                          className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
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
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                      <div className="text-6xl mb-4 opacity-20">🎨</div>
                      <div className="space-y-3">
                        <h4 className="text-xl font-semibold text-gray-600">Chưa có nội dung</h4>
                        <p className="text-gray-500">Hãy tạo nội dung từ form để xem trước</p>
                        <button
                          onClick={() => setActiveTab("form")}
                          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Quay lại Form
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className={`transition-all duration-500 ${activeTab === "recent" ? "w-full" : "w-0 overflow-hidden"}`}>
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-white" />
                    <h3 className="text-white font-bold text-lg">Bài viết gần đây</h3>
                  </div>
                </div>
                <div className="p-6 h-full overflow-y-auto">
                <RecentPosts refreshKey={refreshKey} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
