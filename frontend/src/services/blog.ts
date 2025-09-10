// services/blog.ts (Cập nhật)

import axios from "axios";
import { auth } from "./auth";

// --- INTERFACE BLOGPOST (CHO HIỂN THỊ Ở FRONTEND) ---
export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  slug: string;
  author: string;
  createdDate: string;
  viewCount: number;
  imageUrl?: string;
  tags?: string[];
  topic?: string;
  targetAudience?: string;
  mainPoints?: string;
  seoKeywords?: string;
  metaDescription?: string; // <-- THÊM: Meta Description cho hiển thị
}

// --- INTERFACE BLOGPOSTAPI (TỪ API BACKEND) ---
interface BlogPostApi {
  id?: string;
  title: string;
  content: string;
  slug: string;
  author: string;
  createdDate: string;
  viewCount: number;
  imageUrl?: string;
  tags?: string[];
  metaDescription?: string; // <-- THÊM: Meta Description từ API Backend
  topicBlog?: {
    topic: string;
    content: string;
    targetAudience: string;
    mainPoints: string;
    seoKeywords: string;
  };
  productBlog?: { // <-- THÊM: Có thể có ProductBlog nếu bạn muốn hiển thị chi tiết sản phẩm
    productName: string;
    productType: string;
    detail: string;
    targetAudience: string;
    keySellingPoints: string;
    seoKeywords: string;
  };
}

// --- HÀM MAP DỮ LIỆU TỪ API SANG DẠNG HIỂN THỊ ---
const mapFromApi = (data: BlogPostApi): BlogPost => ({
  id: data.id,
  title: data.title,
  content: data.content,
  slug: data.slug,
  author: data.author,
  createdDate: data.createdDate,
  viewCount: data.viewCount,
  imageUrl: data.imageUrl,
  tags: data.tags,
  topic: data.topicBlog?.topic,
  targetAudience: data.topicBlog?.targetAudience,
  mainPoints: data.topicBlog?.mainPoints,
  seoKeywords: data.topicBlog?.seoKeywords,
  metaDescription: data.metaDescription, // <-- THÊM: Ánh xạ metaDescription
});

// --- INTERFACE CHO CHI TIẾT SẢN PHẨM ---
export type ProductDetails = {
  productName: string;
  productType: string;
  detail: string;
  targetAudience: string;
  keySellingPoints: string;
  seoKeywords: string;
  toneOfVoice: "Chuyên nghiệp & Kỹ thuật" | "Thân thiện & Thuyết phục" | "Sang trọng & Cao cấp";
  useCases?: string;
  technicalHighlights?: string;
  callToAction?: string;
};

// --- INTERFACE CHO CHI TIẾT CHỦ ĐỀ ---
export type TopicDetails = {
  articleTitle: string;
  targetAudience: string;
  mainPoints: string;
  seoKeywords: string;
  toneOfVoice: "Hướng dẫn & Giáo dục" | "Phân tích & Chuyên gia" | "Tin tức & Cập nhật";
  angle?: string;
  callToAction?: string;
};

// --- INTERFACE CHO BLOG REQUEST (KHI GỬI ĐI) ---
export type BlogRequest = {
  blogType: "product" | "topic";
  productDetails?: ProductDetails;
  topicDetails?: TopicDetails;
  content?: string; // final content when publishing
  author?: string;
  slug?: string;
  title?: string; // <-- THÊM: Tiêu đề đã chỉnh sửa
  metaDescription?: string; // <-- THÊM: Meta Description đã chỉnh sửa
};

// --- INTERFACE CHO PHẢN HỒI GENERATE PREVIEW TỪ BACKEND ---
export interface GeneratedPreviewResponse {
  title: string;
  slug: string;
  generatedContent: string; // <-- Đã đổi tên
  previewUrl: string;
  metaDescription: string; // <-- THÊM: Meta Description từ AI
}


// --- CẤU HÌNH API URL ---
const rawApiUrl = import.meta.env.VITE_API_URL;
const API_URL = (() => {
  if (!rawApiUrl) {
    console.warn("VITE_API_URL is missing. Falling back to http://localhost:5000");
    return "http://localhost:5000";
  }
  try {
    return new URL(rawApiUrl).origin;
  } catch {
    console.warn(`VITE_API_URL "${rawApiUrl}" is malformed. Falling back to http://localhost:5000`);
    return "http://localhost:5000";
  }
})();

// --- CÁC PHƯƠNG THỨC GỌI API ---
export const blog = {
  async list(): Promise<BlogPost[]> {
    const { data } = await axios.get<BlogPostApi[]>(`${API_URL}/api/blogs`);
    return data.map(mapFromApi);
  },

  async get(slug: string): Promise<BlogPost> {
    const { data } = await axios.get<BlogPostApi>(`${API_URL}/api/blog/${slug}`);
    return mapFromApi(data);
  },

  // Sửa lại kiểu trả về và cách xử lý
  async generatePreview(data: BlogRequest): Promise<GeneratedPreviewResponse> {
    const headers: Record<string, string> = {};
    const token = auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await axios.post<GeneratedPreviewResponse>(`${API_URL}/api/blog/generate-preview`, data, {
      headers,
    });
    return response.data; // Trả về trực tiếp data
  },

  // Đã đổi tên phương thức từ 'create' thành 'publish'
  async publish(data: BlogRequest): Promise<BlogPost> { // Trả về BlogPost sau khi tạo thành công
    const headers: Record<string, string> = {};
    const token = auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await axios.post<BlogPostApi>(`${API_URL}/api/blog/publish`, data, { // Backend trả về BlogPostApi
      headers,
    });
    return mapFromApi(response.data); // Map dữ liệu từ API về BlogPost frontend
  },

   async recent(): Promise<BlogPost[]> {
    const headers: Record<string, string> = {};
    const token = auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const { data } = await axios.get<BlogPostApi[]>(`${API_URL}/api/blog/recent`, {
      headers,
    });
    return data.map(mapFromApi);
  },
};