import React, { useState } from "react";
import {
  useMyCapsules,
  useCreateCapsule,
  useOpenCapsule,
} from "@timevault/api-client";
import type { Capsule, CapsuleCategory } from "@timevault/types";

function formatCountdown(totalSeconds: number | null): string {
  if (totalSeconds === null || totalSeconds <= 0) return "Prete a ouvrir";
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}j ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function CapsuleTimer({ capsule }: { capsule: Capsule }) {
  const isReady = capsule.time_remaining_seconds !== null && capsule.time_remaining_seconds <= 0;

  if (capsule.is_opened) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
        Ouverte
      </span>
    );
  }

  if (isReady) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
        Prete a ouvrir
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
      {formatCountdown(capsule.time_remaining_seconds)}
    </span>
  );
}

function CapsuleCard({
  capsule,
  onOpen,
}: {
  capsule: Capsule;
  onOpen: (id: string) => void;
}) {
  const canOpen =
    !capsule.is_opened &&
    capsule.time_remaining_seconds !== null &&
    capsule.time_remaining_seconds <= 0;

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-content-primary truncate">
            {capsule.title}
          </h3>
          <p className="text-xs text-content-tertiary mt-0.5 capitalize">
            {capsule.category} {capsule.is_public ? "- Publique" : ""}
          </p>
        </div>
        <CapsuleTimer capsule={capsule} />
      </div>

      <div className="flex items-center justify-between text-xs text-content-tertiary">
        <span>
          Ouverture :{" "}
          {new Date(capsule.open_date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span>Par {capsule.creator.username}</span>
      </div>

      {canOpen && (
        <button
          onClick={() => onOpen(capsule.id)}
          className="btn-primary w-full mt-4 text-sm"
        >
          Ouvrir la capsule
        </button>
      )}
    </div>
  );
}

function CreateCapsuleForm({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateCapsule();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<CapsuleCategory>("personal" as CapsuleCategory);
  const [openDate, setOpenDate] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [recipientEmails, setRecipientEmails] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const emails = recipientEmails
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      await createMutation.mutateAsync({
        title,
        content,
        category,
        open_date: new Date(openDate).toISOString(),
        is_public: isPublic,
        recipient_emails: emails.length > 0 ? emails : undefined,
      });
      onClose();
    } catch (err: any) {
      const detail = err?.response?.data?.detail || "Erreur lors de la creation.";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface-primary rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-content-primary">
              Nouvelle capsule
            </h3>
            <button
              onClick={onClose}
              className="text-content-tertiary hover:text-content-secondary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-content-secondary mb-1">
                Titre
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Ma capsule temporelle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-content-secondary mb-1">
                Contenu
              </label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field min-h-[120px] resize-y"
                placeholder="Ecrivez votre message pour le futur..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-content-secondary mb-1">
                  Categorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CapsuleCategory)}
                  className="input-field"
                >
                  <option value="personal">Personnel</option>
                  <option value="family">Famille</option>
                  <option value="professional">Professionnel</option>
                  <option value="community">Communaute</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-content-secondary mb-1">
                  Date d'ouverture
                </label>
                <input
                  type="datetime-local"
                  required
                  value={openDate}
                  onChange={(e) => setOpenDate(e.target.value)}
                  className="input-field"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-content-secondary mb-1">
                Emails des destinataires (separes par des virgules)
              </label>
              <input
                type="text"
                value={recipientEmails}
                onChange={(e) => setRecipientEmails(e.target.value)}
                className="input-field"
                placeholder="ami@exemple.com, famille@exemple.com"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_public"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-edge-primary focus:ring-primary-500"
              />
              <label
                htmlFor="is_public"
                className="text-sm font-medium text-content-secondary"
              >
                Capsule publique (visible par tous apres ouverture)
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-primary flex-1"
              >
                {createMutation.isPending ? "Creation..." : "Creer la capsule"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CapsulesPage() {
  const { data, isLoading, error } = useMyCapsules();
  const openMutation = useOpenCapsule();
  const [showCreate, setShowCreate] = useState(false);
  const [openedContent, setOpenedContent] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const handleOpen = async (id: string) => {
    try {
      const result = await openMutation.mutateAsync(id);
      setOpenedContent({ title: result.title, content: result.content });
    } catch {
      // Error handled by mutation
    }
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
        <p className="text-red-500">Erreur lors du chargement des capsules.</p>
      </div>
    );
  }

  const capsules = data?.capsules ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-content-primary">Mes Capsules</h2>
          <p className="text-content-tertiary mt-1">
            {data?.total ?? 0} capsule{(data?.total ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          + Nouvelle capsule
        </button>
      </div>

      {capsules.length === 0 ? (
        <div className="card p-6 text-center py-12">
          <p className="text-content-tertiary mb-4">
            Vous n'avez pas encore de capsules.
          </p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            Creer ma premiere capsule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {capsules.map((capsule) => (
            <CapsuleCard
              key={capsule.id}
              capsule={capsule}
              onOpen={handleOpen}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateCapsuleForm onClose={() => setShowCreate(false)} />
      )}

      {/* Opened capsule content modal */}
      {openedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface-primary rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-content-primary">
                {openedContent.title}
              </h3>
              <button
                onClick={() => setOpenedContent(null)}
                className="text-content-tertiary hover:text-content-secondary"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-content-primary whitespace-pre-wrap">
              {openedContent.content}
            </div>
            <button
              onClick={() => setOpenedContent(null)}
              className="btn-primary w-full mt-4"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
