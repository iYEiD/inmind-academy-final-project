import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ICartItem } from '../../../models/shopping-cart.model';

export interface OrderDetails {
  billingDetails: any;
  items: ICartItem[];
  paymentMethod: 'card' | 'cash';
  subtotal: number;
  vat: number;
  total: number;
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

  placeOrder(orderDetails: OrderDetails): void {
    // Usually handled by the backend
    console.log('Order placed', orderDetails);
  }
}
