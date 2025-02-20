import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.productsApiService
      .getProducts()
      .pipe(map((response) => response.products));
  }

  searchProductsByCategory(category: string): Observable<ProductDTO[]> {
    if (category === '') return this.getProducts();
    return this.productsApiService.searchProductsByCategory(category);
  }

  updateProducts(products: ProductDTO[]): void {
    this.productsSubject.next(products);
  }
}
