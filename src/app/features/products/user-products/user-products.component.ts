import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ViewChild,
  HostListener,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ProductDTO, IProductFilters } from '../../../models/product.model';
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
  @ViewChild('sidenav') sidenav!: MatSidenav;

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

  isLoading = true;
  skeletonCount = 8;
  skeletons = Array(this.skeletonCount).fill(null);

  // Add a property to track if we're in mobile view
  isMobile = false;

  ngOnInit(): void {
    // Check initial screen size
    this.checkScreenSize();

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.currentPage = +params['page'] || 1;
        this.activeCategory = params['category'] || null;
        this.currentSort = params['sort'] || null;
        this.loadProducts();
      });
  }

  // Listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  // Check if we're in mobile view
  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 992; //Screen size for tablets and <
  }

  // Toggle sidenav
  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  // Close sidenav
  closeSidenav(): void {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }

  loadProducts(): void {
    this.isLoading = true;

    const params = this.route.snapshot.queryParams;

    // Create filters object from current state
    const filters: IProductFilters = {
      category: params['category'] || null,
      search: params['search'] || null,
      sort: params['sort'] || null,
      page: this.currentPage,
      itemsPerPage: this.itemsPerPage,
    };

    // Check for filter conflicts
    const conflictResult = this.productService.checkFilterConflicts(filters);

    if (conflictResult.hasConflict && conflictResult.resolvedFilters) {
      // Navigate to resolved filters
      this.router.navigate(['/products'], {
        queryParams: {
          category: conflictResult.resolvedFilters.category || null,
          search: conflictResult.resolvedFilters.search || null,
          sort: conflictResult.resolvedFilters.sort || null,
          page: conflictResult.resolvedFilters.page || 1,
        },
      });
      return;
    }

    // Get products with filters
    this.productService
      .getProductsWithFilters(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.products = response.products;
        this.totalProducts = response.total;
        this.isLoading = false;
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
    return this.productService.calculateTotalPages(
      this.totalProducts,
      this.itemsPerPage
    );
  }

  trackByProductId(index: number, product: ProductDTO): number {
    return product.id;
  }

  toggleCategory(title: string): void {
    // First, check if the clicked category is already open
    const clickedSection = this.categorySections.find((s) => s.title === title);
    const isCurrentlyOpen = clickedSection?.isOpen || false;

    // Close all categories first
    this.categorySections.forEach((section) => {
      section.isOpen = false;
    });

    // If the clicked category wasn't already open, open it
    // If it was already open, it will remain closed (toggle behavior)
    if (clickedSection && !isCurrentlyOpen) {
      clickedSection.isOpen = true;
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

      // Close sidenav after selection on mobile
      this.closeSidenav();
    }
  }

  applySorting(field: string, direction: 'asc' | 'desc'): void {
    this.currentSort = this.productService.createSortString(field, direction);

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

    // Close sidenav after selection on mobile
    this.closeSidenav();
  }
}
