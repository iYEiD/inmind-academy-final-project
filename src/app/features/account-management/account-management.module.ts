import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountManagementComponent } from './components/shell/account-management.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaymentComponent } from './components/payment/payment.component';
import { AccountManagementRoutingModule } from './account-management-routing.module';
@NgModule({
  declarations: [
    AccountManagementComponent,
    ProfileComponent,
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountManagementRoutingModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  exports: [AccountManagementComponent, ProfileComponent, PaymentComponent],
})
export class AccountManagementModule {}
