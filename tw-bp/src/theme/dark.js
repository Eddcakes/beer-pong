// example of extending a theme

import { extend } from './utils';
import { base } from './base';

export const dark = extend(base, {
  primaryBackground: '#444444',
  secondaryBackground: '#7b7b7b',
  primaryText: '#fff',
});
