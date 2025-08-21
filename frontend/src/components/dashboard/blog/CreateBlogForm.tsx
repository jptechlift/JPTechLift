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
    <div className="flex gap-4">
      <form
        onSubmit={handleSubmit(onGenerate)}
        className="space-y-6 w-3/5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Type
          </label>
          <select
            {...register("blogType")}
            className="p-3 rounded-xl border border-gray-200"
            disabled={isSubmitting}
          >
            <option value="product">Product</option>
            <option value="topic">Topic</option>
          </select>
        </div>

        {blogType === "product" ? (
          <ProductBlogForm register={register} errors={errors} disabled={isSubmitting} />
        ) : (
          <TopicBlogForm register={register} errors={errors} disabled={isSubmitting} />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          ✨ Tạo bản nháp với AI
        </button>
      </form>
      <div className="w-2/5 space-y-4">
        <div className="p-4 border rounded-xl min-h-40">
          {isSubmitting && <p>AI đang sáng tạo...</p>}
          {!isSubmitting && finalContent && (
            <>
              <input
                value={finalTitle}
                onChange={(e) => setFinalTitle(e.target.value)}
                className="w-full p-2 border rounded-md mb-2"
                placeholder="Tiêu đề bài viết"
              />
              <input
                value={finalSlug}
                onChange={(e) => setFinalSlug(e.target.value)}
                className="w-full p-2 border rounded-md mb-2"
                placeholder="Đường dẫn bài viết"
              />
              <textarea
                value={finalContent}
                onChange={(e) => setFinalContent(e.target.value)}
                className="w-full h-48 border p-2"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSubmit(onPublish)}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl"
                  type="button"
                >
                  Lưu & Xuất bản
                </button>
                <button
                  onClick={handleSubmit(onGenerate)}
                  className="bg-gray-200 px-4 py-2 rounded-xl"
                  type="button"
                >
                  Thử lại
                </button>
              </div>
            </>
          )}
          {!isSubmitting && !finalContent && (
            <p className="text-sm text-gray-500">Preview will appear here</p>
          )}
        </div>
        <RecentPosts />
      </div>
    </div>
  );
}