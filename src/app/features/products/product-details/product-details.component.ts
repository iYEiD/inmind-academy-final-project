import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { ProductDTO } from '../../../models/product.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product!: ProductDTO;
  quantity = 1;
  relatedProducts: ProductDTO[] = [];
  selectedImageIndex = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    const productName = this.route.snapshot.paramMap.get('productName');
    if (productName) {
      this.productsService
        .searchProductsByName(productName, 1, 0)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          this.product = response.products[0];
          this.productsService
            .searchProductsByCategory(this.product.category, 4, 1)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
              this.relatedProducts = response.products;
            });
        });
    }
  }

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
