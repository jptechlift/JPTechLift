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
};

export type TopicDetails = {
  topic: string;
  content: string;
};

export type BlogRequest = {
  blogType: "product" | "topic";
  productDetails?: ProductDetails;
  topicDetails?: TopicDetails;
  content?: string; // final content when publishing
};

const API_URL = import.meta.env.VITE_API_URL;

export const blog = {
  
  async list(): Promise<BlogPost[]> {
    const res = await fetch(`${API_URL}/blogs`);
    if (!res.ok) throw new Error("Failed to load blogs");
    return res.json();
  },

  generatePreview(data: BlogRequest) {
    const token = localStorage.getItem("token");
    return axios.post("http://localhost:5000/api/blog/generate-preview", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  create(data: BlogRequest) {
    const token = localStorage.getItem("token");
    return axios.post("http://localhost:5000/api/blog", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  recent() {
    const token = localStorage.getItem("token");
    return axios.get("http://localhost:5000/api/blog/recent", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
