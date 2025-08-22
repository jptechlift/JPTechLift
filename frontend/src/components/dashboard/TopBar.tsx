import { Menu } from "lucide-react";

interface TopBarProps {
  onToggleSidebar: () => void;
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  return (
    <div className="md:hidden flex items-center p-4 bg-white/80 backdrop-blur-sm border-b border-white/50 shadow">
      <button onClick={onToggleSidebar} className="text-gray-700">
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="ml-4 font-bold text-lg text-gray-800">Dashboard</h1>
    </div>
  );
}