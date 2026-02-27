import { NavLink } from "react-router-dom";
import { useLogout } from "@timevault/api-client";

interface SidebarProps {
  onClose: () => void;
}

const navigation = [
  { name: "Tableau de bord", href: "/", icon: "\u{1F3E0}" },
  { name: "Capsules", href: "/capsules", icon: "\u{1F48A}" },
  { name: "Chaines", href: "/chains", icon: "\u{1F517}" },
  { name: "Notifications", href: "/notifications", icon: "\u{1F514}" },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const logout = useLogout();

  return (
    <div className="h-full flex flex-col bg-surface-primary border-r border-edge-primary">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-edge-secondary">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
          TV
        </div>
        <div>
          <h1 className="text-lg font-bold text-content-primary">TimeVault</h1>
          <p className="text-xs text-content-tertiary">Capsules temporelles</p>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="ml-auto lg:hidden text-content-tertiary hover:text-content-secondary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                  : "text-content-secondary hover:bg-surface-secondary hover:text-content-primary"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-edge-secondary">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-content-secondary hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-150 w-full"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Deconnexion</span>
        </button>
      </div>
    </div>
  );
}
