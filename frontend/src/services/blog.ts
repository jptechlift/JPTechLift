import axios from "axios";

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export type ProductDetails = {
  productName: string;
  productType: string;
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
    console.warn(
      "VITE_API_URL is missing. Falling back to http://localhost:5000"
    );
    return "http://localhost:5000";
  }
  try {
    return new URL(rawApiUrl).origin;
  } catch {
    console.warn(
      `VITE_API_URL "${rawApiUrl}" is malformed. Falling back to http://localhost:5000`
    );
    return "http://localhost:5000";
  }
})();

export const blog = {
  async list(): Promise<BlogPost[]> {
    const res = await fetch(`${API_URL}/blogs`);
    if (!res.ok) throw new Error("Failed to load blogs");
    return res.json();
  },

  generatePreview(data: BlogRequest) {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/api/blog/generate-preview`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  create(data: BlogRequest) {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/api/blog`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  recent() {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/api/blog/recent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
