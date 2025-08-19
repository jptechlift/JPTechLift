export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  coverUrl: string;
}
import { auth } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

export const user = {
  async get(): Promise<UserProfile> {
    const token = auth.getToken();
    const res = await fetch(`${API_URL}/user`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json();
  },
  async update(profile: UserProfile): Promise<UserProfile> {
    const token = auth.getToken();
    const res = await fetch(`${API_URL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },
};