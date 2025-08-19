import { useEffect, useState, ChangeEvent } from "react";
import { User, Edit3, FileText, Settings, Home, Upload, Save, Camera, Phone, Mail, Globe } from "lucide-react";

// Mock services (replace with your actual services)
const user = {
  get: () =>
    Promise.resolve<UserProfile>({
      name: "John Doe",
      phone: "+84 123 456 789",
      email: "john@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      coverUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=200&fit=crop",
    }),
  update: (data: UserProfile) => Promise.resolve(data),
};

const blog = {
  create: (data: BlogPost) => Promise.resolve(data),
};

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  coverUrl: string;
}

interface BlogPost {
  title: string;
  content: string;
  imageUrl: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    phone: "",
    email: "",
    avatarUrl: "",
    coverUrl: "",
  });
  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    user
      .get()
      .then(setProfile)
      .catch(() => {});
  }, []);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await user.update(profile);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error updating profile");
    }
    setIsLoading(false);
  };

  const handleBlogChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlogImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBlogPost((prev) => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await blog.create(blogPost);
      setBlogPost({ title: "", content: "", imageUrl: "" });
      setMessage("Blog post created successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error creating blog post");
    }
    setIsLoading(false);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "profile", label: "Profile", icon: User },
    { id: "blog", label: "Blog Posts", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Message Toast */}
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-green-200 text-green-800 px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {message}
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Sidebar - 30% width */}
        <div className="w-[30%] bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-xl">
          {/* Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    profile.avatarUrl ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
                  }
                  alt="Avatar"
                  className="w-14 h-14 rounded-2xl object-cover ring-4 ring-blue-100"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-800">{profile.name || "User"}</h1>
                <p className="text-sm text-gray-500">Welcome back!</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-6">
            <div className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/25"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                        activeTab === item.id ? "text-white" : ""
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Quick Stats */}
          <div className="p-6 mt-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-2">Quick Stats</h3>
              <div className="space-y-2 text-sm opacity-90">
                <div className="flex justify-between">
                  <span>Profile Complete</span>
                  <span>85%</span>
                </div>
                <div className="flex justify-between">
                  <span>Blog Posts</span>
                  <span>12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 70% width */}
        <div className="w-[70%] overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {activeTab === "profile" && "Profile Settings"}
                {activeTab === "blog" && "Create Blog Post"}
                {activeTab === "dashboard" && "Dashboard Overview"}
                {activeTab === "settings" && "Settings"}
              </h2>
              <p className="text-gray-600">
                {activeTab === "profile" && "Manage your personal information"}
                {activeTab === "blog" && "Share your thoughts with the world"}
                {activeTab === "dashboard" && "Your activity overview"}
                {activeTab === "settings" && "Configure your preferences"}
              </p>
            </div>

            {/* Content Area */}
            {activeTab === "profile" && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                {/* Cover Photo */}
                <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden">
                  {profile.coverUrl && (
                    <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/20"></div>
                  <button className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <User className="w-4 h-4" />
                          Full Name
                        </label>
                        <input
                          name="name"
                          value={profile.name}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </label>
                        <input
                          name="phone"
                          value={profile.phone}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Globe className="w-4 h-4" />
                        Avatar URL
                      </label>
                      <input
                        name="avatarUrl"
                        value={profile.avatarUrl}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm"
                        placeholder="Enter avatar image URL"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Camera className="w-4 h-4" />
                        Cover Image URL
                      </label>
                      <input
                        name="coverUrl"
                        value={profile.coverUrl}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm"
                        placeholder="Enter cover image URL"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleProfileSubmit}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Profile Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "blog" && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Edit3 className="w-4 h-4" />
                      Blog Title
                    </label>
                    <input
                      name="title"
                      value={blogPost.title}
                      onChange={handleBlogChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm"
                      placeholder="Enter an engaging title for your blog post"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FileText className="w-4 h-4" />
                      Content
                    </label>
                    <textarea
                      name="content"
                      value={blogPost.content}
                      onChange={handleBlogChange}
                      rows={8}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm resize-none"
                      placeholder="Write your blog content here..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Upload className="w-4 h-4" />
                      Featured Image
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-all bg-white/30 backdrop-blur-sm">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBlogImage}
                        className="hidden"
                        id="blog-image"
                      />
                      <label htmlFor="blog-image" className="cursor-pointer">
                        {blogPost.imageUrl ? (
                          <div className="space-y-2">
                            <img
                              src={blogPost.imageUrl}
                              alt="Preview"
                              className="max-w-full h-48 mx-auto rounded-lg object-cover"
                            />
                            <p className="text-sm text-gray-600">Click to change image</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                            <p className="text-gray-600">Click to upload an image</p>
                            <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBlogSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Publish Blog Post
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Profile updated</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">New blog post published</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Profile Views</span>
                      <span className="font-semibold text-blue-600">1,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Blog Reads</span>
                      <span className="font-semibold text-green-600">5,678</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Application Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-800">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive email updates about your account</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-800">Dark Mode</h4>
                      <p className="text-sm text-gray-600">Switch to dark theme</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
