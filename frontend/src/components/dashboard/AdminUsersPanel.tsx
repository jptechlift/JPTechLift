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

  // Auto dismiss messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

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
    }  catch (err) {
      setError((err as Error).message);
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
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #041e42 0%, #1e3a8a 100%)' }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 256 256">
                <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.27,98.63a8,8,0,0,1-11.29.74A80,80,0,0,0,172,168a8,8,0,0,1,0-16,96,96,0,0,1,66.27,37.37A8,8,0,0,1,250.27,206.63ZM172,96a44,44,0,1,1-16.18,84.87,59.78,59.78,0,0,0-27.64,0A44,44,0,0,1,172,96Z"/>
              </svg>
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
              <p className="text-gray-600 mt-1">Quản lý tài khoản và phân quyền người dùng hệ thống</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div 
            className="mb-6 p-4 rounded-xl shadow-lg border-l-4 border-green-400 animate-fade-in"
            style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)' }}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="ml-3 text-green-800 font-medium">{message}</p>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 p-4 rounded-xl shadow-lg border-l-4 border-red-400 animate-fade-in"
            style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fef2f2 100%)' }}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="ml-3 text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Toolbar */}
          <div 
            className="px-6 py-4 border-b border-slate-200"
            style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
                />
              </div>
              <button
                onClick={startCreate}
                className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-white"
                style={{ background: 'linear-gradient(135deg, #041e42 0%, #1e3a8a 100%)' }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm người dùng
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#041e42' }}></div>
                <span className="ml-3 text-slate-600 font-medium">Đang tải dữ liệu...</span>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thông tin người dùng</th>
                        <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai trò</th>
                        <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paged.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                                style={{ background: 'linear-gradient(135deg, #041e42 0%, #1e3a8a 100%)' }}
                              >
                                <span className="text-white font-semibold text-sm">
                                  {user.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">{user.username}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                              user.role === 'admin' 
                                ? 'text-white' 
                                : 'bg-gray-100 text-gray-700'
                            }`} style={user.role === 'admin' ? { background: 'linear-gradient(135deg, #d64344 0%, #dc2626 100%)' } : {}}>
                              {user.role === 'admin' && (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                              {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center">
                              <span className={`inline-block w-3 h-3 rounded-full ${
                                user.isActive ? 'bg-green-400' : 'bg-gray-300'
                              }`}></span>
                              <span className={`ml-2 text-sm font-medium ${
                                user.isActive ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => startEdit(user.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => remove(user.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-4 py-3 bg-slate-50 rounded-xl">
                    <div className="text-sm text-gray-600">
                      Hiển thị {(page - 1) * PAGE_SIZE + 1} đến {Math.min(page * PAGE_SIZE, filtered.length)} trong {filtered.length} kết quả
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="p-2 text-slate-600 hover:bg-white rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                            page === i + 1
                              ? 'text-white shadow-md'
                              : 'text-slate-600 hover:bg-white'
                          }`}
                          style={page === i + 1 ? { background: '#041e42' } : {}}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="p-2 text-slate-600 hover:bg-white rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform scale-100 transition-all duration-300">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editing ? `Chỉnh sửa ${editing.username}` : "Thêm người dùng mới"}
              </h3>
            </div>
            
            <form onSubmit={submit} className="p-6 space-y-6">
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Tên người dùng
                </label>
                <input
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập tên người dùng"
                  value={form.username || ""}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập địa chỉ email"
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {!editing && (
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập mật khẩu"
                    value={form.password || ""}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600">
                  Vai trò
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive ?? false}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-900">Kích hoạt tài khoản</span>
              </label>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-white"
                  style={{ background: 'linear-gradient(135deg, #041e42 0%, #1e3a8a 100%)' }}
                >
                  {editing ? "Cập nhật" : "Tạo mới"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors duration-200"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}