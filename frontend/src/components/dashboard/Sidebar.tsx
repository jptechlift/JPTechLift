import clsx from "clsx";
import { dashboardMenu } from "../../constants/dashboardMenu";
import { ROLES } from "../../constants/roles";
import { UserProfile, user } from "../../services/user";
import { useEffect, useState } from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile?: UserProfile;
  /** Whether sidebar is visible on mobile */
  isMobileOpen: boolean;
  /** Toggle sidebar visibility on mobile */
  onMobileToggle: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  profile: profileProp,
  isMobileOpen,
  onMobileToggle,
}: SidebarProps) {
  const [profile, setProfile] = useState<UserProfile | undefined>(profileProp);

  useEffect(() => {
    if (!profileProp) {
      user.get().then(setProfile).catch(() => undefined);
    }
  }, [profileProp]);

  const isAdmin = profile?.role === ROLES.ADMIN;
  const isAuthor = profile?.role === ROLES.AUTHOR;
  const menuItems = dashboardMenu.filter((item) => {
    if (item.id === "admin-users") return isAdmin;
    if (item.id === "blog") return isAdmin || isAuthor;
    return true;
  });

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onMobileToggle}
        />
      )}

      <aside
        id="sidebar"
        className={clsx(
          "absolute inset-y-0 left-0 z-30 w-64 transform bg-primary text-white/90 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 -translate-x-full shadow-lg",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-20 items-center justify-center border-b border-white/10 px-6">
          <h1 className="text-xl font-bold tracking-wider">
            JPTech<span className="text-accent">Lift</span>
          </h1>
        </div>

        <nav className="mt-8 px-4">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="mb-2">
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 768) onMobileToggle();
                    }}
                    className={clsx(
                      "sidebar-link flex w-full items-center rounded-lg px-4 py-3 transition-colors duration-150",
                      isActive
                        ? "bg-accent text-white shadow-[0_0_15px_rgba(214,67,68,0.5)]"
                        : "text-white/90 hover:bg-white/10"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="ml-4 font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}