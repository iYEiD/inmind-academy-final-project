import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../products/services/products.service';
import { ProductDTO } from '../../models/product.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  categories = [
    {
      name: 'Electronics',
      image: '../../../assets/images/category-electronics-image.png',
      category: 'mobile-accessories',
    },
    {
      name: "Men's Section",
      image: '../../../assets/images/category-men-image.png',
      category: 'mens-shirts',
    },
    {
      name: 'Women Section',
      image: '../../../assets/images/category-girl-image.png',
      category: 'womens-dresses',
    },
    {
      name: 'Jewelery',
      image: '../../../assets/images/category-jewelery-image.png',
      category: 'womens-jewellery',
    },
  ];

  services = [
    {
      name: 'FREE AND FAST DELIVERY',
      description: 'Free delivery on all orders over 140$',
      image: '../../../assets/images/services-delivery-image.png',
    },
    {
      name: '24/7 CUSTOMER SERVICE',
      description: 'Our customer service is available 24/7',
      image: '../../../assets/images/services-customer-image.png',
    },
    {
      name: 'MONEY BACK GUARANTEE',
      description: 'We return money within 30 days',
      image: '../../../assets/images/services-returns-image.png',
    },
  ];

  router = inject(Router);
  navigateToProducts() {
    this.router.navigate(['/products']);
  }
  navigateToCategory(category: string) {
    this.router.navigate(['/products'], {
      queryParams: { category, page: 1 },
      queryParamsHandling: 'merge',
    });
  }
  topRatedProducts: ProductDTO[] = [];
  topExploreProducts: ProductDTO[] = [];
  bottomExploreProducts: ProductDTO[] = [];
  isLoading = true;
  constructor(private productService: ProductsService) {}

  products$ = this.productService.getProducts(12, 0).pipe(
    map((response) => ({
      topRated: response.products.slice(0, 4),
      topExplore: response.products.slice(4, 8),
      bottomExplore: response.products.slice(8, 12),
    }))
  );

  ngOnInit() {
    this.productService
      .getProducts(12, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.topRatedProducts = products.products.slice(0, 4);
          this.topExploreProducts = products.products.slice(4, 8);
          this.bottomExploreProducts = products.products.slice(8, 12);
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
