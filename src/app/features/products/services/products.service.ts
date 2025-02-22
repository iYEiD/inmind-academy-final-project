import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ProductDTO } from '../../../models/product.model';
import { ProductsApiService } from './products-api.service';
import { AdminDashboardDTO } from '../../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsSubject = new BehaviorSubject<ProductDTO[]>([]);
  private adminProductsSubject = new BehaviorSubject<AdminDashboardDTO[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  products$ = this.productsSubject.asObservable();
  total$ = this.totalSubject.asObservable();

  constructor(private productsApiService: ProductsApiService) {}

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
}
