import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  ProductDTO,
  AdminDashboardDTO,
  IProductFilters,
  IFilterConflictResult,
} from '../../../models/product.model';
import { ProductsApiService } from './products-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsSubject = new BehaviorSubject<ProductDTO[]>([]);
  private adminProductsSubject = new BehaviorSubject<AdminDashboardDTO[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  products$ = this.productsSubject.asObservable();
  total$ = this.totalSubject.asObservable();
  productsApiService = inject(ProductsApiService);

  getProducts(
    limit: number,
    skip: number
  ): Observable<{ products: ProductDTO[]; total: number }> {
    return this.productsApiService.getProducts(limit, skip).pipe(
      tap((response) => {
        this.productsSubject.next(response.products);
        this.totalSubject.next(response.total);
      })
    );
  }

  searchProductsByName(
    name: string,
    limit: number,
    skip: number
  ): Observable<{ products: ProductDTO[]; total: number }> {
    return this.productsApiService.getProductsByName(name, limit, skip).pipe(
      tap((response) => {
        this.productsSubject.next(response.products);
        this.totalSubject.next(response.total);
      })
    );
  }

  searchProductsByCategory(
    category: string,
    limit: number,
    skip: number
  ): Observable<{ products: ProductDTO[]; total: number }> {
    return this.productsApiService
      .getProductsByCategory(category, limit, skip)
      .pipe(
        tap((response) => {
          this.productsSubject.next(response.products);
          this.totalSubject.next(response.total);
        })
      );
  }

  getAdminProducts(
    limit: number,
    skip: number
  ): Observable<{ products: AdminDashboardDTO[]; total: number }> {
    return this.productsApiService.getAdminProducts(limit, skip).pipe(
      tap((response) => {
        this.adminProductsSubject.next(response.products);
        this.totalSubject.next(response.total);
      })
    );
  }

  getSortedProducts(
    field: string,
    direction: 'asc' | 'desc',
    limit: number,
    skip: number
  ): Observable<{ products: ProductDTO[]; total: number }> {
    return this.productsApiService
      .getSortedProducts(field, direction, limit, skip)
      .pipe(
        tap((response) => {
          this.productsSubject.next(response.products);
          this.totalSubject.next(response.total);
        })
      );
  }

  /**
   * Checks for conflicts in filter parameters and returns resolved filters
   */
  checkFilterConflicts(filters: IProductFilters): IFilterConflictResult {
    // Handle conflicting parameters
    if (filters.search && filters.category) {
      return {
        hasConflict: true,
        resolvedFilters: {
          ...filters,
          category: filters.category,
          search: null,
        },
      };
    }

    // Handle conflicting sort and category/search (prioritize sort)
    if (filters.sort && (filters.category || filters.search)) {
      return {
        hasConflict: true,
        resolvedFilters: {
          ...filters,
          sort: filters.sort,
          category: null,
          search: null,
        },
      };
    }

    return { hasConflict: false };
  }

  /**
   * Calculates skip value based on page and itemsPerPage
   */
  calculateSkip(page: number, itemsPerPage: number): number {
    return (page - 1) * itemsPerPage;
  }

  /**
   * Parses sort string into field and direction
   */
  parseSortString(
    sortString: string
  ): { field: string; direction: 'asc' | 'desc' } | null {
    if (!sortString) return null;

    const [field, direction] = sortString.split(':');
    if (field && (direction === 'asc' || direction === 'desc')) {
      return { field, direction: direction as 'asc' | 'desc' };
    }
    return null;
  }

  /**
   * Creates a sort string from field and direction
   */
  createSortString(field: string, direction: 'asc' | 'desc'): string {
    return `${field}:${direction}`;
  }

  /**
   * Main method to get products with filters
   * This handles all the filter logic that was previously in the component
   */
  getProductsWithFilters(
    filters: IProductFilters
  ): Observable<{ products: ProductDTO[]; total: number }> {
    const skip = this.calculateSkip(filters.page, filters.itemsPerPage);

    // Check if sorting is applied
    if (filters.sort) {
      const sortParams = this.parseSortString(filters.sort);
      if (sortParams) {
        return this.getSortedProducts(
          sortParams.field,
          sortParams.direction,
          filters.itemsPerPage,
          skip
        );
      }
      // Default to regular products if sort format is invalid
      return this.getProducts(filters.itemsPerPage, skip);
    }
    // If no sorting, use regular filters
    else if (filters.category) {
      return this.searchProductsByCategory(
        filters.category,
        filters.itemsPerPage,
        skip
      );
    } else if (filters.search) {
      return this.searchProductsByName(
        filters.search,
        filters.itemsPerPage,
        skip
      );
    } else {
      return this.getProducts(filters.itemsPerPage, skip);
    }
  }

  /**
   * Calculate total pages based on total items and items per page
   */
  calculateTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage);
  }
}
