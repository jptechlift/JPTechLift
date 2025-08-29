import { useEffect, useState, FormEvent } from "react";
import {
  adminUsers,
  AdminUser,
  AdminUserCreate,
} from "../services/adminUsers";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<Partial<AdminUserCreate>>({
    username: "",
    email: "",
    password: "",
    role: "user",
    isActive: true,
  });

  const load = () => adminUsers.list().then(setUsers);
  useEffect(() => {
    load();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startCreate = () => {
    setEditing(null);
    setForm({ username: "", email: "", password: "", role: "user", isActive: true });
  };

  const startEdit = async (id: number) => {
    const u = await adminUsers.get(id);
    setEditing(u);
    setForm({ username: u.username, email: u.email, role: u.role, isActive: u.isActive });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      await adminUsers.update(editing.id, {
        role: form.role,
        isActive: form.isActive,
      });
    } else {
      await adminUsers.create(form as AdminUserCreate);
    }
    await load();
    startCreate();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete user?")) return;
    await adminUsers.remove(id);
    await load();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">User Management</h1>
      <div className="mb-4 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="border p-2 flex-1"
        />
        <button
          onClick={startCreate}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Add User
        </button>
      </div>
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Username</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Active</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 text-center">{u.role}</td>
              <td className="p-2 text-center">
                {u.isActive ? "Yes" : "No"}
              </td>
              <td className="p-2 text-center space-x-2">
                <button
                  onClick={() => startEdit(u.id)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(u.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mb-8 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border ${page === i + 1 ? "bg-gray-200" : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="max-w-md space-y-3">
        <h2 className="text-xl">
          {editing ? `Edit ${editing.username}` : "Add User"}
        </h2>
        <input
          className="border p-2 w-full"
          placeholder="Username"
          value={form.username || ""}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        {!editing && (
          <input
            type="password"
            className="border p-2 w-full"
            placeholder="Password"
            value={form.password || ""}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        )}
        <select
          className="border p-2 w-full"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive ?? false}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active
        </label>
        <div className="space-x-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2"
          >
            Save
          </button>
          {editing && (
            <button
              type="button"
              onClick={startCreate}
              className="px-4 py-2 border"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}