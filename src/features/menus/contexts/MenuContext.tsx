import React, { createContext, useCallback, useContext, useState } from 'react';
import type { Pizza } from '../types';

interface MenuContextValue {
  menu: Pizza[];
  addPizza: (pizza: Omit<Pizza, 'id' | 'createdAt'>) => void;
  removePizza: (id: string) => void;
  updatePizza: (id: string, data: Omit<Pizza, 'id' | 'createdAt'>) => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<Pizza[]>([]);

  const addPizza = useCallback((pizzaData: Omit<Pizza, 'id' | 'createdAt'>) => {
    const pizza: Pizza = {
      ...pizzaData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setMenu(prev => [...prev, pizza]);
  }, []);

  const removePizza = useCallback((id: string) => {
    setMenu(prev => prev.filter(p => p.id !== id));
  }, []);

  const updatePizza = useCallback((id: string, data: Omit<Pizza, 'id' | 'createdAt'>) => {
    setMenu(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  return (
    <MenuContext.Provider value={{ menu, addPizza, removePizza, updatePizza }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}
