import React, { createContext, useCallback, useContext, useState } from 'react';
import type { Ingredient, Pizza, PizzaBase } from '@types';

export interface PizzaCreationState {
  name: string;
  description: string;
  base: PizzaBase | null;
  ingredients: Ingredient[];
  editingId: string | null;
}

interface PizzaCreationContextValue {
  pizza: PizzaCreationState;
  setName: (name: string) => void;
  setDescription: (desc: string) => void;
  setBase: (base: PizzaBase) => void;
  addIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (id: string) => void;
  resetPizza: () => void;
  loadForEdit: (pizza: Pizza) => void;
}

const initialState: PizzaCreationState = {
  name: '',
  description: '',
  base: null,
  ingredients: [],
  editingId: null,
};

const PizzaCreationContext = createContext<PizzaCreationContextValue | null>(null);

export function PizzaCreationProvider({ children }: { children: React.ReactNode }) {
  const [pizza, setPizza] = useState<PizzaCreationState>(initialState);

  const setName = useCallback((name: string) => {
    setPizza(prev => ({ ...prev, name }));
  }, []);

  const setDescription = useCallback((description: string) => {
    setPizza(prev => ({ ...prev, description }));
  }, []);

  const setBase = useCallback((base: PizzaBase) => {
    setPizza(prev => ({ ...prev, base }));
  }, []);

  const addIngredient = useCallback((ingredient: Ingredient) => {
    setPizza(prev => {
      if (prev.ingredients.find(i => i.id === ingredient.id)) return prev;
      return { ...prev, ingredients: [...prev.ingredients, ingredient] };
    });
  }, []);

  const removeIngredient = useCallback((id: string) => {
    setPizza(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i.id !== id),
    }));
  }, []);

  const resetPizza = useCallback(() => {
    setPizza(initialState);
  }, []);

  const loadForEdit = useCallback((pizzaToEdit: Pizza) => {
    setPizza({
      name: pizzaToEdit.name,
      description: pizzaToEdit.description ?? '',
      base: pizzaToEdit.base,
      ingredients: pizzaToEdit.ingredients,
      editingId: pizzaToEdit.id,
    });
  }, []);

  return (
    <PizzaCreationContext.Provider
      value={{
        pizza,
        setName,
        setDescription,
        setBase,
        addIngredient,
        removeIngredient,
        resetPizza,
        loadForEdit,
      }}>
      {children}
    </PizzaCreationContext.Provider>
  );
}

export function usePizzaCreation() {
  const ctx = useContext(PizzaCreationContext);
  if (!ctx) throw new Error('usePizzaCreation must be used within PizzaCreationProvider');
  return ctx;
}
