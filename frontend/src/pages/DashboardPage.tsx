import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import ProfileForm from "../components/dashboard/ProfileForm";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import SettingsPanel from "../components/dashboard/SettingsPanel";
import CreateBlogForm from "../components/dashboard/blog/CreateBlogForm";
import { user, UserProfile } from "../services/user";
import TopBar from "../components/dashboard/TopBar";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    user
      .get()
      .then(setProfile)
      .catch(() => undefined);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileForm />;
      case "blog":
        return <CreateBlogForm />;
      case "settings":
        return <SettingsPanel />;
      case "dashboard":
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        isMobileOpen={isSidebarOpen}
        onMobileToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-col flex-1">
        <TopBar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-8">{renderContent()}</main>
      </div>
    </div>
  );
}
