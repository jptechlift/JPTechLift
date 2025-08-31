import { useEffect, useState, FormEvent } from "react";
import {
  adminUsers,
  AdminUser,
  AdminUserCreate,
} from "../../services/adminUsers";

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminUsers.list();
      setUsers(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };
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
    setShowModal(true);
  };

  const startEdit = async (id: number) => {
    const u = await adminUsers.get(id);
    setEditing(u);
    setForm({ username: u.username, email: u.email, role: u.role, isActive: u.isActive });
    setShowModal(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminUsers.update(editing.id, {
          username: form.username,
          email: form.email,
          role: form.role,
          isActive: form.isActive,
        });
        setMessage("Cập nhật người dùng thành công!");
      } else {
        await adminUsers.create(form as AdminUserCreate);
        setMessage("Tạo người dùng thành công!");
      }
      await load();
      setShowModal(false);
      setEditing(null);
    } catch {
      setError("Đã xảy ra lỗi");
    }
  };

  const remove = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa người dùng ${user.username}? Hành động này không thể hoàn tác.`
      )
    )
      return;
    try {
      await adminUsers.remove(id);
      setMessage("Xóa người dùng thành công!");
      await load();
    } catch {
      setError("Đã xảy ra lỗi, không thể xóa người dùng.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">User Management</h1>
      {message && (
        <div className="bg-green-100 text-green-700 p-2 mb-4">{message}</div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>
      )}
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
      {loading ? (
        <div>Loading...</div>
      ) : (
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
      )}
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={submit} className="bg-white p-4 rounded space-y-3 w-full max-w-sm">
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
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
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
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}