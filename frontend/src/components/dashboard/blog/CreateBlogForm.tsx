import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProductBlogForm from "../blog/ProductBlogForm";
import TopicBlogForm from "./TopicBlogForm";
import RecentPosts from "./RecentPosts";
import { blog, BlogRequest } from "../../../services/blog";

const productDetailsSchema = z.object({
  productName: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  productType: z.string().min(1, "Vui lòng chọn loại sản phẩm"),
  targetAudience: z.string().min(10, "Mô tả đối tượng khách hàng (ít nhất 10 ký tự)"),
  keySellingPoints: z.string().min(10, "Nêu bật ít nhất một lợi ích chính (mỗi ý một dòng)"),
  seoKeywords: z.string().min(1, "Vui lòng nhập từ khóa SEO (cách nhau bởi dấu phẩy)"),
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
articleTitle: z
    .string()
    .min(10, "Tiêu đề bài viết cần ít nhất 10 ký tự"),
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

  const onGenerate = async (data: FormValues) => {
    // --- VERIFICATION LOGGING ---
    console.log(
      "%c[1/4] Frontend: Event handler 'onGenerate' triggered.",
      "color: blue; font-weight: bold;"
    );

    setFinalTitle("");
    setFinalSlug("");
    setFinalContent("");

    // --- VERIFICATION LOGGING ---
    console.log(
      "%c[2/4] Frontend: Form data prepared for API call:",
      "color: blue; font-weight: bold;",
      data
    );

    try {
      console.log("Attempting to call API: /api/blog/generate-preview...");
      const res = await blog.generatePreview(data as BlogRequest);

      // --- VERIFICATION LOGGING ---
      console.log(
        "%c[4/4] Frontend: API call successful! Response received:",
        "color: green; font-weight: bold;",
        res.data
      );

      setFinalTitle(res.data.title);
      setFinalSlug(res.data.slug);
      setFinalContent(res.data.generatedContent);
    } catch (error: unknown) {
      // --- VERIFICATION LOGGING (for debugging if the fix fails) ---
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
    await blog.create({
      ...(data as BlogRequest),
      title: finalTitle,
      slug: finalSlug,
      content: finalContent,
    });
    setFinalTitle("");
    setFinalSlug("");
    setFinalContent("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Tạo Blog với AI
          </h1>
          <p className="text-gray-600 text-lg">Sáng tạo nội dung chất lượng cao với sức mạnh trí tuệ nhân tạo</p>
        </div>

        <div className="flex gap-8">
          {/* Form Section - Enhanced UI */}
          <div className="w-3/5">
            <form
              onSubmit={handleSubmit(onGenerate)}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-8"
            >
              {/* Blog Type Selection - Enhanced */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  🎯 Loại Blog
                </label>
                <div className="relative">
                  <select
                    {...register("blogType")}
                    className="w-full p-4 pr-10 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-800 font-medium appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    <option value="product">📦 Sản phẩm - Giới thiệu & Review</option>
                    <option value="topic">📝 Chủ đề - Bài viết chuyên môn</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Dynamic Form Content - Enhanced Container */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                {blogType === "product" ? (
                  <ProductBlogForm register={register} errors={errors} disabled={isSubmitting} />
                ) : (
                  <TopicBlogForm register={register} errors={errors} disabled={isSubmitting} />
                )}
              </div>

              {/* Generate Button - Enhanced */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold px-8 py-5 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg">🤖 AI đang sáng tạo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-xl">✨</span>
                      <span className="text-lg">Tạo bản nháp với AI</span>
                    </div>
                  )}
                  
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section - Enhanced UI */}
          <div className="w-2/5 space-y-6">
            {/* Preview Card - Enhanced */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
                <h3 className="text-white font-bold text-xl flex items-center gap-3">
                  <span className="text-2xl">👀</span>
                  <span>Xem trước kết quả</span>
                </h3>
              </div>
              
              {/* Preview Content */}
              <div className="p-6 min-h-96">
                {isSubmitting && (
                  <div className="flex flex-col items-center justify-center h-80 text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-2 left-2 animate-reverse"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-blue-600 font-bold text-lg">🧠 AI đang sáng tạo...</p>
                      <p className="text-gray-500">Đang phân tích và tạo nội dung</p>
                      <div className="flex items-center justify-center gap-1 mt-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isSubmitting && finalContent && (
                  <div className="space-y-5">
                    {/* Title Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        📝 Tiêu đề bài viết
                      </label>
                      <input
                        value={finalTitle}
                        onChange={(e) => setFinalTitle(e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-medium"
                        placeholder="Nhập tiêu đề bài viết..."
                      />
                    </div>
                    
                    {/* Slug Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        🔗 Đường dẫn URL
                      </label>
                      <input
                        value={finalSlug}
                        onChange={(e) => setFinalSlug(e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-mono text-sm"
                        placeholder="duong-dan-bai-viet"
                      />
                    </div>
                    
                    {/* Content Textarea */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        📄 Nội dung bài viết
                      </label>
                      <textarea
                        value={finalContent}
                        onChange={(e) => setFinalContent(e.target.value)}
                        className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
                        placeholder="Nội dung sẽ được tạo tự động..."
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSubmit(onPublish)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold px-6 py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        type="button"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg">🚀</span>
                          <span>Xuất bản</span>
                        </div>
                      </button>
                      <button
                        onClick={handleSubmit(onGenerate)}
                        className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-bold px-6 py-4 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        type="button"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg">🔄</span>
                          <span>Thử lại</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
                
                {!isSubmitting && !finalContent && (
                  <div className="flex flex-col items-center justify-center h-80 text-center">
                    <div className="text-8xl mb-6 opacity-20">🎨</div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-semibold text-gray-600">Sẵn sàng tạo nội dung</h4>
                      <p className="text-gray-500">Điền thông tin và nhấn "Tạo bản nháp" để bắt đầu</p>
                      <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
                        <span>⚡</span>
                        <span>Được hỗ trợ bởi AI</span>
                        <span>⚡</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Posts - Enhanced */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span>📚</span>
                  <span>Bài viết gần đây</span>
                </h3>
              </div>
              <div className="p-4">
                <RecentPosts />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}