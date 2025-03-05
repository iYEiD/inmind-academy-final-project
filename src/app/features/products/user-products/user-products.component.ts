import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ProductDTO } from '../../../models/product.model';
import { ProductsService } from '../services/products.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICategorySection,
  CATEGORY_SECTIONS,
} from '../../../models/category.model';

@Component({
  selector: 'app-user-products',
  templateUrl: './user-products.component.html',
  styleUrl: './user-products.component.scss',
})
export class UserProductsComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatDrawer;

  products: ProductDTO[] = [];
  currentPage = 1;
  itemsPerPage = 15;
  totalProducts = 0;
  activeCategory: string | null = null;
  currentSort: string | null = null;

  categorySections: ICategorySection[] = CATEGORY_SECTIONS;

  private destroy$ = new Subject<void>();

  productService = inject(ProductsService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.currentPage = +params['page'] || 1;
        this.activeCategory = params['category'] || null;
        this.currentSort = params['sort'] || null;
        this.loadProducts();
      });
  }

  loadProducts(): void {
    const skip = (this.currentPage - 1) * this.itemsPerPage;

    const params = this.route.snapshot.queryParams;

    // Handle conflicting parameters
    if (params['search'] && params['category']) {
      this.router.navigate(['/products'], {
        queryParams: {
          category: params['category'],
          page: params['page'] || 1,
          sort: params['sort'] || null,
          search: null,
        },
      });
      return;
    }

    // Handle conflicting sort and category/search (prioritize sort)
    if (params['sort'] && (params['category'] || params['search'])) {
      this.router.navigate(['/products'], {
        queryParams: {
          sort: params['sort'],
          page: params['page'] || 1,
          category: null,
          search: null,
        },
      });
      return;
    }

    const category = params['category'];
    const search = params['search'];
    const sort = params['sort'];

    let request$;

    // Check if sorting is applied
    if (sort) {
      const [field, direction] = sort.split(':');
      if (field && (direction === 'asc' || direction === 'desc')) {
        request$ = this.productService.getSortedProducts(
          field,
          direction as 'asc' | 'desc',
          this.itemsPerPage,
          skip
        );
      } else {
        // Default to regular products if sort format is invalid
        request$ = this.productService.getProducts(this.itemsPerPage, skip);
      }
    }
    // If no sorting, use regular filters
    else if (category) {
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
    const params = this.route.snapshot.queryParams;

    this.router.navigate(['/products'], {
      queryParams: {
        page: this.currentPage,
        // Preserve existing filter/sort params
        category: params['category'] || null,
        sort: params['sort'] || null,
        search: params['search'] || null,
      },
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
      this.activeCategory = category;
      this.currentSort = null;

      this.router.navigate(['/products'], {
        queryParams: {
          category,
          page: 1,
          sort: null,
          search: null,
        },
      });
    }
  }

  applySorting(field: string, direction: 'asc' | 'desc'): void {
    this.currentSort = `${field}:${direction}`;

    // Get current page from route params or default to 1
    const currentPage = +this.route.snapshot.queryParams['page'] || 1;

    // Reset all query params except pagination when sorting
    this.router.navigate(['/products'], {
      queryParams: {
        sort: this.currentSort,
        page: currentPage,
        // Reset other filter params
        category: null,
        search: null,
      },
    });
  }
}
