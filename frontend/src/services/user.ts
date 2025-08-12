export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  coverUrl: string;
}

const API_URL = "http://localhost:5000/api/user";

export const user = {
  async get(): Promise<UserProfile> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json();
  },
  async update(profile: UserProfile): Promise<UserProfile> {
    const res = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },
};