import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ICartItem } from '../../../models/shopping-cart.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ShoppingCartFacade } from '../facades/shopping-cart.facade';
import { ShoppingCartService } from '../services/shopping-cart.service';

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
  private fb = inject(FormBuilder);

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

      this.cartService.placeOrder(orderDetails);
      this.cartFacade.clearCart();
      this.billingForm.reset();
    } else {
      this.billingForm.markAllAsTouched();
    }
  }
}
