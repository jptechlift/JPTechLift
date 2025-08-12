export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
}

const API_URL = "http://localhost:5000/api/blogs";

export const blog = {
  async list(): Promise<BlogPost[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to load blogs");
    return res.json();
  },
  async create(post: BlogPost): Promise<BlogPost> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (!res.ok) throw new Error("Failed to create blog");
    return res.json();
  },
};