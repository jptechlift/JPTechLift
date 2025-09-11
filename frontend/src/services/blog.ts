// services/blog.ts (Cập nhật và hoàn chỉnh)

import axios, { AxiosRequestConfig } from "axios"; // <-- Đảm bảo import AxiosRequestConfig
import { auth } from "./auth"; // Đảm bảo đường dẫn auth đúng

// --- INTERFACE BLOGPOST (CHO HIỂN THỊ Ở FRONTEND) ---
export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  slug: string;
  author: string;
  createdDate: string;
  updatedDate: string; // Thêm updatedDate
  isPublished: boolean; // Thêm isPublished
  viewCount: number;
  imageUrl?: string;
  tags?: string[];
  topic?: string;
  targetAudience?: string;
  mainPoints?: string;
  seoKeywords?: string;
  metaDescription?: string;
  // Thêm các trường của ProductBlog nếu bạn muốn hiển thị trực tiếp trong BlogPost
  productName?: string;
  productType?: string;
  detail?: string;
  keySellingPoints?: string;
}

// --- INTERFACE BLOGPOSTAPI (TỪ API BACKEND - TRƯỚC KHI MAP) ---
// Đây là cấu trúc phản hồi từ các API backend (GetAll, GetBySlug, Publish)
interface BlogPostApi {
  id: number; // Backend trả về id là int, frontend có thể dùng string
  title: string;
  content: string;
  slug: string;
  author: string;
  username: string; // Tên người dùng tạo blog
  createdDate: string;
  updatedDate: string;
  isPublished: boolean;
  viewCount: number;
  metaDescription: string;
  productBlog?: {
    id: number;
    blogId: number;
    productName: string;
    productType: string;
    detail: string;
    targetAudience: string;
    keySellingPoints: string;
    seoKeywords: string;
  };
  topicBlog?: {
    id: number;
    blogId: number;
    topic: string; // Khớp với TopicBlogDto.Topic
    content: string; // Có thể bị trùng lặp với Blog.Content
    targetAudience: string;
    mainPoints: string;
    seoKeywords: string;
  };
}

// --- HÀM MAP DỮ LIỆU TỪ API SANG DẠNG HIỂN THỊ (FRONTEND) ---
const mapFromApi = (data: BlogPostApi): BlogPost => ({
  id: data.id.toString(), // Chuyển id từ number sang string
  title: data.title,
  content: data.content,
  slug: data.slug,
  author: data.author,
  createdDate: data.createdDate,
  updatedDate: data.updatedDate,
  isPublished: data.isPublished,
  viewCount: data.viewCount,
  metaDescription: data.metaDescription,
  topic: data.topicBlog?.topic,
  targetAudience: data.topicBlog?.targetAudience || data.productBlog?.targetAudience, // Lấy từ topic hoặc product
  mainPoints: data.topicBlog?.mainPoints,
  seoKeywords: data.topicBlog?.seoKeywords || data.productBlog?.seoKeywords, // Lấy từ topic hoặc product
  // Thêm các trường của ProductBlog nếu muốn hiển thị
  productName: data.productBlog?.productName,
  productType: data.productBlog?.productType,
  detail: data.productBlog?.detail,
  keySellingPoints: data.productBlog?.keySellingPoints,
});


// --- INTERFACE CHO CHI TIẾT SẢN PHẨM (YÊU CẦU AI/PUBLISH) ---
// Cấu trúc này cần khớp với ProductDetails trong Backend.Dtos.Blog.ProductDetails
export type ProductDetails = {
  productName: string;
  productType: string;
  detail: string; // Đây là trường đã gộp useCases, technicalHighlights, callToAction
  targetAudience: string;
  keySellingPoints: string;
  seoKeywords: string;
  toneOfVoice: "Chuyên nghiệp & Kỹ thuật" | "Thân thiện & Thuyết phục" | "Sang trọng & Cao cấp";
  // Các trường sau có thể không cần thiết khi gửi đi nếu đã gộp vào 'detail'
  useCases?: string;
  technicalHighlights?: string;
  callToAction?: string;
};

// --- INTERFACE CHO CHI TIẾT CHỦ ĐỀ (YÊU CẦU AI/PUBLISH) ---
// Cấu trúc này cần khớp với TopicDetails trong Backend.Dtos.Blog.TopicDetails
export type TopicDetails = {
  articleTitle: string; // Frontend dùng articleTitle, Backend dùng Topic
  targetAudience: string;
  mainPoints: string;
  seoKeywords: string;
  toneOfVoice: "Hướng dẫn & Giáo dục" | "Phân tích & Chuyên gia" | "Tin tức & Cập nhật";
  angle?: string;
  callToAction?: string;
};

// --- INTERFACE CHO BLOG REQUEST (KHI GỬI ĐI) ---
// Cấu trúc này cần khớp với Backend.Dtos.Blog.BlogRequest
export type BlogRequest = {
  blogType: "product" | "topic" | "manual";
  productDetails?: ProductDetails;
  topicDetails?: TopicDetails;
  content?: string; // Nội dung cuối cùng (từ AI hoặc thủ công)
  author?: string; // Backend tự lấy từ token, nhưng có thể gửi nếu muốn ghi đè (ít dùng)
  slug?: string; // Slug cuối cùng (từ AI hoặc thủ công)
  title?: string; // Tiêu đề cuối cùng (từ AI hoặc thủ công)
  metaDescription?: string; // Meta Description cuối cùng
};

// --- INTERFACE CHO PHẢN HỒI GENERATE PREVIEW TỪ BACKEND ---
// Cấu trúc này cần khớp với đối tượng ẩn danh trả về từ BlogController.GeneratePreview
export interface GeneratedPreviewResponse {
  title: string;
  slug: string;
  generatedContent: string;
  previewUrl: string;
  metaDescription: string;
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

  async generatePreview(data: BlogRequest): Promise<GeneratedPreviewResponse> {
    const headers: Record<string, string> = {};
    const token = auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await axios.post<GeneratedPreviewResponse>(`${API_URL}/api/blog/generate-preview`, data, {
      headers,
    });
    return response.data;
  },

  async publish(data: BlogRequest): Promise<BlogPost> {
    const headers: Record<string, string> = {};
    const token = auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await axios.post<BlogPostApi>(`${API_URL}/api/blog/publish`, data, {
      headers,
    });
    return mapFromApi(response.data);
  },

  async recent(count: number = 5): Promise<BlogPost[]> {
    const headers: Record<string, string> = {};
    const token = auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const { data } = await axios.get<BlogPostApi[]>(`${API_URL}/api/blog/recent?count=${count}`, {
      headers,
    });
    return data.map(mapFromApi);
  },

  // <-- PHƯƠNG THỨC MỚI ĐỂ GỬI FILE - ĐƯỢC BỔ SUNG ĐẦY ĐỦ VÀO ĐỐI TƯỢNG blog -->
  async generateFromDocument(
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void // Callback cho tiến độ upload
  ): Promise<GeneratedPreviewResponse> {
    const headers: Record<string, string> = {};
    const token = auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const config: AxiosRequestConfig = {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data", // Quan trọng cho upload file
      },
      onUploadProgress: onUploadProgress, // Gắn callback tiến độ
    };

    const response = await axios.post<GeneratedPreviewResponse>(
      `${API_URL}/api/blog/generate-from-document`, // <-- Endpoint mới ở backend
      formData,
      config
    );
    return response.data;
  },
};