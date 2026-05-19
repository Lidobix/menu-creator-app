import { COLORS } from '@config';
import type { PizzaBase } from '../types';

export type PizzaCategory = {
  base: PizzaBase;
  label: string;
  emoji: string;
  description: string;
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
};

export const PIZZA_CATEGORIES: PizzaCategory[] = [
  {
    base: 'tomate',
    label: 'Base Tomate',
    emoji: '🍅',
    description: "Sauce tomate fraîche, assaisonnée à l'origan et au basilic",
    cardBg: COLORS.tomateCardBg,
    cardBorder: COLORS.tomateCardBorder,
    badgeBg: COLORS.tomateBadgeBg,
    badgeText: COLORS.tomateBadgeText,
  },
  {
    base: 'crème',
    label: 'Base Crème',
    emoji: '🥛',
    description: 'Crème fraîche onctueuse, légèrement aillée',
    cardBg: COLORS.cremeCardBg,
    cardBorder: COLORS.cremeCardBorder,
    badgeBg: COLORS.cremeBadgeBg,
    badgeText: COLORS.cremeBadgeText,
  },
];
