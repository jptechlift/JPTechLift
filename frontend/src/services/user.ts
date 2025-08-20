export interface UserProfile {
  username: string;
  phoneNumber: string;
  email: string;
  avatar: string;
  coverUrl: string;
}
import { auth } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

const toUserProfile = (data: {
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  coverUrl?: string;
}): UserProfile => ({
  username: data.name ?? "",
  phoneNumber: data.phone ?? "",
  email: data.email ?? "",
  avatar: data.avatar ?? "",
  coverUrl: data.coverUrl ?? "",
});

const fromUserProfile = (profile: UserProfile) => ({
  name: profile.username,
  phone: profile.phoneNumber,
  email: profile.email,
  avatar: profile.avatar,
  coverUrl: profile.coverUrl,
});

export const user = {
  async get(): Promise<UserProfile> {
    const token = auth.getToken();
    const res = await fetch(`${API_URL}/api/user`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to load profile");
    const data = await res.json();
    return toUserProfile(data);
  },
  async update(profile: UserProfile): Promise<UserProfile> {
    const token = auth.getToken();
    const res = await fetch(`${API_URL}/api/user`, {
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
