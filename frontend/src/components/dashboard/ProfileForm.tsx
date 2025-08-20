import { useEffect, useState, ChangeEvent } from "react";
import { user, UserProfile } from "../../services/user";
import { Save, Phone, Mail, User, CheckCircle, AlertCircle } from "lucide-react";

export default function ProfileForm() {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    phoneNumber: "",
    email: "",
    avatar: "",
    coverUrl: "",
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
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="animate-pulse">
            <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
            <div className="p-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3].map(i => (
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
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Cover Image Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          {profile.coverUrl && (
            <img 
              src={profile.coverUrl} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        <div className="p-8">
          {/* Avatar Section */}
          <div className="flex items-end space-x-6 mb-8 -mt-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-gray-900">{profile.username || "Username"}</h1>
              <p className="text-gray-600 mt-1">Manage your profile information</p>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
              messageType === "success" 
                ? "bg-green-50 border border-green-200 text-green-800" 
                : "bg-red-50 border border-red-200 text-red-800"
            }`}>
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="font-medium">{message}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="w-full pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200 bg-white hover:border-gray-300"
                    style={{ paddingLeft: '3.5rem' }}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleChange}
                    className="w-full pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200 bg-white hover:border-gray-300"
                    style={{ paddingLeft: '3.5rem' }}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Email - Full width */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200 bg-white hover:border-gray-300"
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                value={profile.avatar}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200 bg-white hover:border-gray-300"
                placeholder="Enter avatar image URL"
              />
            </div>

            {/* Cover URL */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Cover Image URL
              </label>
              <input
                type="url"
                name="coverUrl"
                value={profile.coverUrl}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200 bg-white hover:border-gray-300"
                placeholder="Enter cover image URL"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`
                inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-white
                transition-all duration-200 transform hover:scale-105 active:scale-95
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }
              `}
            >
              <Save className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}