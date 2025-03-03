import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ICart } from '../../../models/shopping-cart.model';

// Feature selector for the cart state
export const selectCartState = createFeatureSelector<ICart>('cart');

// Selector for cart items
export const selectCartItems = createSelector(
  selectCartState,
  (state: ICart) => state.items
);

// Selector for total price
export const selectTotalPrice = createSelector(
  selectCartState,
  (state: ICart) => state.totalPrice
);

// Selector for cart items count
export const selectCartItemsCount = createSelector(selectCartItems, (items) =>
  items.reduce((count, item) => count + item.quantity, 0)
);
