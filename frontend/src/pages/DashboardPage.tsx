import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import ProfileForm from "../components/dashboard/ProfileForm";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import SettingsPanel from "../components/dashboard/SettingsPanel";
import CreateBlogForm from "../components/dashboard/blog/BlogCreatePage";
import AdminUsersPanel from "../components/dashboard/AdminUsersPanel";
import { user, UserProfile } from "../services/user";
import { ROLES } from "../constants/roles";
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

  useEffect(() => {
    if (profile) {
      if (activeTab === "admin-users" && profile.role !== ROLES.ADMIN) {
        setActiveTab("dashboard");
      }
      if (
        activeTab === "blog" &&
        profile.role !== ROLES.ADMIN &&
        profile.role !== ROLES.AUTHOR
      ) {
        setActiveTab("dashboard");
      }
    }
  }, [profile, activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileForm />;
      case "blog":
        return profile &&
          (profile.role === ROLES.ADMIN || profile.role === ROLES.AUTHOR) ? (
          <CreateBlogForm />
        ) : (
          <DashboardOverview />
        );
      case "admin-users":
        return profile?.role === ROLES.ADMIN ? (
          <AdminUsersPanel />
        ) : (
          <DashboardOverview />
        );
      case "settings":
        return <SettingsPanel />;
      case "dashboard":
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-light">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        isMobileOpen={isSidebarOpen}
        onMobileToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-col flex-1">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          profile={profile}
        />
        <main className="flex-1 overflow-y-auto p-8">{renderContent()}</main>
      </div>
    </div>
  );
}
