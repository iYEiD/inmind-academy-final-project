import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../../environments/env';
import { Product } from '../../../models/product.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = env.apiUrl;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  searchProductsByCategory(category: string): Observable<Product[]> {
    if (category === '') return this.getProducts();
    const url = `${this.apiUrl}/category/${category}`;
    return this.http.get<Product[]>(url);
  }

  updateProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }
}
