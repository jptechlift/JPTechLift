import { useEffect, useState, ChangeEvent } from "react";
import { user, UserProfile } from "../../services/user";
import { ROLES } from "../../constants/roles";
import { Save, Phone, Mail, User } from "lucide-react";

export default function ProfileForm() {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    phoneNumber: "",
    email: "",
    avatar: "",
    coverUrl: "",
    role: ROLES.USER,
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    user.get()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setIsInitialLoading(false));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");
    
    try {
      await user.update(profile);
      setMessage("Profile updated successfully!");
      setMessageType("success");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch {
      setMessage("Error updating profile");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
    setIsLoading(false);
  };

  if (isInitialLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="animate-pulse">
            {/* Loading header */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
            </div>
            
            {/* Loading content */}
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="bg-gradient-to-tr from-[var(--color-primary)] to-blue-700 p-3 rounded-xl shadow-lg shadow-blue-500/25">
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 tracking-tight">Thông tin cá nhân</h1>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 border border-gray-200/50">
                <span className="text-xs font-semibold text-gray-600">{profile.role || 'User'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Avatar Display Section */}
          <div className="flex items-center space-x-6 mb-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/50 -mt-12">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg shadow-gray-200/50 overflow-hidden bg-gray-100 transition-transform duration-300 group-hover:scale-105">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--color-primary)] rounded-full border-2 border-white flex items-center justify-center">
                <div className="text-white text-xs">✎</div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">{profile.username || "Chưa đặt tên"}</h2>
              <p className="text-sm text-gray-500 mt-1">{profile.email || "Chưa có email"}</p>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 border ${
              messageType === "success" 
                ? "bg-green-50 border-green-200/60 text-green-800" 
                : "bg-red-50 border-red-200/60 text-red-800"
            }`}>
              {messageType === "success" ? (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-1 bg-white rounded-full transform rotate-45 origin-center"></div>
                  <div className="w-1 h-2 bg-white rounded-full transform -rotate-45 origin-center -ml-1"></div>
                </div>
              ) : (
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">!</div>
              )}
              <span className="font-medium">{message}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Username */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full"></div>
                  Tên người dùng
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors z-10" />
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="w-full pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-all duration-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                    style={{ paddingLeft: '3.5rem' }}
                    placeholder="Nhập tên người dùng"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full"></div>
                  Số điện thoại
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors z-10" />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleChange}
                    className="w-full pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-all duration-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                    style={{ paddingLeft: '3.5rem' }}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
            </div>

            {/* Email - Full width */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full"></div>
                Địa chỉ email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors z-10" />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-all duration-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="Nhập địa chỉ email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full"></div>
                  URL Avatar
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={profile.avatar}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-gray-300 focus:ring-0 outline-none transition-all duration-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  placeholder="Nhập đường dẫn ảnh avatar"
                />
              </div>

              {/* Cover URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full"></div>
                  URL Ảnh bìa
                </label>
                <input
                  type="url"
                  name="coverUrl"
                  value={profile.coverUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-gray-300 focus:ring-0 outline-none transition-all duration-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  placeholder="Nhập đường dẫn ảnh bìa"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Save Button */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200/60 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
 
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`group inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'text-[var(--color-primary)] bg-white border border-gray-300 shadow-sm hover:bg-gradient-to-r hover:from-[var(--color-primary)] hover:to-blue-600 hover:text-white hover:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]'
              }`}
            >
              <Save className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'group-hover:scale-110 transition-transform duration-200'}`} />
              <span>{isLoading ? "Đang lưu..." : "Lưu thông tin"}</span>
              {!isLoading && (
                <div className="w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                  <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[4px] border-y-transparent"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}