import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { ProductDTO } from '../../../models/product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product!: ProductDTO;
  quantity = 1;
  relatedProducts: ProductDTO[] = [];

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    // Look to apply NGRX for this in the future
    const productName = this.route.snapshot.paramMap.get('productName');
    if (productName) {
      this.productsService
        .searchProductsByName(productName, 1, 0)
        .subscribe((response) => {
          this.product = response.products[0];
          this.productsService
            .searchProductsByCategory(this.product.category, 4, 1)
            .subscribe((response) => {
              this.relatedProducts = response.products;
            });
        });
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onQuantityChange() {
    if (this.quantity < 1 || isNaN(this.quantity)) {
      this.quantity = 1;
    }
  }
}
