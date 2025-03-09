import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartItemsCount } from '../../../shared/states/shopping-cart/cart.selectors';
import { takeUntil } from 'rxjs/operators';
import { NAV_ITEMS } from '../../../models/category.model';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { selectUserProfile } from '../../../shared/states/user/user.selectors';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  navItems = NAV_ITEMS;
  isAdmin = false;

  searchTerm: string = '';
  isMobileMenuOpen: boolean = false;
  cartItemsCount: number = 0;
  private destroy$ = new Subject<void>();

  router = inject(Router);
  store = inject(Store);
  authService = inject(AuthService);

  isLoggedIn = false;
  userImage: string | null = null;

  private updateNavigation() {
    // Check admin status and update navigation
    this.authService
      .isAdmin()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
        if (isAdmin) {
          if (!this.navItems.some((item) => item.name === 'Dashboard')) {
            this.navItems.push({
              name: 'Dashboard',
              link: '/admin/products',
            });
          }
        } else {
          if (this.navItems.some((item) => item.name === 'Dashboard')) {
            this.navItems = this.navItems.filter(
              (item) => item.name !== 'Dashboard'
            );
          }
        }
      });
  }

  search(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  submitSearch(): void {
    this.router.navigate(['/products'], {
      queryParams: {
        search: this.searchTerm,
        page: 1,
        category: null,
      },
    });
    this.searchTerm = '';
    this.closeMobileMenu();
  }

  onCategoryClick(categoryLink: string): void {
    const category = categoryLink.split('/').pop();
    if (category) {
      this.router.navigate(['/products'], {
        queryParams: {
          search: null,
          category,
          page: 1,
        },
        queryParamsHandling: 'merge',
      });
    }
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleMobileDropdown(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const dropdown = target.closest('.mobile-dropdown');

    if (dropdown) {
      dropdown.classList.toggle('active');
      event.stopPropagation();
    }
  }

  logout() {
    this.authService.logout();
    this.updateNavigation();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    // Subscribe to cart items count
    this.store
      .select(selectCartItemsCount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((count) => {
        this.cartItemsCount = count;
      });

    // Get user information
    this.store
      .select(selectUserProfile)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.isLoggedIn = !!user;
        this.userImage = user?.image || null;
      });

    // Initial navigation setup
    this.updateNavigation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
