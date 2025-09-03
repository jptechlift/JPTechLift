import { Menu } from "lucide-react";
import { UserProfile } from "../../services/user";

interface TopBarProps {
  onToggleSidebar: () => void;
  /** Optional profile for avatar display */
  profile?: UserProfile;
}

export default function TopBar({ onToggleSidebar, profile }: TopBarProps) {
  const avatar =
    profile?.avatar ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face";

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray bg-white px-8">
      <button
        onClick={onToggleSidebar}
        className="text-gray-500 focus:outline-none md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex items-center space-x-4">
        <div
          className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10"
          style={{ backgroundImage: `url(${avatar})` }}
        />
      </div>
    </header>
  );
}