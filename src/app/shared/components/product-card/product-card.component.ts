import { Component, inject, Input, OnInit } from '@angular/core';
import { ProductDTO } from '../../../models/product.model';
import { Router } from '@angular/router';
import { ShoppingCartFacade } from '../../../features/shopping-cart/facades/shopping-cart.facade';
import { CartMapper } from '../../mappers/cart.mapper';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  @Input() product?: ProductDTO;
  @Input() isLoading: boolean = false;

  imageLoading: boolean = true;

  router = inject(Router);
  private cartFacade = inject(ShoppingCartFacade);
  private cartMapper = inject(CartMapper);

  ngOnInit(): void {
    // If we have a product, preload the image
    if (this.product && !this.isLoading) {
      this.preloadImage(this.product.thumbnail);
    }
  }

  preloadImage(src: string): void {
    if (!src) {
      this.imageLoading = false;
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      this.imageLoading = false;
    };
    img.onerror = () => {
      this.imageLoading = false;
    };
  }

  navigateToDetails() {
    if (!this.product) return;
    const productName = this.product.title.toLowerCase().replace(/ /g, '-');
    this.router.navigate([`/product-details/${productName}`]);
  }

  addToCart() {
    if (!this.product) return;
    const cartItem = this.cartMapper.mapProductToCartItem(this.product);
    this.cartFacade.addToCart(cartItem);
  }
}
