import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Ingredient } from '@types';
import { ALL_INGREDIENTS } from '../data/ingredients';

type CategoryMap = Record<string, Ingredient[]>;

interface IngredientsContextValue {
  categoryMap: CategoryMap;
  categoryNames: string[];
  allIngredients: Ingredient[];
  addIngredients: (category: string, ingredients: Ingredient[]) => void;
  removeIngredient: (category: string, id: string) => void;
  updateIngredient: (category: string, id: string, name: string) => void;
}

const CATEGORY_ORDER = ['Fromages', 'Viandes', 'Poissons', 'Légumes', 'Herbes', 'Autres'];

function buildInitialMap(): CategoryMap {
  const map: CategoryMap = {};
  for (const ing of ALL_INGREDIENTS) {
    if (!map[ing.category]) map[ing.category] = [];
    map[ing.category].push(ing);
  }
  return map;
}

const IngredientsContext = createContext<IngredientsContextValue | null>(null);

export function IngredientsProvider({ children }: { children: React.ReactNode }) {
  const [categoryMap, setCategoryMap] = useState<CategoryMap>(buildInitialMap);

  const categoryNames = useMemo(() => {
    const all = Object.keys(categoryMap);
    return [
      ...CATEGORY_ORDER.filter(c => all.includes(c)),
      ...all.filter(c => !CATEGORY_ORDER.includes(c)),
    ];
  }, [categoryMap]);

  const allIngredients = useMemo(
    () => categoryNames.flatMap(cat => categoryMap[cat] ?? []),
    [categoryMap, categoryNames],
  );

  const addIngredients = useCallback((category: string, ingredients: Ingredient[]) => {
    setCategoryMap(prev => ({
      ...prev,
      [category]: [...(prev[category] ?? []), ...ingredients],
    }));
  }, []);

  const removeIngredient = useCallback((category: string, id: string) => {
    setCategoryMap(prev => ({
      ...prev,
      [category]: (prev[category] ?? []).filter(i => i.id !== id),
    }));
  }, []);

  const updateIngredient = useCallback((category: string, id: string, name: string) => {
    setCategoryMap(prev => ({
      ...prev,
      [category]: (prev[category] ?? []).map(i => (i.id === id ? { ...i, name } : i)),
    }));
  }, []);

  return (
    <IngredientsContext.Provider
      value={{
        categoryMap,
        categoryNames,
        allIngredients,
        addIngredients,
        removeIngredient,
        updateIngredient,
      }}>
      {children}
    </IngredientsContext.Provider>
  );
}

export function useIngredients() {
  const ctx = useContext(IngredientsContext);
  if (!ctx) throw new Error('useIngredients must be used within IngredientsProvider');
  return ctx;
}
