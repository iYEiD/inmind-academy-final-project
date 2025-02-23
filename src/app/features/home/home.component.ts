import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../products/services/products.service';
import { ProductDTO } from '../../models/product.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  categories = [
    {
      name: 'Electronics',
      image: '../../../assets/images/category-electronics-image.png',
      category: 'mobile-accessories',
    },
    {
      name: "Men's Section",
      image: '../../../assets/images/category-men-image.png',
      category: 'mens-shirts',
    },
    {
      name: 'Women Section',
      image: '../../../assets/images/category-girl-image.png',
      category: 'womens-dresses',
    },
    {
      name: 'Jewelery',
      image: '../../../assets/images/category-jewelery-image.png',
      category: 'womens-jewellery',
    },
  ];

  services = [
    {
      name: 'FREE AND FAST DELIVERY',
      description: 'Free delivery on all orders over 140$',
      image: '../../../assets/images/services-delivery-image.png',
    },
    {
      name: '24/7 CUSTOMER SERVICE',
      description: 'Our customer service is available 24/7',
      image: '../../../assets/images/services-customer-image.png',
    },
    {
      name: 'MONEY BACK GUARANTEE',
      description: 'We return money within 30 days',
      image: '../../../assets/images/services-returns-image.png',
    },
  ];

  router = inject(Router);
  navigateToProducts() {
    this.router.navigate(['/products']);
  }
  navigateToCategory(category: string) {
    this.router.navigate(['/products'], {
      queryParams: { category },
    });
  }
  topRatedProducts: ProductDTO[] = [];
  topExploreProducts: ProductDTO[] = [];
  bottomExploreProducts: ProductDTO[] = [];
  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.productService.getProducts(12, 0).subscribe((products) => {
      this.topRatedProducts = products.products.slice(0, 4);
      this.topExploreProducts = products.products.slice(4, 8);
      this.bottomExploreProducts = products.products.slice(8, 12);
    });
  }
}
