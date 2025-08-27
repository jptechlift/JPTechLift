import axios from "axios";
import { auth } from "./auth";

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
}

interface BlogPostApi {
  id?: string;
  title: string;
  content: string;
  slug: string;
  author: string;
  created_date: string;
  view_count: number;
  image_url?: string;
  tags?: string[];
  topic_blog?: {
    topic: string;
    content: string;
    target_audience: string;
    main_points: string;
    seo_keywords: string;
  };
}

const mapFromApi = (data: BlogPostApi): BlogPost => ({
  id: data.id,
  title: data.title,
  content: data.content,
  slug: data.slug,
  author: data.author,
  createdDate: data.created_date,
  viewCount: data.view_count,
  imageUrl: data.image_url,
  tags: data.tags,
  topic: data.topic_blog?.topic,
  targetAudience: data.topic_blog?.target_audience,
  mainPoints: data.topic_blog?.main_points,
  seoKeywords: data.topic_blog?.seo_keywords,
});

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

export type TopicDetails = {
  articleTitle: string;
  targetAudience: string;
  mainPoints: string;
  seoKeywords: string;
  toneOfVoice: "Hướng dẫn & Giáo dục" | "Phân tích & Chuyên gia" | "Tin tức & Cập nhật";
  angle?: string;
  callToAction?: string;
};


export type BlogRequest = {
  blogType: "product" | "topic";
  productDetails?: ProductDetails;
  topicDetails?: TopicDetails;
  title?: string;
  slug?: string;
  content?: string; // final content when publishing
};

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

export const blog = {
  async list(): Promise<BlogPost[]> {
    const { data } = await axios.get<BlogPostApi[]>(`${API_URL}/api/blogs`);
    return data.map(mapFromApi);
  },

  async get(slug: string): Promise<BlogPost> {
    const { data } = await axios.get<BlogPostApi>(`${API_URL}/api/blog/${slug}`);
    return mapFromApi(data);
  },
  
   generatePreview(data: BlogRequest) {
    const headers: Record<string, string> = {};
    const token = auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return axios.post(`${API_URL}/api/blog/generate-preview`, data, {
      headers,
    });
  },

  create(data: BlogRequest) {
    const headers: Record<string, string> = {};
    const token = auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return axios.post(`${API_URL}/api/blog`, data, {
      headers,
    });
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
