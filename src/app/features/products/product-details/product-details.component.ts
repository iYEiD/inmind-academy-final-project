import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { ProductDTO } from '../../../models/product.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { switchMap, map, of, tap, shareReplay } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnDestroy {
  quantity = 1;
  selectedImageIndex = 0;
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

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

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

  trackByImage(index: number, item: string): number {
    return index;
  }
}
