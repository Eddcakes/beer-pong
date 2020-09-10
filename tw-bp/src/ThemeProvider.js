import React from 'react';
import ThemeContext from './ThemeContext';

export function ThemeProvider({ theme, changeTheme, children }) {
  return (
    <ThemeContext.Provider value={{ theme: theme, switchTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
