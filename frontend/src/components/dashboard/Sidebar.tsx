import clsx from "clsx";
import { dashboardMenu } from "../../constants/dashboardMenu";
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

  const isAdmin = profile?.role === "admin";
  const adminOnly = ["blog", "admin-users"];
  const menuItems = dashboardMenu.filter(
    (item) => !adminOnly.includes(item.id) || isAdmin
  );

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
          "absolute inset-y-0 left-0 z-50 w-64 transform bg-primary text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-center border-b border-white/10">
          <h1 className="ml-3 text-xl font-bold">JPTechLift</h1>
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
                      "sidebar-link flex w-full items-center rounded-md px-4 py-2",
                      isActive
                        ? "bg-accent text-white"
                        : "text-white/80 hover:bg-white/10"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="ml-3">{item.label}</span>
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

