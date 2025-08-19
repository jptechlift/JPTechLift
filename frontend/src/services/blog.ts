export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
}
import { auth } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

export const blog = {
  async list(): Promise<BlogPost[]> {
    const res = await fetch(`${API_URL}/blogs`);
    if (!res.ok) throw new Error("Failed to load blogs");
    return res.json();
  },
  async create(post: BlogPost): Promise<BlogPost> {
    const token = auth.getToken();
    const res = await fetch(`${API_URL}/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(post),
    });
    if (!res.ok) throw new Error("Failed to create blog");
    return res.json();
  },
};