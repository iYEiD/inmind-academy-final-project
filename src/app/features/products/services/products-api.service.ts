import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../../environments/env';
import { ProductDTO } from '../../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private apiUrl = env.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ products: ProductDTO[] }> {
    return this.http.get<{ products: ProductDTO[] }>(this.apiUrl);
  }

  searchProductsByCategory(category: string): Observable<ProductDTO[]> {
    const url = `${this.apiUrl}/category/${category}`;
    return this.http.get<ProductDTO[]>(url);
  }
}
