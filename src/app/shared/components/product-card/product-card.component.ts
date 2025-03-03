import { Component, inject, Input } from '@angular/core';
import { ProductDTO } from '../../../models/product.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addToCart } from '../../states/shopping-cart/cart.actions';
import { ICartItem } from '../../../models/shopping-cart.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: ProductDTO;
  router = inject(Router);
  store = inject(Store);

  navigateToDetails() {
    const productName = this.product.title.toLowerCase().replace(/ /g, '-');
    this.router.navigate([`/product-details/${productName}`]);
  }

  addToCart() {
    // Create a cart item from the product
    const cartItem: ICartItem = {
      id: this.product.id,
      title: this.product.title,
      price: this.product.price,
      quantity: 1, // Default quantity is 1 when adding from product card
      thumbnail: this.product.thumbnail,
    };

    // Dispatch the addToCart action
    this.store.dispatch(addToCart({ item: cartItem }));
  }
}
