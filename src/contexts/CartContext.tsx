// @ts-nocheck
'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  storeId: string;
  storeName: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  projectId?: string;
}

interface CartContextType {
  cart: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  setProjectId: (projectId?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_PROJECT_ID'; payload?: string };

function cartReducer(state: CartState, action: CartAction): CartState {
  console.log('CartReducer: Action received:', action.type, action.payload);
  console.log('CartReducer: Current state:', state);
  
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const newState = {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
        console.log('CartReducer: Updated existing item, new state:', newState);
        return newState;
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        const newState = {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        };
        console.log('CartReducer: Added new item, new state:', newState);
        return newState;
      }
    
    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems),
        itemCount: calculateItemCount(filteredItems),
      };
    
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
        projectId: state.projectId,
      };
    case 'SET_PROJECT_ID':
      return { ...state, projectId: action.payload };
    
    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
  itemCount: 0,
  projectId: undefined,
  });

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    console.log('CartContext: Adding item to cart:', item);
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => cart.total;

  const setProjectId = (projectId?: string) => {
    dispatch({ type: 'SET_PROJECT_ID', payload: projectId });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
  setProjectId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}


