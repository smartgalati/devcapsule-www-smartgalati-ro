/** Palette registry. Colors live in src/styles/themes.css under [data-palette="<id>"]. */
export interface Palette {
  id: string;
  label: string;
  scheme: 'light' | 'dark';
  upstream?: string;
  license?: string;
}

export const STORAGE_KEY = 'rocada-palette';

export const palettes: Palette[] = [
  { id: 'rocada', label: 'Rocada (implicit)', scheme: 'light' },
  {
    id: 'solarized-light',
    label: 'Solarized Light',
    scheme: 'light',
    upstream: 'https://ethanschoonover.com/solarized/',
    license: 'MIT — Ethan Schoonover',
  },
  {
    id: 'solarized-dark',
    label: 'Solarized Dark',
    scheme: 'dark',
    upstream: 'https://ethanschoonover.com/solarized/',
    license: 'MIT — Ethan Schoonover',
  },
  {
    id: 'catppuccin-latte',
    label: 'Catppuccin Latte',
    scheme: 'light',
    upstream: 'https://github.com/catppuccin/catppuccin',
    license: 'MIT — Catppuccin',
  },
  { id: 'nord', label: 'Nord', scheme: 'dark', upstream: 'https://www.nordtheme.com/', license: 'MIT — Sven Greb' },
  {
    id: 'catppuccin-mocha',
    label: 'Catppuccin Mocha',
    scheme: 'dark',
    upstream: 'https://github.com/catppuccin/catppuccin',
    license: 'MIT — Catppuccin',
  },
];

export const paletteIds = palettes.map((p) => p.id);
export const defaultPalette = palettes[0]!.id;
