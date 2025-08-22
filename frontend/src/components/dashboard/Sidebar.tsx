import { useEffect, useState } from "react";
import { dashboardMenu } from "../../constants/dashboardMenu";
import { UserProfile, user } from "../../services/user";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp } from "lucide-react";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    if (!profileProp) {
      user.get().then(setProfile).catch(() => undefined);
    }
  }, [profileProp]);

  const widthClass = isCollapsed ? "w-20" : "w-80";

  return (
    <>
      {/* Enhanced overlay with blur effect */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={onMobileToggle}
        />
      )}
      
      <div
        className={clsx(
          "bg-gradient-to-br from-slate-50/95 via-white/95 to-blue-50/95 backdrop-blur-2xl border-r border-slate-200/60 shadow-2xl shadow-slate-900/10 h-full fixed md:relative z-50 transition-all duration-500 ease-out",
          widthClass,
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Enhanced header section */}
        <div className={clsx(
          "relative border-b border-gradient-to-r from-transparent via-slate-200/40 to-transparent transition-all duration-500",
          isCollapsed ? "p-4 flex justify-center" : "p-8"
        )}>
          <div className={clsx(
            "flex items-center transition-all duration-500",
            isCollapsed ? "flex-col gap-0" : "gap-5"
          )}>
            <div className="relative group">
              {/* Animated ring effect */}
              <div className={clsx(
                "absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse opacity-75 group-hover:opacity-100 transition-all duration-500",
                isCollapsed ? "rounded-full" : "rounded-3xl"
              )} />
              <div className={clsx(
                "absolute inset-0.5 bg-white transition-all duration-500",
                isCollapsed ? "rounded-full" : "rounded-3xl"
              )} />
              <img
                src={
                  profile?.avatar ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                }
                alt="Avatar"
                className={clsx(
                  "relative object-cover transition-all duration-500 group-hover:scale-105",
                  isCollapsed ? "w-12 h-12 rounded-full" : "w-16 h-16 rounded-3xl"
                )}
              />
              {/* Enhanced status indicator */}
              <div className={clsx(
                "absolute bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-3 border-white shadow-lg transition-all duration-500",
                isCollapsed ? "-bottom-0.5 -right-0.5 w-4 h-4" : "-bottom-1 -right-1 w-6 h-6"
              )}>
                <div className="w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
                    {profile?.username || "User"}
                  </h1>
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <p className="text-sm text-slate-500 font-medium mt-1">Welcome back! 👋</p>
                <div className="mt-3 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                  <p className="text-xs font-semibold text-blue-700">Premium Member</p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced collapse button */}
          <button
            className="absolute top-8 -right-4 hidden md:flex w-8 h-8 items-center justify-center bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
            )}
          </button>
        </div>

        {/* Enhanced navigation */}
        <nav className="p-6 space-y-2">
          {dashboardMenu.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <div
                key={item.id}
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 768) onMobileToggle();
                  }}
                  className={clsx(
                    "w-full flex items-center px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isCollapsed ? "justify-center" : "gap-4",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/30 transform scale-[1.02]"
                      : "text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-800 hover:shadow-lg"
                  )}
                >
                  {/* Animated background effect */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300 rounded-2xl" />
                  )}
                  
                  {/* Glow effect for active item */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-50 -z-10 group-hover:blur-md transition-all duration-300" />
                  )}

                  <div className="relative flex items-center gap-4 z-10">
                    <Icon
                      className={clsx(
                        "w-6 h-6 transition-all duration-300",
                        isActive 
                          ? "text-white transform scale-110" 
                          : "text-slate-500 group-hover:text-blue-600 group-hover:scale-110"
                      )}
                    />
                    {!isCollapsed && (
                      <span className={clsx(
                        "font-semibold text-sm transition-all duration-300",
                        isActive ? "text-white" : "text-slate-700 group-hover:text-slate-800"
                      )}>
                        {item.label}
                      </span>
                    )}
                  </div>

                  {/* Active indicator */}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </button>

                {/* Enhanced tooltip for collapsed state */}
                {isCollapsed && (
                  <div
                    className={clsx(
                      "absolute left-full top-1/2 -translate-y-1/2 ml-4 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-medium shadow-2xl transition-all duration-300 pointer-events-none z-50",
                      "before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-slate-800",
                      isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    )}
                  >
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Enhanced stats section */}
        {!isCollapsed && (
          <div className="p-6 mt-4">
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-2xl shadow-purple-500/25">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-white animate-bounce" />
                  <h3 className="font-bold text-xl">Quick Stats</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/90 font-medium">Profile Complete</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse" />
                      </div>
                      <span className="font-bold text-emerald-300">85%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/90 font-medium">Blog Posts</span>
                    <div className="px-3 py-1 bg-white/20 rounded-full">
                      <span className="font-bold text-lg">12</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/90 font-medium">Achievement</span>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="font-bold text-amber-300">Pro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}