import { Component } from '@angular/core';
import { ProductDTO } from '../../../models/product.model';
import { ProductsService } from '../services/products.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  products: ProductDTO[] = [];
  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });

    // To check how to fix (Slowing down products page)
    this.productService.products$.subscribe((filteredProducts) => {
      this.products = filteredProducts;
    });
  }
}
