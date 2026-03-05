import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin, useRegister } from "@timevault/api-client";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isRegister) {
        await registerMutation.mutateAsync({ email, username, password });
      } else {
        await loginMutation.mutateAsync({ email, password });
      }
      navigate("/", { replace: true });
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail || "Une erreur est survenue.";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 dark:from-primary-900/20 via-surface-primary to-purple-50 dark:to-purple-900/20 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-white text-2xl font-bold mb-4">
            TV
          </div>
          <h1 className="text-3xl font-bold text-content-primary">TimeVault</h1>
          <p className="text-content-tertiary mt-1">
            Capsules temporelles chiffrees
          </p>
        </div>

        {/* Form card */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-content-primary mb-6">
            {isRegister ? "Creer un compte" : "Se connecter"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-content-secondary mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="vous@exemple.com"
              />
            </div>

            {isRegister && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-content-secondary mb-1"
                >
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="monpseudo"
                  minLength={3}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-content-secondary mb-1"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="********"
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading
                ? "Chargement..."
                : isRegister
                ? "Creer le compte"
                : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              {isRegister
                ? "Deja un compte ? Se connecter"
                : "Pas de compte ? S'inscrire"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
