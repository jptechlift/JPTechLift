import { useEffect, useState } from "react";
import { dashboardMenu } from "../../constants/dashboardMenu";
import { UserProfile, user } from "../../services/user";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile?: UserProfile;
}

export default function Sidebar({ activeTab, setActiveTab, profile: profileProp }: SidebarProps) {
  const [profile, setProfile] = useState<UserProfile | undefined>(profileProp);

  useEffect(() => {
    if (!profileProp) {
      user.get().then(setProfile).catch(() => undefined);
    }
  }, [profileProp]);

  return (
    <div className="w-[30%] bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-xl">
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                profile?.avatar ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
              }
              alt="Avatar"
              className="w-14 h-14 rounded-2xl object-cover ring-4 ring-blue-100"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-800">{profile?.username || "User"}</h1>
            <p className="text-sm text-gray-500">Welcome back!</p>
          </div>
        </div>
      </div>

      <nav className="p-6">
        <div className="space-y-3">
          {dashboardMenu.map((item) => {
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
  );
}