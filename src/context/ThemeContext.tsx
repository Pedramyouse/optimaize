import React, { createContext, useState, useEffect, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Function to get initial theme based on the class set by inline script
const getInitialContextTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  return 'light'; // Fallback for SSR or non-browser environments, though inline script should handle client-side
};

const ThemeContext = createContext<ThemeContextType>({
  theme: getInitialContextTheme(), // Initialize with the theme from documentElement
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from the class on documentElement, or localStorage/prefers-color-scheme as a fallback
  // The inline script should make documentElement the source of truth on initial load.
  const [theme, setTheme] = useState<Theme>(getInitialContextTheme);

  // This useEffect is now primarily for reacting to programmatic changes (like toggleTheme)
  // and ensuring localStorage and documentElement class are kept in sync.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // This useEffect can be removed or simplified as the inline script handles the very first load.
  // We might still want to listen to prefers-color-scheme changes if no localStorage item is set.
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // If no theme is explicitly saved in localStorage, and system theme changes, update.
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);


  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};