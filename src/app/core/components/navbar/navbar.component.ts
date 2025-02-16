import { Component } from '@angular/core';

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
}
