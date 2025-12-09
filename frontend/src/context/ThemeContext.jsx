import { createContext, useContext, useState, useLayoutEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Intentar recuperar el tema guardado o usar preferencia del sistema
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;

      // Si no hay guardado, verificar preferencia del sistema
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'dark'; // Default to dark theme
  });

  // Función para aplicar el tema al DOM
  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement;
    const body = document.body;

    // Guardar en localStorage
    localStorage.setItem('theme', newTheme);

    // Limpiar clases previas
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    // Aplicar nuevo tema
    root.classList.add(newTheme);
    body.classList.add(newTheme);

    // Actualizar color-scheme
    root.style.colorScheme = newTheme;

    // Actualizar atributo data-theme
    root.setAttribute('data-theme', newTheme);
    body.setAttribute('data-theme', newTheme);

    // Forzar repaint
    root.style.display = 'none';
    void root.offsetHeight; // Trigger reflow
    root.style.display = '';
  }, []);

  // Aplicar tema al montar y cuando cambia
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Escuchar cambios en la preferencia del sistema
  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Solo cambiar si no hay tema guardado manualmente
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  }, []);

  const setThemeMode = useCallback((newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  }, []);

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
