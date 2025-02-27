import { Component, Input } from '@angular/core';
import { ProductDTO } from '../../../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: ProductDTO;

  constructor(private router: Router) {}

  navigateToDetails() {
    const productName = this.product.title.toLowerCase().replace(/ /g, '-');
    this.router.navigate([`/product-details/${productName}`]);
  }
}
