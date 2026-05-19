export const CATEGORIES = [
  { label: 'Fromages', emoji: '🧀' },
  { label: 'Viandes', emoji: '🥩' },
  { label: 'Poissons', emoji: '🐟' },
  { label: 'Légumes', emoji: '🥦' },
  { label: 'Herbes', emoji: '🌿' },
  { label: 'Autres', emoji: '🫙' },
] as const;

export type Category = (typeof CATEGORIES)[number];

export const DEFAULT_CAT_EMOJI = '🍴' as const;
