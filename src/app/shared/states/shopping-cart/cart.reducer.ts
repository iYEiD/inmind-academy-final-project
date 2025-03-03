import { createReducer, on } from '@ngrx/store';
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from './cart.actions';
import { ICart, ICartItem } from '../../../models/shopping-cart.model';

export const initialCartState: ICart = {
  items: [],
  totalPrice: 0,
};

export const cartReducer = createReducer(
  initialCartState,
  on(addToCart, (state, { item }) => {
    const existingItem = state.items.find((i) => i.id === item.id);
    if (existingItem) {
      // If item already exists, update its quantity
      const updatedItems = state.items.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );

      return {
        ...state,
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
      };
    } else {
      // If item doesn't exist, add it to the cart
      const updatedItems = [...state.items, item];

      return {
        ...state,
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
      };
    }
  }),

  on(updateQuantity, (state, { item, quantity }) => {
    const updatedItems = state.items.map((cartItem) =>
      cartItem.id === item.id ? { ...cartItem, quantity: quantity } : cartItem
    );

    return {
      ...state,
      items: updatedItems,
      totalPrice: calculateTotalPrice(updatedItems),
    };
  }),

  on(removeFromCart, (state, { item }) => {
    const updatedItems = state.items.filter(
      (cartItem) => cartItem.id !== item.id
    );

    return {
      ...state,
      items: updatedItems,
      totalPrice: calculateTotalPrice(updatedItems),
    };
  }),

  on(clearCart, () => {
    return initialCartState;
  })
);

// Helper function to calculate total price
function calculateTotalPrice(items: ICartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
