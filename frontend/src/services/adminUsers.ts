import { auth } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
}

export interface AdminUserCreate {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
  isActive?: boolean;
}

export interface AdminUserUpdate {
  username?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  isActive?: boolean;
}

function authHeaders() {
  const token = auth.getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const adminUsers = {
  async list(): Promise<AdminUser[]> {
    const res = await fetch(`${API_URL}/api/users`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load users");
    return res.json();
  },
  async get(id: number): Promise<AdminUser> {
    const res = await fetch(`${API_URL}/api/users/${id}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load user");
    return res.json();
  },
  async create(payload: AdminUserCreate): Promise<AdminUser> {
    const res = await fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },
  async update(id: number, payload: AdminUserUpdate): Promise<void> {
    const res = await fetch(`${API_URL}/api/users/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update user");
  },
  async remove(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/api/users/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete user");
  },
};