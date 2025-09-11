import { useState, useEffect } from "react"; // <-- Import useEffect
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProductBlogForm from "./ProductBlogForm";
import TopicBlogForm from "./TopicBlogForm";
import BlogEditorPreview from "./BlogEditorPreview";
import { blog, BlogRequest, GeneratedPreviewResponse } from "../../../services/blog";
import { Sparkles, Eye, ArrowLeft, FileText } from "lucide-react";
import { generateSlug } from "../../../services/SlugHelper"; // Đảm bảo đường dẫn đúng

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
      message: "Vui lòng cung cấp đầy đủ chi tiết cho loại blog đã chọn.",
      path: ["blogType"],
    }
  );

export type FormValues = z.infer<typeof schema>;

interface AiBlogCreationWorkflowProps {
  onPublishSuccess: () => void;
  onBack: () => void;
}

export default function AiBlogCreationWorkflow({
  onPublishSuccess,
  onBack,
}: AiBlogCreationWorkflowProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting: isGenerating },
    clearErrors, // <-- IMPORT clearErrors
    setValue,     // <-- IMPORT setValue
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { blogType: "product" },
  });
  const blogType = watch("blogType");

  // --- THÊM useEffect ĐỂ XÓA DỮ LIỆU VÀ LỖI KHI CHUYỂN LOẠI BLOG ---
  useEffect(() => {
    if (blogType === "product") {
      // Nếu chuyển sang Product, xóa dữ liệu và lỗi của TopicDetails
      setValue("topicDetails", undefined, { shouldValidate: false });
      clearErrors("topicDetails");
    } else if (blogType === "topic") {
      // Nếu chuyển sang Topic, xóa dữ liệu và lỗi của ProductDetails
      setValue("productDetails", undefined, { shouldValidate: false });
      clearErrors("productDetails");
    }
  }, [blogType, setValue, clearErrors]); // Thêm dependencies

  const [originalFormDetails, setOriginalFormDetails] = useState<FormValues | null>(null);

  const [finalTitle, setFinalTitle] = useState("");
  const [finalSlug, setFinalSlug] = useState("");
  const [finalContent, setFinalContent] = useState("");
  const [finalMetaDescription, setFinalMetaDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const onGenerate = async (data: FormValues) => {
    console.log("onGenerate called with data:", data);

    setFinalTitle("");
    setFinalSlug("");
    setFinalContent("");
    setFinalMetaDescription("");
    setPreviewUrl("");
    setActiveTab("preview");
    setOriginalFormDetails(data);

    try {
      const payload: BlogRequest = {
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
      };

      console.log("Sending payload to generatePreview:", payload);
      const res: GeneratedPreviewResponse = await blog.generatePreview(payload);
      console.log("Received response from generatePreview:", res);

      setFinalTitle(res.title);
      setFinalSlug(res.slug);
      setFinalContent(res.generatedContent);
      setFinalMetaDescription(res.metaDescription);
      setPreviewUrl(res.previewUrl);
    } catch (error: unknown) {
      console.error(
        "%c[!!!] Frontend: AI generation API call failed!",
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
        alert(`Lỗi khi tạo nội dung với AI: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else {
          alert("Lỗi không xác định khi tạo nội dung với AI. Vui lòng kiểm tra console.");
      }
      setFinalTitle("Lỗi");
      setFinalContent("Không thể tạo nội dung. Vui lòng thử lại.");
      setFinalMetaDescription("Lỗi khi tạo mô tả meta.");
      setFinalSlug(generateSlug("Error generating content"));
    }
  };

  const onPublish = async () => {
    setIsPublishing(true);
    try {
      if (!originalFormDetails) {
        console.error("Original form details missing for publishing.");
        alert("Lỗi: Không có dữ liệu gốc để xuất bản. Vui lòng tạo lại nội dung.");
        return;
      }

      const payload: BlogRequest = {
        blogType: originalFormDetails.blogType,
        productDetails:
          originalFormDetails.blogType === "product" && originalFormDetails.productDetails
            ? {
                ...originalFormDetails.productDetails,
                detail: [
                  originalFormDetails.productDetails.useCases,
                  originalFormDetails.productDetails.technicalHighlights,
                  originalFormDetails.productDetails.callToAction,
                ].filter(Boolean).join("\n"),
              }
            : undefined,
        topicDetails:
          originalFormDetails.blogType === "topic" && originalFormDetails.topicDetails
            ? {
                ...originalFormDetails.topicDetails,
            }
            : undefined,
        title: finalTitle,
        slug: finalSlug,
        content: finalContent,
        metaDescription: finalMetaDescription,
      };

      console.log("Sending payload to publish:", payload);
      await blog.publish(payload);
      console.log("Blog published successfully.");
      alert("Bài viết đã được xuất bản thành công!");
      onPublishSuccess();
    } catch (error: unknown) {
      console.error(
        "%c[!!!] Frontend: Publishing API call failed!",
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
        alert(`Xuất bản blog thất bại: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else {
          alert("Xuất bản blog thất bại. Vui lòng kiểm tra console để biết chi tiết lỗi.");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Tạo Blog với AI
        </h2>
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </button>
      </div>

      <nav className="relative flex space-x-0 border-b border-gray-200" aria-label="Tabs">
          <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`relative flex-1 text-center py-3 px-4 text-sm font-medium transition-all duration-300 ease-in-out z-10
                  ${activeTab === "form"
                      ? "bg-[var(--color-primary)] text-white rounded-t-lg shadow-md"
                      : "text-gray-700 hover:text-[var(--color-primary)] bg-gray-50 hover:bg-white border-b border-gray-200"
                  }
                  ${(isPublishing || isGenerating) ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={isPublishing || isGenerating}
          >
              Nhập liệu & Chọn loại Blog
              {activeTab === "form" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--color-primary)]" />
              )}
          </button>
          <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`relative flex-1 text-center py-3 px-4 text-sm font-medium transition-all duration-300 ease-in-out z-10
                  ${activeTab === "preview"
                      ? "bg-[var(--color-primary)] text-white rounded-t-lg shadow-md"
                      : "text-gray-700 hover:text-[var(--color-primary)] bg-gray-50 hover:bg-white border-b border-gray-200"
                  }
                  ${(isPublishing || isGenerating) ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={isPublishing || isGenerating}
          >
              Xem trước & Chỉnh sửa
              {activeTab === "preview" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--color-primary)]" />
              )}
          </button>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-200" />
      </nav>

      {activeTab === "form" && (
        <form onSubmit={handleSubmit(onGenerate)} className="space-y-8">
          <div>
            <label
              className="text-base font-medium text-[var(--color-text-primary)]"
              htmlFor="blogType"
            >
              Loại Form
            </label>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Chọn loại nội dung bạn muốn tạo.
            </p>
            <fieldset className="mt-4">
              <legend className="sr-only">Loại form</legend>
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
                    disabled={isGenerating}
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
                      Sản phẩm
                    </span>
                    <span className="block text-xs text-[var(--color-text-secondary)] mt-1">
                      Tạo bài viết từ chi tiết sản phẩm.
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
                    disabled={isGenerating}
                  />
                  <div className="flex-1 flex flex-col items-center text-center">
                    <Sparkles
                      className={`text-4xl mb-2 ${
                        blogType === "topic"
                          ? "text-[var(--color-primary)]"
                          : "text-gray-400"
                      }`}
                    />
                    <span className="block text-sm font-medium text-[var(--color-text-primary)]">
                      Chủ đề
                    </span>
                    <span className="block text-xs text-[var(--color-text-secondary)] mt-1">
                      Tạo bài viết từ một chủ đề.
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
            {/* Hiển thị lỗi xác thực chung cho chi tiết form */}
            {errors.blogType && (
              <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                <span>{errors.blogType.message}</span>
              </p>
            )}
            {/* Hiển thị lỗi cụ thể của productDetails nếu có */}
            {blogType === "product" && errors.productDetails && (
              <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                <span>{errors.productDetails.productName?.message || errors.productDetails.productType?.message || errors.productDetails.targetAudience?.message || errors.productDetails.keySellingPoints?.message || errors.productDetails.seoKeywords?.message || "Lỗi chi tiết sản phẩm."}</span>
              </p>
            )}
             {/* Hiển thị lỗi cụ thể của topicDetails nếu có */}
            {blogType === "topic" && errors.topicDetails && (
              <p className="mt-2 text-xs text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-lg">
                <span>{errors.topicDetails.articleTitle?.message || errors.topicDetails.targetAudience?.message || errors.topicDetails.mainPoints?.message || errors.topicDetails.seoKeywords?.message || "Lỗi chi tiết chủ đề."}</span>
              </p>
            )}
          </div>

          <div className="space-y-8">
            {blogType === "product" ? (
              <ProductBlogForm
                register={register}
                errors={errors}
                disabled={isGenerating}
              />
            ) : (
              <TopicBlogForm
                register={register}
                errors={errors}
                disabled={isGenerating}
              />
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="submit"
              disabled={isGenerating || isPublishing}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-blue-900 px-6 py-3 text-base font-medium text-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:from-blue-900 hover:to-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  AI đang tạo...
                </span>
              ) : (
                <span className="flex items-center">
                  <Sparkles className="mr-2" />
                  Tạo với AI
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
                Xem trước kết quả
              </button>
            )}
          </div>
        </form>
      )}

      {activeTab === "preview" && (
        <BlogEditorPreview
          isGenerating={isGenerating}
          isPublishing={isPublishing}
          title={finalTitle}
          setTitle={setFinalTitle}
          slug={finalSlug}
          setSlug={setFinalSlug}
          content={finalContent}
          setContent={setFinalContent}
          metaDescription={finalMetaDescription}
          setMetaDescription={setFinalMetaDescription}
          previewUrl={previewUrl}
          onPublish={onPublish}
          onGenerate={handleSubmit(onGenerate)}
          isAIGenerated={true}
        />
      )}
    </div>
  );
}