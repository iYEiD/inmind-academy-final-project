import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ICartItem } from '../../../models/shopping-cart.model';
import { Observable, of } from 'rxjs';

export interface OrderDetails {
  billingDetails: any;
  items: ICartItem[];
  paymentMethod: 'card' | 'cash';
  subtotal: number;
  vat: number;
  total: number;
  userId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  validateOrder(billingForm: FormGroup, cartItems: ICartItem[]): boolean {
    return billingForm.valid && cartItems.length > 0;
  }

  createOrderDetails(
    billingForm: FormGroup,
    cartItems: ICartItem[],
    paymentMethod: 'card' | 'cash',
    subtotal: number,
    vat: number,
    total: number
  ): OrderDetails {
    return {
      billingDetails: billingForm.value,
      items: cartItems,
      paymentMethod,
      subtotal,
      vat,
      total,
    };
  }

  placeOrder(orderDetails: OrderDetails): Observable<boolean> {
    // Simulate successful order placement
    return of(true);
  }
}
