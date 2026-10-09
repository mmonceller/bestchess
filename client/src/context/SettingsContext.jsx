import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setSoundEnabled } from '../utils/sound.js';

export const BOARD_THEMES = {
  classic: { name: 'Classic', light: '#f0d9b5', dark: '#b58863' },
  forest: { name: 'Forest', light: '#e9edcc', dark: '#6f9a54' },
  ocean: { name: 'Ocean', light: '#dee3e6', dark: '#7b97ac' },
  midnight: { name: 'Midnight', light: '#9aa4bd', dark: '#4b5574' },
};

const KEY = 'bc.settings';
const DEFAULTS = { boardTheme: 'classic', sound: true, showCoords: true };

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return DEFAULTS; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
    setSoundEnabled(settings.sound);
    const theme = BOARD_THEMES[settings.boardTheme] || BOARD_THEMES.classic;
    document.documentElement.style.setProperty('--sq-light', theme.light);
    document.documentElement.style.setProperty('--sq-dark', theme.dark);
  }, [settings]);

  const value = useMemo(() => ({
    settings,
    update: (patch) => setSettings((s) => ({ ...s, ...patch })),
  }), [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
