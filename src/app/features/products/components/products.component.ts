import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductDTO } from '../../../models/product.model';
import { ProductsService } from '../services/products.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: ProductDTO[] = [];
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.productService.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe((products) => {
        this.products = products;
      });

    // Initial load
    this.productService.getProducts().subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
