import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductsService } from '../../../features/products/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  navItems = [
    { name: 'Home', link: '/' },
    {
      name: 'Our Products',
      link: '#',
      categories: [
        { name: "Men's Section", link: '/products/men' },
        { name: "Women's Section", link: '/products/women' },
        { name: 'Electronics', link: '/products/electronics' },
        { name: 'Jewelry', link: '/products/jewelry' },
      ],
    },
    { name: 'Contact', link: '/contact' },
    { name: 'Sale', link: '/products' },
  ];

  searchTerms = new Subject<string>();
  searchTerm: string = '';

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  search(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  submitSearch(): void {
    this.searchTerms.next(this.searchTerm);
    if (this.router.url !== '/products') {
      this.router.navigate(['/products']);
    }
  }

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.productsService.searchProductsByCategory(term)
        )
      )
      .subscribe((results) => {
        this.productsService.updateProducts(results);
        console.log(results);
      });
  }
}
