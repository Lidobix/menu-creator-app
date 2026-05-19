export interface Ingredient {
  id: string;
  name: string;
  category: string;
}
export type PizzaBase = 'tomate' | 'crème';

export interface Pizza {
  id: string;
  name: string;
  description?: string;
  base: PizzaBase;
  ingredients: Ingredient[];
  createdAt: string;
}
