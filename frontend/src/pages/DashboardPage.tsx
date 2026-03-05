import { useDashboard } from "@timevault/api-client";
import type {
  UserStats,
  UpcomingCapsule,
  TimelineEntry,
} from "@timevault/types";

function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return "Prete a ouvrir";
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}j ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function StatsOverview({ stats }: { stats: UserStats }) {
  const cards = [
    {
      label: "Capsules creees",
      value: stats.capsules_created,
      color: "text-primary-600 dark:text-primary-400",
      bg: "bg-primary-50 dark:bg-primary-900/20",
    },
    {
      label: "Capsules recues",
      value: stats.capsules_received,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Capsules ouvertes",
      value: stats.capsules_opened,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="card p-6 flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}
          >
            <span className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </span>
          </div>
          <span className="text-sm font-medium text-content-secondary">
            {card.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function UpcomingCapsules({ capsules }: { capsules: UpcomingCapsule[] }) {
  if (capsules.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-content-primary mb-3">
          Prochaines ouvertures
        </h3>
        <p className="text-content-tertiary text-sm">
          Aucune capsule a venir pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-content-primary mb-4">
        Prochaines ouvertures
      </h3>
      <div className="space-y-3">
        {capsules.map((capsule) => (
          <div
            key={capsule.id}
            className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg"
          >
            <div>
              <p className="font-medium text-content-primary">{capsule.title}</p>
              <p className="text-xs text-content-tertiary">
                {new Date(capsule.open_date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                {formatCountdown(capsule.time_remaining_seconds)}
              </span>
              <p className="text-xs text-content-tertiary mt-1 capitalize">
                {capsule.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-content-primary mb-3">
          Activite recente
        </h3>
        <p className="text-content-tertiary text-sm">Aucune activite recente.</p>
      </div>
    );
  }

  const eventLabels: Record<string, string> = {
    created: "Creee",
    opened: "Ouverte",
    received: "Recue",
  };

  const eventColors: Record<string, string> = {
    created: "bg-primary-500",
    opened: "bg-green-500",
    received: "bg-purple-500",
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-content-primary mb-4">
        Activite recente
      </h3>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-start gap-3">
            <div
              className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                eventColors[entry.event_type] || "bg-content-tertiary"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-content-primary truncate">
                {entry.title}
              </p>
              <p className="text-xs text-content-tertiary">
                {eventLabels[entry.event_type] || entry.event_type} -{" "}
                {new Date(entry.event_date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className="text-xs text-content-tertiary capitalize">
              {entry.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">
          Erreur lors du chargement du tableau de bord.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-content-primary">Tableau de bord</h2>
        <p className="text-content-tertiary mt-1">
          Vue d'ensemble de vos capsules temporelles
        </p>
      </div>

      <StatsOverview stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingCapsules capsules={data.upcoming} />
        <Timeline entries={data.timeline} />
      </div>
    </div>
  );
}
