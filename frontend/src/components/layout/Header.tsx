import { useMe, useNotifications } from "@timevault/api-client";
import { useNavigate } from "react-router-dom";
import { ThemeToggleIcon } from "@timevault/theme";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: user } = useMe();
  const { data: notifData } = useNotifications({ limit: 1 });
  const navigate = useNavigate();

  const unreadCount = notifData?.unread_count ?? 0;

  return (
    <header className="bg-surface-primary border-b border-edge-primary px-6 py-3 flex items-center justify-between">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-content-tertiary hover:text-content-secondary"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <ThemeToggleIcon />

        {/* Notification bell */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative text-content-tertiary hover:text-content-secondary transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700 dark:text-primary-400">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-content-secondary hidden sm:block">
              {user.username}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
