import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { ProductsService } from '../../../features/products/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  navItems = [
    { name: 'Home', link: '/' },
    {
      name: 'Our Products',
      link: '#',
      sections: [
        {
          title: 'Electronics',
          categories: [
            { name: 'Smartphones', link: '/products/smartphones' },
            { name: 'Laptops', link: '/products/laptops' },
            { name: 'Tablets', link: '/products/tablets' },
            {
              name: 'Mobile Accessories',
              link: '/products/mobile-accessories',
            },
          ],
        },
        {
          title: 'Fashion',
          categories: [
            { name: "Men's Shirts", link: '/products/mens-shirts' },
            { name: "Men's Shoes", link: '/products/mens-shoes' },
            { name: "Men's Watches", link: '/products/mens-watches' },
            { name: "Women's Dresses", link: '/products/womens-dresses' },
            { name: "Women's Bags", link: '/products/womens-bags' },
            { name: "Women's Jewellery", link: '/products/womens-jewellery' },
            { name: "Women's Shoes", link: '/products/womens-shoes' },
            { name: "Women's Watches", link: '/products/womens-watches' },
          ],
        },
        {
          title: 'Home & Living',
          categories: [
            { name: 'Furniture', link: '/products/furniture' },
            { name: 'Home Decoration', link: '/products/home-decoration' },
            {
              name: 'Kitchen Accessories',
              link: '/products/kitchen-accessories',
            },
          ],
        },
        {
          title: 'Lifestyle',
          categories: [
            { name: 'Beauty', link: '/products/beauty' },
            { name: 'Fragrances', link: '/products/fragrances' },
            { name: 'Skin Care', link: '/products/skin-care' },
            { name: 'Sunglasses', link: '/products/sunglasses' },
          ],
        },
        {
          title: 'Sports & Outdoors',
          categories: [
            {
              name: 'Sports Accessories',
              link: '/products/sports-accessories',
            },
            { name: 'Motorcycle', link: '/products/motorcycle' },
            { name: 'Vehicle', link: '/products/vehicle' },
          ],
        },
      ],
    },
    { name: 'Sale', link: '/products' },
    { name: 'Contact', link: '/contact' },
  ];

  searchTerms = new Subject<string>();
  searchTerm: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  search(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  submitSearch(): void {
    this.searchTerms.next(this.searchTerm);
    if (this.router.url !== '/products') {
      this.router.navigate(['/products']);
    }
  }

  onCategoryClick(categoryLink: string): void {
    const category = categoryLink.split('/').pop();
    if (category) {
      this.productsService.searchProductsByCategory(category).subscribe();
      if (this.router.url !== '/products') {
        this.router.navigate(['/products']);
      }
    }
  }

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.productsService.searchProductsByName(term)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((results) => {
        this.productsService.updateProducts(results);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
