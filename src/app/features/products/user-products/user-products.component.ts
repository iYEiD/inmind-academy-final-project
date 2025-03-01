import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductDTO } from '../../../models/product.model';
import { ProductsService } from '../services/products.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-products',
  templateUrl: './user-products.component.html',
  styleUrl: './user-products.component.scss',
})
export class UserProductsComponent implements OnInit, OnDestroy {
  products: ProductDTO[] = [];
  currentPage = 1;
  itemsPerPage = 15;
  totalProducts = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
}
