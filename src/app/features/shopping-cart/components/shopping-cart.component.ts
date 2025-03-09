import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ICartItem } from '../../../models/shopping-cart.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ShoppingCartFacade } from '../facades/shopping-cart.facade';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { AccountFacade } from '../../../core/authentication/facades/account.facade';
import { UserProfileDTO } from '../../../models/user.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<ICartItem>;
  billingForm: FormGroup;
  paymentMethod: 'card' | 'cash' = 'card';
  private destroy$ = new Subject<void>();
  private userProfile: UserProfileDTO | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'item',
    'price',
    'quantity',
    'total',
    'actions',
  ];

  private cartFacade = inject(ShoppingCartFacade);
  private cartService = inject(ShoppingCartService);
  private accountFacade = inject(AccountFacade);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.billingForm = this.fb.group({
      fullName: ['', Validators.required],
      streetAddress: ['', Validators.required],
      cityCountry: [''],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
    });
    this.dataSource = new MatTableDataSource<ICartItem>([]);
  }

  ngOnInit(): void {
    // Get cart items
    this.cartFacade
      .getCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.dataSource.data = items;
      });

    // Subscribe to user profile and pre-fill billing form
    this.accountFacade.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        if (profile && profile.id !== -1) {
          this.userProfile = profile;

          // Pre-fill billing form with user data
          this.billingForm.patchValue({
            fullName: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            contactNumber: profile.phone,
            streetAddress: profile.address.address,
            cityCountry: `${profile.address.city}, ${profile.address.country}`,
          });
        }
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Getters for template
  get cartItems() {
    return this.cartFacade.cartItems;
  }
  get subtotal() {
    return this.cartFacade.subtotal;
  }
  get vat() {
    return this.cartFacade.vat;
  }
  get total() {
    return this.cartFacade.total;
  }

  incrementQuantity(item: ICartItem): void {
    this.cartFacade.incrementQuantity(item);
  }

  decrementQuantity(item: ICartItem): void {
    this.cartFacade.decrementQuantity(item);
  }

  removeItem(item: ICartItem): void {
    this.cartFacade.removeItem(item);
  }

  placeOrder(): void {
    if (this.cartService.validateOrder(this.billingForm, this.cartItems)) {
      const orderDetails = this.cartService.createOrderDetails(
        this.billingForm,
        this.cartItems,
        this.paymentMethod,
        this.subtotal,
        this.vat,
        this.total
      );

      // Add user ID to order if available
      if (this.userProfile) {
        orderDetails.userId = this.userProfile.id;
      }

      // Call the service but we don't need to handle complex logic
      this.cartService.placeOrder(orderDetails).subscribe(() => {
        this.showSnackbar('Order successfully placed!', 'success');
        this.cartFacade.clearCart();
        this.billingForm.reset();

        // Re-populate form with user data after reset if needed
        if (this.userProfile) {
          this.billingForm.patchValue({
            fullName: `${this.userProfile.firstName} ${this.userProfile.lastName}`,
            email: this.userProfile.email,
            contactNumber: this.userProfile.phone,
            streetAddress: this.userProfile.address.address,
            cityCountry: `${this.userProfile.address.city}, ${this.userProfile.address.country}`,
          });
        }
      });
    } else {
      this.billingForm.markAllAsTouched();
      this.showSnackbar('Please fill in all required fields', 'error');
    }
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    const config: MatSnackBarConfig = {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass:
        type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    };
    this.snackBar.open(message, 'X', config);
  }
}
