export interface UserProfile {
  username: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  coverUrl: string;
}
import { auth } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

const toUserProfile = (data: any): UserProfile => ({
  username: data.username ?? "",
  phoneNumber: data.phoneNumber ?? "",
  email: data.email ?? "",
  avatarUrl: data.avatarUrl ?? "",
  coverUrl: data.coverUrl ?? "",
});

const fromUserProfile = (profile: UserProfile) => ({
  email: profile.email,
  phoneNumber: profile.phoneNumber,
  avatarUrl: profile.avatarUrl,
  coverUrl: profile.coverUrl,
});

export const user = {
  async get(): Promise<UserProfile> {
    const token = auth.getToken();
    const res = await fetch(`${API_URL}/user`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to load profile");
    const data = await res.json();
    return toUserProfile(data);
  },
  async update(profile: UserProfile): Promise<UserProfile> {
    const token = auth.getToken();
    const res = await fetch(`${API_URL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(fromUserProfile(profile)),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    const data = await res.json();
    return toUserProfile(data);
  },
};
