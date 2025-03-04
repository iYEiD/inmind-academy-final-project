import { Component, inject, Input } from '@angular/core';
import { ProductDTO } from '../../../models/product.model';
import { Router } from '@angular/router';
import { ShoppingCartFacade } from '../../../features/shopping-cart/facades/shopping-cart.facade';
import { CartMapper } from '../../mappers/cart.mapper';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: ProductDTO;
  router = inject(Router);
  private cartFacade = inject(ShoppingCartFacade);
  private cartMapper = inject(CartMapper);

  navigateToDetails() {
    const productName = this.product.title.toLowerCase().replace(/ /g, '-');
    this.router.navigate([`/product-details/${productName}`]);
  }

  addToCart() {
    const cartItem = this.cartMapper.mapProductToCartItem(this.product);
    this.cartFacade.addToCart(cartItem);
  }
}
