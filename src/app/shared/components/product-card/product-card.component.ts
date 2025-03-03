import { Component, inject, Input } from '@angular/core';
import { ProductDTO } from '../../../models/product.model';
import { Router } from '@angular/router';
import { ICartItem } from '../../../models/shopping-cart.model';
import { ShoppingCartFacade } from '../../../features/shopping-cart/facades/shopping-cart.facade';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: ProductDTO;
  router = inject(Router);
  private cartFacade = inject(ShoppingCartFacade);

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

    // Use the facade to add item to cart
    this.cartFacade.addToCart(cartItem);
  }
}
