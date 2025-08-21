import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProductBlogForm, { ProductDetails } from "../blog/ProductBlogForm";
import TopicBlogForm, { TopicDetails } from "./TopicBlogForm";
import RecentPosts from "./RecentPosts";
import { blog, BlogRequest } from "../../../services/blog";

const productSchema = z.object({
  productName: z.string().min(1),
  productType: z.string().min(1),
});
const topicSchema = z.object({
  topic: z.string().min(1),
  content: z.string().min(1),
});

const schema = z.object({
  blogType: z.enum(["product", "topic"]),
  productDetails: productSchema.optional(),
  topicDetails: topicSchema.optional(),
}).refine(
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
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { blogType: "product" },
  });

  const blogType = watch("blogType");
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async (data: FormValues) => {
    setLoading(true);
    setPreview("");
    try {
      const res = await blog.generatePreview(data as BlogRequest);
      setPreview(res.data.generatedContent);
    } finally {
      setLoading(false);
    }
  };

  const onPublish = async (data: FormValues) => {
    await blog.create({ ...(data as BlogRequest), content: preview });
    setPreview("");
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
            disabled={loading}
          >
            <option value="product">Product</option>
            <option value="topic">Topic</option>
          </select>
        </div>

        {blogType === "product" ? (
          <ProductBlogForm
            details={(getValues("productDetails") as ProductDetails) || { productName: "", productType: "" }}
            setDetails={(d) => setValue("productDetails", d)}
            error={errors.productDetails?.productName}
            disabled={loading}
          />
        ) : (
          <TopicBlogForm
            details={(getValues("topicDetails") as TopicDetails) || { topic: "", content: "" }}
            setDetails={(d) => setValue("topicDetails", d)}
            error={errors.topicDetails?.topic}
            disabled={loading}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          ✨ Tạo bản nháp với AI
        </button>
      </form>
      <div className="w-2/5 space-y-4">
        <div className="p-4 border rounded-xl min-h-40">
          {loading && <p>AI đang sáng tạo...</p>}
          {!loading && preview && (
            <>
              <textarea
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
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
          {!loading && !preview && (
            <p className="text-sm text-gray-500">Preview will appear here</p>
          )}
        </div>
        <RecentPosts />
      </div>
    </div>
  );
}