import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  // @Input() imageUrl!: string;
  // @Input() title!: string;
  // @Input() price!: number;
  // @Input() rating!: number;
  // @Input() reviewsCount!: number;
  // imageUrl: string = 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg';
  // title: string = 'Sample Product';
  // price: number = 29.99;
  // rating: number = 4.5;
  // reviewsCount: number = 120;
  @Input() product!: Product;
}
