import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ProductDTO } from '../../../models/product.model';
import { ProductsApiService } from './products-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsSubject = new BehaviorSubject<ProductDTO[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private productsApiService: ProductsApiService) {}

  getProducts(): Observable<ProductDTO[]> {
    return this.productsApiService.getProducts().pipe(
      map((response) => response.products),
      tap((products) => this.updateProducts(products))
    );
  }

  searchProductsByName(name: string): Observable<ProductDTO[]> {
    if (name === '') return this.getProducts();
    return this.productsApiService
      .getProductsByName(name)
      .pipe(map((response) => response.products));
  }

  updateProducts(products: ProductDTO[]): void {
    this.productsSubject.next(products);
  }
}
