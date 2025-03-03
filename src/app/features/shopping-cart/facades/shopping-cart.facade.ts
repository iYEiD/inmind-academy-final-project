import { Injectable, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ICartItem } from '../../../models/shopping-cart.model';
import {
  selectCartItems,
  selectTotalPrice,
} from '../../../shared/states/shopping-cart/cart.selectors';
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../../../shared/states/shopping-cart/cart.actions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartFacade {
  private cartItemsSignal = signal<ICartItem[]>([]);
  private subtotalSignal = signal<number>(0);

  // Computed signals
  vatSignal = computed(() => this.subtotalSignal() * 0.2);
  totalSignal = computed(() => this.subtotalSignal() + this.vatSignal());

  // Public getters
  get cartItems() {
    return this.cartItemsSignal();
  }
  get subtotal() {
    return this.subtotalSignal();
  }
  get vat() {
    return this.vatSignal();
  }
  get total() {
    return this.totalSignal();
  }

  constructor(private store: Store) {
    this.initializeSignals();
  }

  private initializeSignals(): void {
    this.store.select(selectCartItems).subscribe((items) => {
      this.cartItemsSignal.set(items);
    });

    this.store.select(selectTotalPrice).subscribe((price) => {
      this.subtotalSignal.set(price);
    });
  }

  incrementQuantity(item: ICartItem): void {
    this.store.dispatch(
      updateQuantity({
        item,
        quantity: item.quantity + 1,
      })
    );
  }

  decrementQuantity(item: ICartItem): void {
    if (item.quantity > 1) {
      this.store.dispatch(
        updateQuantity({
          item,
          quantity: item.quantity - 1,
        })
      );
    }
  }

  removeItem(item: ICartItem): void {
    this.store.dispatch(removeFromCart({ item }));
  }

  clearCart(): void {
    this.store.dispatch(clearCart());
  }

  getCartItems(): Observable<ICartItem[]> {
    return this.store.select(selectCartItems);
  }

  getTotalPrice(): Observable<number> {
    return this.store.select(selectTotalPrice);
  }
}
