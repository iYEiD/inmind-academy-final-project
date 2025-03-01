import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
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
    { name: 'Shop Now', link: '/products' },
    { name: 'Contact', link: '#' },
  ];

  searchTerm: string = '';
  isMobileMenuOpen: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  search(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  submitSearch(): void {
    this.router.navigate(['/products'], {
      queryParams: {
        search: this.searchTerm,
        page: 1,
        category: null,
      },
    });
    this.searchTerm = '';
    this.closeMobileMenu();
  }

  onCategoryClick(categoryLink: string): void {
    const category = categoryLink.split('/').pop();
    if (category) {
      this.router.navigate(['/products'], {
        queryParams: {
          search: null,
          category,
          page: 1,
        },
        queryParamsHandling: 'merge',
      });
    }
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleMobileDropdown(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const dropdown = target.closest('.mobile-dropdown');

    if (dropdown) {
      dropdown.classList.toggle('active');
      event.stopPropagation();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
