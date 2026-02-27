import {
  useNotifications,
  useMarkNotificationRead,
} from "@timevault/api-client";
import type { Notification } from "@timevault/types";

const typeLabels: Record<string, string> = {
  reminder_week: "Rappel - 1 semaine",
  reminder_day: "Rappel - 1 jour",
  capsule_opened: "Capsule ouverte",
  capsule_received: "Capsule recue",
};

const typeColors: Record<string, { bg: string; text: string }> = {
  reminder_week: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
  reminder_day: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
  capsule_opened: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
  capsule_received: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
};

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  const colors = typeColors[notification.type] || {
    bg: "bg-surface-tertiary",
    text: "text-content-secondary",
  };

  return (
    <div
      className={`card p-6 flex items-start gap-4 ${
        !notification.is_read ? "border-l-4 border-l-primary-500" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
          >
            {typeLabels[notification.type] || notification.type}
          </span>
          {!notification.is_read && (
            <span className="w-2 h-2 rounded-full bg-primary-500" />
          )}
        </div>
        <p className="text-sm text-content-primary">{notification.message}</p>
        <p className="text-xs text-content-tertiary mt-1">
          {new Date(notification.created_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {!notification.is_read && (
        <button
          onClick={() => onMarkRead(notification.id)}
          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium whitespace-nowrap"
        >
          Marquer lu
        </button>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const { data, isLoading, error } = useNotifications();
  const markReadMutation = useMarkNotificationRead();

  const handleMarkRead = (id: string) => {
    markReadMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">
          Erreur lors du chargement des notifications.
        </p>
      </div>
    );
  }

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unread_count ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-content-primary">Notifications</h2>
        <p className="text-content-tertiary mt-1">
          {unreadCount > 0
            ? `${unreadCount} notification${unreadCount !== 1 ? "s" : ""} non lue${unreadCount !== 1 ? "s" : ""}`
            : "Toutes les notifications sont lues"}
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="card p-6 text-center py-12">
          <p className="text-content-tertiary">Aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
