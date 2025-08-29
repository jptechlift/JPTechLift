export interface UserProfile {
 username: string;
  phoneNumber: string;
  email: string;
  avatar: string;
  coverUrl: string;
  role: string;
}
import { auth } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

const toUserProfile = (data: {
   username?: string;
  phoneNumber?: string;
  email?: string;
  avatarUrl?: string;
  coverUrl?: string;
  role?: string;
}): UserProfile => ({
  username: data.username ?? "",
  phoneNumber: data.phoneNumber ?? "",
  email: data.email ?? "",
  avatar: data.avatarUrl ?? "",
  coverUrl: data.coverUrl ?? "",
   role: data.role ?? "",
});

const fromUserProfile = (profile: UserProfile) => ({
  email: profile.email,
  phoneNumber: profile.phoneNumber,
  avatarUrl: profile.avatar,
  coverUrl: profile.coverUrl,
});

export const user = {
  async get(): Promise<UserProfile> {
    const token = auth.getToken();
    const res = await fetch(`${API_URL}/api/user/profile`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to load profile");
    const data = await res.json();
    return toUserProfile(data);
  },
  async update(profile: UserProfile): Promise<UserProfile> {
    const token = auth.getToken();
    const res = await fetch(`${API_URL}/api/user/profile`, {
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
