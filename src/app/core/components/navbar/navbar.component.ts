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
        { name: 'Beauty', link: '/products/beauty' },
        { name: 'Fragrances', link: '/products/fragrances' },
        { name: 'Furniture', link: '/products/furniture' },
        { name: 'Groceries', link: '/products/groceries' },
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
        distinctUntilChanged(),
        switchMap((term: string) =>
          this.productsService.searchProductsByName(term)
        )
      )
      .subscribe((results) => {
        this.productsService.updateProducts(results);
        console.log(results);
      });
  }
}
