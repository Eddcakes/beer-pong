import { themes } from './index';

export const mapTheme = (themeVar) => {
  return {
    '--color-primary': themeVar.primary || '',
    '--color-secondary': themeVar.secondary || '',
    '--color-positive': themeVar.positive || '',
    '--color-negative': themeVar.negative || '',
    '--color-primary-text': themeVar.primaryText || '',
    '--color-link-text': themeVar.linkText || '',
    '--primary-background': themeVar.primaryBackground || '',
    '--sec-background': themeVar.secondaryBackground || '',
  };
};

export const applyTheme = (theme) => {
  const themeObject = mapTheme(themes[theme]);
  if (!themeObject) return;

  const root = document.documentElement;

  Object.keys(themeObject).forEach((property) => {
    if (property === 'name') return;
    root.style.setProperty(property, themeObject[property]);
  });
};

export const extend = (extending, newTheme) => {
  return { ...extending, ...newTheme };
};
