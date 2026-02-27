import React from 'react';
import { useTheme } from './theme-context';
import type { ThemeMode } from './types';

export interface ThemeToggleProps {
  className?: string;
}

const modes: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: 'Clair', icon: 'sun' },
  { value: 'dark', label: 'Sombre', icon: 'moon' },
  { value: 'system', label: 'Systeme', icon: 'monitor' },
];

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { mode, setMode } = useTheme();

  return (
    <div className={className}>
      <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-tertiary">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === m.value
                ? 'bg-surface-primary text-content-primary shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            {m.icon === 'sun' && <SunIcon />}
            {m.icon === 'moon' && <MoonIcon />}
            {m.icon === 'monitor' && <MonitorIcon />}
            <span className="ml-1.5">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ThemeToggleIcon({ className }: ThemeToggleProps) {
  const { toggle, resolvedTheme } = useTheme();

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-lg transition-colors text-content-secondary hover:text-content-primary hover:bg-surface-tertiary ${className ?? ''}`}
      aria-label={resolvedTheme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
