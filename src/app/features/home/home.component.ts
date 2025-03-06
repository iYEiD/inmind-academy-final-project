import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../products/services/products.service';
import { ProductDTO } from '../../models/product.model';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ProductMapper } from '../../shared/mappers/product.mapper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Define the number of skeletons to show
  topRatedSkeletonCount = 4;
  exploreSkeletonCount = 8;

  // Arrays to hold skeleton placeholders
  topRatedSkeletons = Array(this.topRatedSkeletonCount).fill(null);
  exploreSkeletons = Array(this.exploreSkeletonCount).fill(null);

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

  // Data state
  topRatedProducts: ProductDTO[] = [];
  exploreProducts: ProductDTO[] = [];

  // Loading states
  topRatedLoading = true;
  exploreLoading = true;

  productService = inject(ProductsService);

  ngOnInit(): void {
    // Fetch products
    this.productService
      .getProducts(12, 0)
      .pipe(
        map((response) => {
          const homeView = ProductMapper.toHomeView(response.products);
          this.topRatedProducts = homeView.topRated;
          this.exploreProducts = homeView.exploreProducts;
          return homeView;
        }),
        tap(() => {
          this.topRatedLoading = false;
          this.exploreLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
