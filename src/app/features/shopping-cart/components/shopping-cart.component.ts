import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ICartItem } from '../../../models/shopping-cart.model';
import {
  selectCartItems,
  selectTotalPrice,
} from '../../../shared/states/shopping-cart/cart.selectors';
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../../../shared/states/shopping-cart/cart.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cartItems: ICartItem[] = [];
  dataSource: MatTableDataSource<ICartItem>;
  subtotal: number = 0;
  vat: number = 0;
  total: number = 0;
  billingForm: FormGroup;
  paymentMethod: 'card' | 'cash' = 'card';
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Define columns for the Material table
  displayedColumns: string[] = [
    'item',
    'price',
    'quantity',
    'total',
    'actions',
  ];

  store = inject(Store);
  fb = inject(FormBuilder);

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
    this.store
      .select(selectCartItems)
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.cartItems = items;
        this.dataSource.data = items;
      });

    // Get total price
    this.store
      .select(selectTotalPrice)
      .pipe(takeUntil(this.destroy$))
      .subscribe((price) => {
        this.subtotal = price;
        this.vat = this.subtotal * 0.2; // 20% VAT
        this.total = this.subtotal + this.vat;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  incrementQuantity(item: ICartItem): void {
    this.store.dispatch(
      updateQuantity({
        item,
        quantity: item.quantity + 1,
      })
    );
  }

  decrementQuantity(item: ICartItem): void {
    if (item.quantity > 1) {
      this.store.dispatch(
        updateQuantity({
          item,
          quantity: item.quantity - 1,
        })
      );
    }
  }

  removeItem(item: ICartItem): void {
    this.store.dispatch(removeFromCart({ item }));
  }

  placeOrder(): void {
    if (this.billingForm.valid && this.cartItems.length > 0) {
      console.log('Order placed', {
        billingDetails: this.billingForm.value,
        items: this.cartItems,
        paymentMethod: this.paymentMethod,
        subtotal: this.subtotal,
        vat: this.vat,
        total: this.total,
      });

      // Clear the cart after successful order
      this.store.dispatch(clearCart());

      // Reset the form
      this.billingForm.reset();
    } else {
      // Mark all fields as touched to show validation errors
      this.billingForm.markAllAsTouched();
    }
  }
}
