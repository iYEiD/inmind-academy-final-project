import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ProductDTO } from '../../../models/product.model';
import { ProductsService } from '../services/products.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

interface CategorySection {
  title: string;
  isOpen: boolean;
  categories: Array<{
    name: string;
    link: string;
  }>;
}

@Component({
  selector: 'app-user-products',
  templateUrl: './user-products.component.html',
  styleUrl: './user-products.component.scss',
})
export class UserProductsComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  products: ProductDTO[] = [];
  currentPage = 1;
  itemsPerPage = 15;
  totalProducts = 0;

  categorySections: CategorySection[] = [
    {
      title: 'Electronics',
      isOpen: false,
      categories: [
        { name: 'Smartphones', link: '/products/smartphones' },
        { name: 'Laptops', link: '/products/laptops' },
        { name: 'Tablets', link: '/products/tablets' },
        { name: 'Mobile Accessories', link: '/products/mobile-accessories' },
      ],
    },
    {
      title: 'Fashion',
      isOpen: false,
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
      isOpen: false,
      categories: [
        { name: 'Furniture', link: '/products/furniture' },
        { name: 'Home Decoration', link: '/products/home-decoration' },
        { name: 'Kitchen Accessories', link: '/products/kitchen-accessories' },
      ],
    },
    {
      title: 'Lifestyle',
      isOpen: false,
      categories: [
        { name: 'Beauty', link: '/products/beauty' },
        { name: 'Fragrances', link: '/products/fragrances' },
        { name: 'Skin Care', link: '/products/skin-care' },
        { name: 'Sunglasses', link: '/products/sunglasses' },
      ],
    },
    {
      title: 'Sports & Outdoors',
      isOpen: false,
      categories: [
        { name: 'Sports Accessories', link: '/products/sports-accessories' },
        { name: 'Motorcycle', link: '/products/motorcycle' },
        { name: 'Vehicle', link: '/products/vehicle' },
      ],
    },
  ];

  private destroy$ = new Subject<void>();

  productService = inject(ProductsService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.currentPage = +params['page'] || 1;
        this.loadProducts();
      });
  }

  loadProducts(): void {
    const skip = (this.currentPage - 1) * this.itemsPerPage;

    const params = this.route.snapshot.queryParams;

    // Handle conflicting parameters
    if (params['search'] && params['category']) {
      this.router.navigate([], {
        queryParams: { category: null },
        queryParamsHandling: 'merge',
      });
      return;
    }

    const category = params['category'];
    const search = params['search'];

    let request$;

    if (category) {
      request$ = this.productService.searchProductsByCategory(
        category,
        this.itemsPerPage,
        skip
      );
    } else if (search) {
      request$ = this.productService.searchProductsByName(
        search,
        this.itemsPerPage,
        skip
      );
    } else {
      request$ = this.productService.getProducts(this.itemsPerPage, skip);
    }

    request$.pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.products = response.products;
      this.totalProducts = response.total;
    });
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalProducts) {
      this.currentPage++;
      this.updateRouteWithPagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateRouteWithPagination();
    }
  }

  private updateRouteWithPagination(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.itemsPerPage);
  }

  trackByProductId(index: number, product: ProductDTO): number {
    return product.id;
  }

  toggleCategory(title: string): void {
    const section = this.categorySections.find((s) => s.title === title);
    if (section) {
      section.isOpen = !section.isOpen;
    }
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
  }
}
