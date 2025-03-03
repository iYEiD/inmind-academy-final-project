import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../../../environments/env';
import { ProductDTO } from '../../../models/product.model';
import { AdminDashboardDTO } from '../../../models/product.model';
import { map } from 'rxjs/operators';
import { ProductMapper } from '../../../shared/mappers/product.mapper';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private apiUrl = env.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(
    limit: number,
    skip: number
  ): Observable<{ products: ProductDTO[]; total: number }> {
    const url = `${this.apiUrl}?limit=${limit}&skip=${skip}`;
    return this.http.get<{ products: ProductDTO[]; total: number }>(url);
  }

  getProductsByName(
    name: string,
    limit: number,
    skip: number
  ): Observable<{ products: ProductDTO[]; total: number }> {
    const url = `${this.apiUrl}/search?q=${name}&limit=${limit}&skip=${skip}`;
    return this.http.get<{ products: ProductDTO[]; total: number }>(url);
  }

  getProductsByCategory(
    category: string,
    limit: number,
    skip: number
  ): Observable<{ products: ProductDTO[]; total: number }> {
    const url = `${this.apiUrl}/category/${category}?limit=${limit}&skip=${skip}`;
    return this.http.get<{ products: ProductDTO[]; total: number }>(url);
  }

  getAdminProducts(
    limit: number,
    skip: number
  ): Observable<{ products: AdminDashboardDTO[]; total: number }> {
    const url = `${this.apiUrl}?limit=${limit}&skip=${skip}`;
    return this.http.get<{ products: ProductDTO[]; total: number }>(url).pipe(
      map((response) => ({
        products: ProductMapper.toAdminDashboardList(response.products),
        total: response.total,
      }))
    );
  }
}
