import React, { useContext, useEffect } from 'react';
import { useLocalStorage } from 'ui/hooks/useLocalStorage';

type Theme = 'light' | 'dark';
type Props = {
  theme: Theme;
  setTheme?: (_: Theme) => void;
};

const INIT_STATE: Props = {
  theme:
    'theme' in localStorage
      ? localStorage.theme === 'dark'
        ? 'dark'
        : 'light'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
};

export const ThemeContext = React.createContext(INIT_STATE);

export const ThemeContextProvider = ({ children }: React.PropsWithChildren<Partial<Props>>) => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', INIT_STATE.theme);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);
