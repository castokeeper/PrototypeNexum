import { createContext, useContext, useState, useLayoutEffect } from 'react';

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
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // Si no hay guardado, verificar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  // Usamos useLayoutEffect para evitar parpadeos y asegurar actualización síncrona del DOM
  useLayoutEffect(() => {
    try {
      console.log('Cambio de tema detectado:', theme);
      localStorage.setItem('theme', theme);

      const root = document.documentElement;

      if (theme === 'dark') {
        console.log('Aplicando clase dark');
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        console.log('Removiendo clase dark');
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }

      root.setAttribute('data-theme', theme);
    } catch (error) {
      console.error('Error al cambiar el tema:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
