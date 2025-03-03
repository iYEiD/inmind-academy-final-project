import { createAction, props } from '@ngrx/store';
import { ICartItem } from '../../../models/shopping-cart.model';

export const addToCart = createAction(
  '[Cart] Add Item',
  props<{ item: ICartItem }>()
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ item: ICartItem; quantity: number }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove Item',
  props<{ item: ICartItem }>()
);

export const clearCart = createAction('[Cart] Clear Cart');
