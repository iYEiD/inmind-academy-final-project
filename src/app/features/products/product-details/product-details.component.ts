import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { ProductDTO } from '../../../models/product.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { switchMap, map, of, tap, shareReplay } from 'rxjs';
import { ShoppingCartFacade } from '../../../features/shopping-cart/facades/shopping-cart.facade';
import { CartMapper } from '../../../shared/mappers/cart.mapper';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnDestroy {
  quantity = 1;
  selectedImageIndex = 0;
  private cartFacade = inject(ShoppingCartFacade);
  private cartMapper = inject(CartMapper);
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  private destroy$ = new Subject<void>();

  product$ = this.route.paramMap.pipe(
    takeUntil(this.destroy$),
    switchMap((params) => {
      const productName = params.get('productName');
      return productName
        ? this.productsService.searchProductsByName(productName, 1, 0)
        : of(null);
    }),
    map((response) => response?.products[0]),
    tap((product) => {
      if (product) this.selectedImageIndex = 0; // Reset image index
    }),
    shareReplay(1)
  );

  relatedProducts$ = this.product$.pipe(
    switchMap((product) =>
      product
        ? this.productsService.searchProductsByCategory(product.category, 4, 0)
        : of(null)
    ),
    map((response) => response?.products || [])
  );

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onQuantityChange() {
    if (this.quantity < 1 || isNaN(this.quantity)) {
      this.quantity = 1;
    }
  }

  addToCart(product: ProductDTO) {
    const cartItem = this.cartMapper.mapProductToCartItemWithQuantity(
      product,
      this.quantity
    );
    this.cartFacade.addToCart(cartItem);
  }

  trackByImage(index: number, item: string): number {
    return index;
  }
}
