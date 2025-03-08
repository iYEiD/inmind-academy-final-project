import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { ProductDTO } from '../../../models/product.model';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { switchMap, map, of, tap, shareReplay } from 'rxjs';
import { ShoppingCartFacade } from '../../../features/shopping-cart/facades/shopping-cart.facade';
import { CartMapper } from '../../../shared/mappers/cart.mapper';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  quantity = 1;
  selectedImageIndex = 0;
  imageLoading: boolean = true;
  thumbnailsLoading: boolean[] = [];

  // Loading state
  isLoading: boolean = true;

  // Store the product data
  product: ProductDTO | null = null;
  relatedProducts: ProductDTO[] = [];

  private cartFacade = inject(ShoppingCartFacade);
  private cartMapper = inject(CartMapper);
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  private destroy$ = new Subject<void>();
  private router = inject(Router);

  product$ = this.route.paramMap.pipe(
    takeUntil(this.destroy$),
    switchMap((params) => {
      const productName = params.get('productName');
      this.isLoading = true; // Set loading to true when fetching
      return productName
        ? this.productsService.searchProductsByName(productName, 1, 0)
        : of(null);
    }),
    map((response) => response?.products[0]),
    tap((product) => {
      if (product) {
        this.product = product; // Store the product data
        this.selectedImageIndex = 0; // Reset image index
        this.imageLoading = true; // Reset main image loading state
        this.thumbnailsLoading = product.images.map(() => true); // Initialize loading state for all thumbnails
        this.preloadImage(product.images[0]); // Preload the main image
        this.isLoading = false; // Set loading to false when data is available
      }
    }),
    shareReplay(1)
  );

  relatedProducts$ = this.product$.pipe(
    switchMap((product) =>
      product
        ? this.productsService.searchProductsByCategory(product.category, 4, 0)
        : of(null)
    ),
    map((response) => response?.products || []),
    tap((products) => {
      this.relatedProducts = products; // Store the related products data
    })
  );

  ngOnInit() {
    // Subscribe to the observables to trigger the HTTP requests
    this.product$.pipe(takeUntil(this.destroy$)).subscribe();
    this.relatedProducts$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  preloadThumbnail(src: string, index: number): void {
    if (!src) {
      this.thumbnailsLoading[index] = false;
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      this.thumbnailsLoading[index] = false;
    };
    img.onerror = () => {
      this.thumbnailsLoading[index] = false;
    };
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
    this.imageLoading = true;

    this.product$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((product) => {
        if (product && product.images[index]) {
          this.preloadImage(product.images[index]);
        }
      });
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
