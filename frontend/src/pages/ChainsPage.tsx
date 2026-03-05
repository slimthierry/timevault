import React, { useState } from "react";
import { useMyChains, useCreateChain } from "@timevault/api-client";
import type { Chain, Capsule } from "@timevault/types";

function CapsuleChainView({ chain }: { chain: Chain }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-content-primary truncate">
            {chain.title}
          </h3>
          {chain.description && (
            <p className="text-sm text-content-tertiary mt-1">{chain.description}</p>
          )}
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 ml-2">
          {chain.total_capsules} capsule{chain.total_capsules !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-content-tertiary mb-3">
        <span>Par {chain.creator.username}</span>
        <span>
          Creee le{" "}
          {new Date(chain.created_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {chain.capsules.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            {expanded ? "Masquer les capsules" : "Voir les capsules"}
          </button>

          {expanded && (
            <div className="mt-3 space-y-2">
              {chain.capsules.map((capsule: Capsule, index: number) => (
                <div
                  key={capsule.id}
                  className="flex items-center gap-3 p-2.5 bg-surface-secondary rounded-lg"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-content-primary truncate">
                      {capsule.title}
                    </p>
                    <p className="text-xs text-content-tertiary">
                      {new Date(capsule.open_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      capsule.is_opened
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-surface-tertiary text-content-secondary"
                    }`}
                  >
                    {capsule.is_opened ? "Ouverte" : "Verrouillee"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CreateChainForm({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateChain();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await createMutation.mutateAsync({
        title,
        description: description || undefined,
      });
      onClose();
    } catch (err: any) {
      const detail = err?.response?.data?.detail || "Erreur lors de la creation.";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface-primary rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-content-primary">
              Nouvelle chaine
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
                placeholder="Ma chaine de capsules"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-content-secondary mb-1">
                Description (optionnelle)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field min-h-[80px] resize-y"
                placeholder="Decrivez votre chaine..."
              />
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
                {createMutation.isPending ? "Creation..." : "Creer la chaine"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ChainsPage() {
  const { data, isLoading, error } = useMyChains();
  const [showCreate, setShowCreate] = useState(false);

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
        <p className="text-red-500">Erreur lors du chargement des chaines.</p>
      </div>
    );
  }

  const chains = data?.chains ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-content-primary">Mes Chaines</h2>
          <p className="text-content-tertiary mt-1">
            {data?.total ?? 0} chaine{(data?.total ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          + Nouvelle chaine
        </button>
      </div>

      {chains.length === 0 ? (
        <div className="card p-6 text-center py-12">
          <p className="text-content-tertiary mb-4">
            Vous n'avez pas encore de chaines de capsules.
          </p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            Creer ma premiere chaine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chains.map((chain) => (
            <CapsuleChainView key={chain.id} chain={chain} />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateChainForm onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
