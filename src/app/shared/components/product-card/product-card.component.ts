import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { ProductDTO } from '../../../models/product.model';
import { Router } from '@angular/router';
import { ShoppingCartFacade } from '../../../features/shopping-cart/facades/shopping-cart.facade';
import { CartMapper } from '../../mappers/cart.mapper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product?: ProductDTO;
  @Input() isLoading: boolean = false;
  @Input() size: 'default' | 'large' | 'extra-large' = 'default';

  imageLoading: boolean = true;
  quantity: number = 0;

  private destroy$ = new Subject<void>();

  router = inject(Router);
  private cartFacade = inject(ShoppingCartFacade);
  private cartMapper = inject(CartMapper);

  ngOnInit(): void {
    // If we have a product, preload the image
    if (this.product && !this.isLoading) {
      this.preloadImage(this.product.thumbnail);
      this.checkCartQuantity();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkCartQuantity(): void {
    if (!this.product) return;

    this.cartFacade
      .getCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        const cartItem = items.find((item) => item.id === this.product?.id);
        this.quantity = cartItem ? cartItem.quantity : 0;
      });
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

  addToCart(): void {
    if (!this.product) return;
    const cartItem = this.cartMapper.mapProductToCartItem(this.product);
    this.cartFacade.addToCart(cartItem);
  }

  removeFromCart(): void {
    if (!this.product || this.quantity <= 0) return;

    // Create a cart item with the current quantity
    const cartItem = {
      ...this.cartMapper.mapProductToCartItem(this.product),
      quantity: this.quantity,
    };

    if (this.quantity === 1) {
      // If quantity is 1, remove the item completely
      this.cartFacade.removeItem(cartItem);
    } else {
      // If quantity is more than 1, decrement it
      this.cartFacade.decrementQuantity(cartItem);
    }
  }
}
