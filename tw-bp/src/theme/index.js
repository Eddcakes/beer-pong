import { base } from './base';
import { dark } from './dark';
import { casual } from './casual';
import { vb } from './vb';
import { mixedFruit } from './mixedFruit';
export * from './base';
export * from './utils';

export const DEFAULT_THEME = 'base';

export const themes = { base, dark, casual, vb, mixedFruit };
