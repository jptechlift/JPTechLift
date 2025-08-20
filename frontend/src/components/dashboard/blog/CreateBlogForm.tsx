import { useState } from "react";
import ProductBlogForm, { ProductDetails } from "../blog/ProductBlogForm";
import TopicBlogForm, { TopicDetails } from "./TopicBlogForm";
import { blog, BlogRequest } from "../../../services/blog";

export default function CreateBlogForm() {
  const [blogType, setBlogType] = useState<"product" | "topic">("product");
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    productName: "",
    productType: "",
  });
  const [topicDetails, setTopicDetails] = useState<TopicDetails>({
    topic: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: BlogRequest = { blogType };
    if (blogType === "product") {
      payload.productDetails = productDetails;
    } else {
      payload.topicDetails = topicDetails;
    }
    await blog.create(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Blog Type</label>
        <select
          value={blogType}
          onChange={(e) => setBlogType(e.target.value as "product" | "topic")}
          className="p-3 rounded-xl border border-gray-200"
        >
          <option value="product">Product</option>
          <option value="topic">Topic</option>
        </select>
      </div>

      {blogType === "product" ? (
        <ProductBlogForm details={productDetails} setDetails={setProductDetails} />
      ) : (
        <TopicBlogForm details={topicDetails} setDetails={setTopicDetails} />
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
      >
        Create Blog
      </button>
    </form>
  );
}